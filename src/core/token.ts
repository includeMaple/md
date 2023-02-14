
import { IRuleMap, ITokenItem, IRuleEndMap } from './iface';
import { toolbox } from '../utils';
import { Rules } from './rules';
export class Token {
  public rules: Rules = new Rules();
  public document = '';
  private token: ITokenItem[] = [];
  private tree: ITokenItem[] = [];

  constructor () {}

  convert (document: string): ITokenItem[] {
    // 初始化
    this.document = document? document: this.document;
    // 生成token stream
    this.toknStream();
    return this.token;
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

      if (s === this.rules.space.escape) {
        i += 1;
        lastPoint += 1;
        continue;
      } else if (s === this.rules.space.newline) {
        if (lastPoint < i - 1) {
          this.token.push({
            id: toolbox.generateId(),
            type: 'checked',
            key: 'content',
            data: this.document.substring(lastPoint, i),
            isBlock: false,
            isList: false,
            value: '',
            isComple: true
          })
        }
        this.token.push(this.generateNewline(s));
        lastPoint = i;
        continue;
      }
      // 生成token
      if (Object.prototype.hasOwnProperty.call(ruleMap, s)) {
        // 扫描规则，是否符合
        let rule = ruleMap[s];
        for (let j=0; j< rule.length; j++) {
          let docMayToken = this.document.substring(i, i+rule[j].len);
          if (docMayToken !== rule[j].data && rule[j]?.status?.length === 0) {
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
          // 存入之前的内容content
          if (lastPoint < i - 1) {
            this.token.push({
              id: toolbox.generateId(),
              type: 'checked',
              key: 'content',
              data: this.document.substring(lastPoint, i),
              isBlock: false,
              isList: false,
              value: '',
              isComple: true
            })
            lastPoint = i;
          }
          this.token.push({
            id: toolbox.generateId(),
            type: rule[j].type,
            data: docMayToken,
            key: rule[j].key,
            isBlock: rule[j].isBlock || false,
            isList: rule[j].isList,
            isComple: false,
          })
          lastPoint = i + rule[j].len;
          i = lastPoint - 1;
          break;
        }
      }
    }
    if (lastPoint < this.document.length) {
      this.token.push({
        type: 'checked',
        data: this.document.substring(lastPoint, this.document.length),
        key: 'content',
        isBlock: false,
        id: toolbox.generateId(),
        isList: false,
        isComple: true
      })
    }
    return this.token;
  }

  generateNewline (s: string): ITokenItem {
    return {
      type: 'checked',
      data: this.rules.space.newline,
      key: 'newline',
      isBlock: true,
      id: toolbox.generateId(),
      isList: false,
      isComple: false,
    }
  }
}
