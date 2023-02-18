
import { IRuleMap, ITokenItem, IRuleMapItem } from './iface';
import { toolbox } from '../utils';
import { Rules } from './rules';
export class Token {
  public rules: Rules = new Rules();
  public document = '';
  private token: ITokenItem[] = [];

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
    // let atomData = ''; // autodata
    let atomDataIsBlock = false;
    let atomDataItem: IRuleMapItem|null = null;
    // 扫描文档流
    for (let i=0; i<this.document.length; i++) {
      let s = this.document[i];

      // 生成token
      if (Object.prototype.hasOwnProperty.call(ruleMap, s)) {
        // 扫描规则，是否符合
        let rule = ruleMap[s];
        for (let j=0; j< rule.length; j++) {
          let docMayToken = this.document.substring(i, i+rule[j].len);
          if (docMayToken !== rule[j].data && !rule[j].status) {
            continue;
          }
          
          // 等于的情况中，要挑出atom的情况，奇数进入原子期，期间直到找到下一个原子才能停止
          if (rule[j].isAtom && rule[j].includeSelf && rule[j].data === atomDataItem?.data) {
            continue;
          }
          if (rule[j].isAtom) {
            atomDataItem = rule[j];
            atomDataNum += 1;
            atomDataIsBlock = rule[j].isBlock
            lastPoint = this.generateContent(lastPoint, i);

            this.token.push({
              id: toolbox.generateId(),
              type: rule[j].type,
              data: docMayToken,
              key: rule[j].key,
              isBlock: rule[j].isBlock || false,
              isList: rule[j].isList,
              isComple: false,
              value: ''
            })
            lastPoint = i + rule[j].len;
            i = lastPoint - 1;
            continue;
          }
          if (atomDataNum % 2 === 1 && (rule[j].data !== atomDataItem?.data)) {
            continue;
          }
          atomDataItem = null;
          atomDataIsBlock = false;

          lastPoint = this.generateContent(lastPoint, i);
          this.token.push({
            id: toolbox.generateId(),
            type: rule[j].type,
            data: docMayToken,
            key: rule[j].key,
            isBlock: rule[j].isBlock || false,
            isList: rule[j].isList,
            isComple: false,
            value: ''
          })
          lastPoint = i + rule[j].len;
          i = lastPoint - 1;
          break;
        }
      } else {
        if (s === this.rules.space.escape) {
          lastPoint += this.rules.space.escape.length;
          continue;
        } else if (s === this.rules.space.newline) {
          if (atomDataIsBlock) {
            lastPoint = this.generateContent(lastPoint, i);
            atomDataIsBlock = false;
            atomDataNum = 0;
            atomDataItem = null;
          }
              
          lastPoint = this.generateContent(lastPoint, i);
          this.token.push(this.generateNewline(s));
          lastPoint = i + 1;
          continue;
        }
      }
    }
    lastPoint = this.generateContent(lastPoint, this.document.length);
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
      value: ''
    }
  }

  generateContent (lastPoint: number, i: number):number {
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
      return i;
    }
    return lastPoint;
  }
}
