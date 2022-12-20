
import { Stack, StackOne } from './stack';
import { RULE_SPACE } from './configs';
import { IRuleSpace, IRuleMap, ITokenItem, TTokenType, IRuleEndMap, ITreeNode } from './iface';
import { Rules } from './rules';
export class Token {
  public ruleSpace: IRuleSpace = RULE_SPACE;
  public document = '';
  private token: ITokenItem[] = [];
  private tree: ITreeNode[] = [];

  constructor (public rules: Rules) {
    this.ruleSpace = this.rules.space;
  }

  getToken (document: string) {
    // 初始化
    this.document = document? document: this.document;
    // 生成token stream
    this.toknStream();
    // 生成抽象语法树
    this.tokenTree();
    return this.tree;
  }

  /**
   * 词法解析，生成token流
   * @param ruleMap 
   */
  toknStream () {
    let ruleMap: IRuleMap = this.rules.ruleMap;
    this.token = [];
    // 上次扫描到的位置
    let lastPoint: number = 0;
    // 扫描文档流
    for (let i=0; i<this.document.length; i++) {
      let s = this.document[i];
      // 转义字符处理
      if (s === this.ruleSpace.escape) {
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
              id: this.getId()
            })
          }
          this.token.push({
            type: rule[j].type,
            data: docMayToken,
            key: rule[j].key,
            isBlock: rule[j].isBlock ? true : false,
            id: this.getId()
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
        id: this.getId()
      })
    }
    return this.token;
  }

  tokenTree () {
    let ruleEndMap: IRuleEndMap = this.rules.ruleEndMap;
    let stackOne = new StackOne(this.token);
    let startEndStack = new Stack();
    stackOne.wash((item: ITokenItem) => {
      if (item.type === 'start' || item.type === 'content') {
        return true;
      } else if (item.type === 'end') {
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
    }, (item: ITokenItem)=> {
      if (item.type === 'start' || item.type === 'startEnd') {
        if (ruleEndMap[item.key].indexOf(item.data) > -1) {
          return false
        }
        return false
      }
      return true;
    }, (item: ITokenItem) => {
      let node: ITreeNode = {
        key: item.key,
        type: item.isBlock ? 'block' : 'content',
        id: this.getId(),
        children: [{
          key: item.key,
          type: item.isBlock ? 'block' : 'content',
          data: item.data,
          id: this.getId()
        }]
      }
      return node;
    })
    this.tree = stackOne.stackData.getData() as ITreeNode[];
    return this.tree;
  }

  getId () {
    return `${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}`
  }
}
