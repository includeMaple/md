
import { Stack, StackOne } from './stack';
import { IRuleMap, ITokenItem, IRuleEndMap, ITreeNode } from './iface';
import { toolbox } from './utils';
import { Rules } from './rules';
export class Token {
  public rules: Rules = new Rules()
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
    return this.tree;
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
              type: 'content',
              data: this.document.substring(lastPoint, i),
              key: 'content',
              isBlock: false,
              id: toolbox.generateId()
            })
          }
          this.token.push({
            type: rule[j].type,
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
        type: 'content',
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
    let stackOne = new StackOne(this.token);
    let startEndStack = new Stack();
    stackOne.wash((i, t) => {
      let item = i as ITokenItem;
      let top = t as ITreeNode;
      if (item.type === 'start' || item.type === 'content') {
        return true;
      } else if (item.type === 'end') {
        if (top.type === 'block' && item.data === this.rules.space.newline) {
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
    }, (i, top) => {
      let t = top as any;
      let it = i as ITokenItem;
      if (t.type === 'block' && it.isBlock) {
        return false;
      }
      if (t.type === 'start' || t.type === 'startEnd') {
        if (ruleEndMap[t.key].indexOf(t.data) > -1) {
          return false;
        }
        return false;
      }
      return true;
    }, (i) => {
      let item = i as ITokenItem;
      let node: ITreeNode = {
        key: item.key,
        type: item.isBlock ? 'block' : 'content',
        id: toolbox.generateId(),
        value: '',
        children: [{
          key: item.key,
          type: item.type === 'content' ? (item.isBlock ?'block' : 'content') : 'keyword',
          data: item.data,
          id: toolbox.generateId(),
          value: ''
        }]
      }
      return node as {children: unknown[]};
    })
    this.tree = stackOne.stackData.getData() as ITreeNode[];
    return this.tree;
  }
}
