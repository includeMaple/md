
import { Stack, Stream2tree } from './stack';
import { IRuleMap, ITokenItem, IRuleEndMap } from './iface';
import { toolbox } from './utils';
import { Rules } from './rules';
export class Token {
  public rules: Rules = new Rules();
  public document = '';
  private token: ITokenItem[] = [];
  private tree: ITokenItem[] = [];

  constructor () {}


  getToken (document: string) {
    // 初始化
    this.document = document? document: this.document;
    // 生成token stream
    this.toknStream();
    // 生成抽象语法树
    this.tokenTree();
    return [{
      tokenType: 'content',
      nodeType: 'content',
      key: 'content',
      id: toolbox.generateId(),
      children: this.tree,
      value: ''
    }];
  }

  setRule (rules: Rules) {
    this.rules = rules;
  }

  /**
   * 词法解析，生成token流
   * @param ruleMap 
   */
  private toknStream () {
    let ruleMap: IRuleMap = this.rules.ruleMap;
    this.token = [];
    // 上次扫描到的位置
    let lastPoint: number = 0;
    let atomDataNum = 0; // 标识是否设置autodata，第一次遇到要设置，第二次遇到要不设置
    let atomData = ''; // autodata
    // 扫描文档流
    for (let i=0; i<this.document.length; i++) {
      let s = this.document[i];
      // 转义字符处理
      if (s === this.rules.space.escape) {
        i += 1;
        continue;
      }
      // 生成token
      if (Object.prototype.hasOwnProperty.call(ruleMap, s)) {
        // 扫描规则，是否符合
        let rule = ruleMap[s];
        for (let j=0; j< rule.length; j++) {
          let docMayToken = this.document.substring(i, i+rule[j].len);
          if (docMayToken !== rule[j].data) {
            continue;
          }
          // 等于的情况中，要挑出atom的情况，奇数进入原子期，期间直到找到下一个原子才能停止
          if (rule[j].isAtom) {
            atomDataNum += 1;
            atomData = rule[j].data;
          }
          if (atomDataNum % 2 === 1 && (rule[j].data !== atomData)) {
            continue;
          }
          // 存入之前的内容
          if (lastPoint < i) {
            this.token.push({
              tokenType: 'content',
              data: this.document.substring(lastPoint, i),
              key: 'content',
              isBlock: false,
              id: toolbox.generateId(),
              isList: false,
              value: ''
            })
          }
          this.token.push({
            tokenType: rule[j].type,
            data: docMayToken,
            key: rule[j].key,
            isBlock: rule[j].isBlock || false,
            id: toolbox.generateId(),
            isList: rule[j].isList,
            value: '',
            isRootLine: docMayToken === this.rules.space.newline || false
          })
          lastPoint = i + rule[j].len;
          i = lastPoint - 1;
          break;
        }
      }
    }
    if (lastPoint < this.document.length) {
      this.token.push({
        tokenType: 'content',
        data: this.document.substring(lastPoint, this.document.length),
        key: 'content',
        isBlock: false,
        id: toolbox.generateId(),
        value: '',
        isList: false,
      })
    }
    return this.token;
  }

  private tokenTree () {
    let ruleEndMap: IRuleEndMap = this.rules.ruleEndMap;
    let stream2tree = new Stream2tree(this.token);
    let startEndStack = new Stack();
    stream2tree.wash((i, t) => { // isGenerateStackNode
      let item: ITokenItem = i as ITokenItem; // 实际也可能是ITokenNode
      let top: undefined|ITokenItem = t as (undefined|ITokenItem); // 实际也可能是ITokenNode
      if (!top) { return false; }
      return (top.isList && top.children && item.key !== top?.key) || false;
    }, (i, t) => { // isStopGenerateStackNode
      let item: ITokenItem = i as ITokenItem;
      let top: ITokenItem = t as ITokenItem;
      return item.key !== top.key;
    }, (i) => { // gennerateStackNode
      let item = i as ITokenItem;
      let node: ITokenItem = {
        key: item.key,
        tokenType: item.tokenType,
        isBlock: true,
        id: toolbox.generateId(),
        value: '',
        isList: false,
        data: item.data,
        children: [item],
      }
      return node as {children: unknown[]};
    }, (i, t) => { // stopInFn
      let item = i as ITokenItem; // item 一定是token
      let top = t as undefined|ITokenItem|ITokenItem;
      if (item.tokenType === 'start' || item.tokenType === 'content') { return true; }
      else if (item.tokenType === 'end') {
        // 第一个换行符和top是block，而当前item是换行的情况
        if (!top || top.isBlock && item.data === this.rules.space.newline) {
          return true;
        }
        return false;
      }
      // startEnd的情况
      let lastStartEnd: undefined|ITokenItem = startEndStack.getTop() as undefined | ITokenItem;
      if (lastStartEnd && lastStartEnd?.data === item.data) {
        startEndStack.pop();
        return false;
      }
      startEndStack.push(item);
      return true;
    }, (i, top, ttop) => { // 应该把这里的top都升为ITokenItem
      let t = top as ITokenItem;
      let tt = ttop as ITokenItem;
      let item: ITokenItem = i as ITokenItem;
      // block的级别比较高，所以当top是block的时候停止pop，结束本次升树操作
      if (t.isBlock && item.isBlock) {
        return false;
      }
      // 找到了start（startEnd也可能是start），结束本次升树操作
      if ((t.tokenType === 'start' || t.tokenType === 'startEnd') && t.data && ruleEndMap[t.key].indexOf(t.data) > -1) {
        return false;
      }
      if (tt && tt.isBlock && (tt.tokenType === 'end' || tt.tokenType === 'content')) {
        return false;
      }
      return true;
    }, (i) => {
      // 这里确保所有非叶子节点都从tokenNode变成了treeNode，第一个进入的叶子节点也变成treeNode，另外需要把所有叶子节点从token变成treeNode
      let item = i as ITokenItem;
      let node: ITokenItem = {
        key: item.key,
        tokenType: item.tokenType,
        // @ts-ignore
        nodeType: 'content',
        isBlock: item.isBlock,
        id: toolbox.generateId(),
        value: '',
        isList: item.isList || false,
        children: [{
          key: item.key,
          tokenType: item.tokenType,
          isBlock: item.isBlock,
          data: item.data,
          id: toolbox.generateId(),
          value: '',
          isList: item.isList || false,
        }]
      }
      return node as {children: unknown[]};
    }, (i) => { // 升树前对node进行更新
      let item: ITokenItem = i as ITokenItem;
      if (item.children && item.children.length > 0) {
        item.key = item.children[0].key; // 开始的key和isList才是最准确的
        item.isList = item.children[0].isList;
      }
    })
    this.tree = stream2tree.stackData.getData() as ITokenItem[];
    return this.tree;
  }
}
