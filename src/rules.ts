
import { RULE_SPACE, RULE_OPTIONS } from './configs';
import { IRuleSpace, IRuleOptions, IRuleMap, IRuleEndMap, TRuleType, IRuleMapItem } from './iface';

export class Rules {
  // 配置文件配置的规则
  private options: IRuleOptions = RULE_OPTIONS;
  // 换行、转移、间隔符
  public space: IRuleSpace = RULE_SPACE;
  // 将options清洗成下面两种，用于token生成tree
  public ruleMap: IRuleMap = {};
  public ruleEndMap: IRuleEndMap = {};
  constructor () {
    this.washOptions();
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
  }

  washEndInfo (k: string, type: TRuleType, useKey: 'start'|'end') {
    let isBlock = (this.options[k]['end'] && this.options[k]['end'].indexOf(this.space.newline) >= 0) || this.options[k].isBlock;
    let firstWord = this.options[k][useKey][0];
    let data = this.options[k][useKey];
    // 生成ruleMap
    let ruleInfo: IRuleMapItem = {
      type: type,
      data: data,
      len: data.length,
      isBlock: isBlock || false,
      key: k,
      isAtom: this.options[k].isAtom || false, // 这个是做啥来着，todo
    }
    if (firstWord in this.ruleMap) {
      this.ruleMap[firstWord].push(ruleInfo);
    } else {
      this.ruleMap[firstWord] = [ruleInfo];
    }
    // 生成ruleEndMap
    if (type !== 'start' && Object.prototype.hasOwnProperty.call(this.ruleEndMap, k)) {
      if (this.ruleEndMap[k].indexOf(k) < 0) {
        this.ruleEndMap[k].push(data);
      }
    } else {
      this.ruleEndMap[k] = [data];
    }
  }
  /**
   * set RULE_SPACE rules
   * @param rules 
   */
   setRules (rules: IRuleSpace) {
    this.space = Object.assign(this.space, rules)
  }

  /**
   * set rule options
   * @param opt 
   */
  setOptions (opt: IRuleOptions) {
    this.options = Object.assign(this.options, opt)
  }
}

export let rules = new Rules();