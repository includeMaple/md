
import { STRING_SPACE, RULE_OPTIONS } from './configs';
import { IStringSpace, IRuleOptions, IRuleInfoItem, TRuleType } from './iface';

export class Rules {
  public rule: IStringSpace = STRING_SPACE;
  private options: IRuleOptions = RULE_OPTIONS;
  public ruleMap: {[key: string]: IRuleInfoItem[]} = {}
  // public endToStart: any = {}
  constructor () {
    this.washOptions();
  }

  /**
   * set string_space rules
   * @param rules 
   */
  setRules (rules: IStringSpace) {
    this.rule = Object.assign(this.rule, rules)
  }

  /**
   * set rule options
   * @param opt 
   */
  setOptions (opt: IRuleOptions) {
    this.options = Object.assign(this.options, opt)
  }

  washEndInfo (k: string, type: TRuleType, useKey: 'start'|'end') {
    let isBlock = (this.options[k]['end'] && this.options[k]['end'].indexOf(this.rule.newline) >= 0) || this.options[k].isBlock;
    let firstWord = this.options[k][useKey][0];

    let ruleInfo: IRuleInfoItem = {
      type: type,
      data: this.options[k][useKey],
      len: this.options[k][useKey].length,
      isBlock: isBlock || false,
      key: k,
      isAtom: this.options[k].isAtom || false,
    }

    if (firstWord in this.ruleMap) {
      this.ruleMap[firstWord].push(ruleInfo);
    } else {
      this.ruleMap[firstWord] = [ruleInfo];
    }


    // let isBlock = (this.options[k]['end'] && this.options[k]['end'].indexOf(this.rule.newline) >= 0) || this.options[k].isBlock
    // (this.options[k]['startEnd'] && this.options[k]['startEnd'].indexOf(this.rule.newline) >= 0) ||
    //   (this.options[k]['start'] && this.options[k]['start'].indexOf(this.rule.newline) >= 0) ||
    //   (this.options[k]['start'] && this.options[k]['startEnd'].isBlock)
    // if (this.options[k]['end'] || this.options[k]['startEnd']) {
    //   let startType = this.options[k].start || this.options[k].startEnd
    //   let endType = this.options[k].end || this.options[k].startEnd
    //   if (Object.prototype.hasOwnProperty.call(this.endToStart, endType)) {
    //     if (this.endToStart[endType].indexOf(startType) < 0) {
    //       this.endToStart[endType].push(startType)
    //     }
    //   } else {
    //     this.endToStart[endType] = [startType]
    //   }
    // }
    // let endInfo = {
    //   type: type,
    //   data: this.options[k][useKey],
    //   len: this.options[k][useKey].length,
    //   isBlock: isBlock,
    //   key: k,
    //   isAtom: this.options[k].isAtom
    // }
    // let first = this.options[k][useKey][0]
    // if (!Object.prototype.hasOwnProperty.call(this.ruleMap, first)) {
    //   this.ruleMap[first] = [endInfo]
    // } else {
    //   this.ruleMap[first].push(endInfo)
    // }
  }

  /**
   * wash rule options
   * @returns 
   */
  washOptions () {
    for(let k in this.options) {
      if (this.options[k]['start'] === this.options[k]['end']) {
        this.washEndInfo(k, 'startEnd', 'start')
      } else {
        this.washEndInfo(k, 'start', 'start')
        this.washEndInfo(k, 'end', 'end')
      }
    }
    // 规则排序
    for (let k in this.ruleMap) {
      this.ruleMap[k].sort(function(one: any, two: any) {
        return two.len - one.len
      })
    }
    return this.ruleMap
  }
}
