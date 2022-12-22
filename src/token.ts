
import { Stack, Stream2tree } from './stack';
import { IRuleMap, ITokenItem, IRuleEndMap, ITreeNode } from './iface';
import { toolbox } from './utils';
import { Rules } from './rules';
export class Token {
  public rules: Rules = new Rules();
  public document = '';
  private token: ITokenItem[] = [];
  private tree: ITreeNode[] = [];

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
          if ( docMayToken !== rule[j].data) {
            continue;
          }
          // 存入之前的内容
          if (lastPoint < i) {
            this.token.push({
              tokenType: 'content',
              data: this.document.substring(lastPoint, i),
              key: 'content',
              isBlock: false,
              id: toolbox.generateId()
            })
          }
          this.token.push({
            tokenType: rule[j].type,
            data: docMayToken,
            key: rule[j].key,
            isBlock: rule[j].isBlock ? true : false,
            id: toolbox.generateId()
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
        id: toolbox.generateId()
      })
    }
    return this.token;
  }

  private tokenTree () {
    let ruleEndMap: IRuleEndMap = this.rules.ruleEndMap;
    let stream2tree = new Stream2tree(this.token);
    let startEndStack = new Stack();
    stream2tree.wash((i, t) => {
      let item = i as ITokenItem; // item 一定是token
      let top = t as undefined|ITokenItem|ITreeNode;
      if (item.tokenType === 'start' || item.tokenType === 'content') { return true; }
      else if (item.tokenType === 'end') {
        // 第一个换行符和top是block，而当前item是换行的情况
        if (!top ||
          ((top as ITreeNode).nodeType === 'block' || (top as ITokenItem).isBlock) &&
          item.data === this.rules.space.newline) {
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
    }, (i, top) => { // 应该把这里的top都升为ITreeNode
      let t = this.token2treeNode(top) as ITreeNode;
      let it: ITreeNode = (this.token2treeNode(i) as ITreeNode);
      // block的级别比较高，所以当top是block的时候停止pop，结束本次升树操作
      if (t.nodeType === 'block' && it.nodeType === 'block') {
        return false;
      }
      // 找到了start（startEnd也可能是start），结束本次升树操作
      if ((t.tokenType === 'start' || t.tokenType === 'startEnd') && t.data && ruleEndMap[t.key].indexOf(t.data) > -1) {
        return false;
      }
      return true;
    }, (i) => {
      // 这里确保所有非叶子节点都从tokenNode变成了treeNode，第一个进入的叶子节点也变成treeNode，另外需要把所有叶子节点从token变成treeNode
      let item = i as ITokenItem;
      let node: ITreeNode = {
        key: item.key,
        tokenType: item.tokenType,
        nodeType: item.isBlock ? 'block' : 'content',
        id: toolbox.generateId(),
        value: '',
        children: [{
          key: item.key,
          tokenType: item.tokenType,
          nodeType: item.tokenType === 'content' ? (item.isBlock ?'block' : 'content') : 'keyword',
          data: item.data,
          id: toolbox.generateId(),
          value: ''
        }]
      }
      return node as {children: unknown[]};
    })
    this.tree = stream2tree.stackData.getData() as ITreeNode[];
    return this.tree;
  }

  /**
   * 把叶子节点的tokenNode转为treeNode
   * @param item 
   * @returns 
   */
  private token2treeNode (item: unknown) {
    let i: any = item;
    // @ts-ignore
    i.nodeType = i.isBlock ? 'block' :
      (i.tokenType === 'start' || i.tokenType === 'end' || i.tokenType === 'startEnd') ? 'keyword' : 'content';
    // @ts-ignore
    i.value = '';
    i.data = i.data || '';
    // @ts-ignore
    delete i.isBlock;
    return i;
  }
}
