
import { RULE_SPACE, MD_NORMAL_BASE, MD_EX_BASE, MD_NORMAL_TEXT, MD_EX_TEXT } from './configs';
import { IRuleSpace, IRuleOptions, IRuleOptionsInfo, IRuleMap, IRuleEndMap, TRuleType, IRuleMapItem, ITokenItem, } from './iface';
import {  TDocType, TMdType, ruleOptions } from './ttype';

/**
 * 对用户来说，rules：
 * 1. 输入docType，默认html，表示要转换的文档类型
 * 1. 输入mdType，默认普通md，表示是普通md还是扩展md
 * 1. 输入自定义配置，默认用固定配置
 * 然后
 * 1. 输出最终配置给其他类使用
 */
export class Rules {
  // 配置文件配置的规则
  public options: IRuleOptions = MD_NORMAL_BASE.options(RULE_SPACE);
  public titleList: string[] = MD_NORMAL_BASE.titleList || [];
  // 换行、转移、间隔符
  public space: IRuleSpace = RULE_SPACE;
  // 存储用户自定义配置
  public customOptions: IRuleOptions|null = null;
  public isReplace: boolean = false;
  public docType: TDocType = 'html';
  public mdType: TMdType = 'normal';
  // 将options清洗成下面两种，用于token生成tree
  public ruleMap: IRuleMap = {};
  public ruleEndMap: IRuleEndMap = {};
  public blanklineFn: (item: ITokenItem, ruleSpace: IRuleSpace, isRootLine?: boolean) => string = () => {
    return this.space.newline
  }
  constructor () {}

  public generate () {
    // 1. 根据docType得到配置
    let optionsInfo: IRuleOptionsInfo = this.docType === 'html' ? MD_NORMAL_BASE : MD_NORMAL_TEXT;
    this.options = optionsInfo.options(this.space);
    this.titleList = optionsInfo.titleList || [];
    if (optionsInfo.blankline) { this.blanklineFn = optionsInfo.blankline;}
    // 2. 根据mdType确定是否需要添加配置
    if (this.mdType === 'ex') {
      let optionsInfoEx: IRuleOptionsInfo = this.docType === 'html' ? MD_EX_BASE : MD_EX_TEXT;
      this.titleList = optionsInfoEx.titleList ? optionsInfoEx.titleList : this.titleList;
      this.mergeOptions(this.options, optionsInfoEx.options(this.space));
      if (optionsInfoEx.blankline) { this.blanklineFn = optionsInfoEx.blankline;}
    }
    // 3. 根据用户配置刷新最后的配置
    if (this.isReplace && this.customOptions) {
      this.options = this.customOptions;
    } else if (this.customOptions) {
      this.mergeOptions(this.options, this.customOptions);
    }
    this.washOptions();
  }

  /**
   * 重新生成规则并返回
   */
  public getRules () {
    this.generate();
    return this.options;
  }

  /**
   * 设置规则
   * @param rules 
   */
  public setRules (rules: ruleOptions) {
    this.isReplace = rules.isReplace ? true : false;
    this.customOptions = rules.options ? rules.options : null;
    this.docType = rules.docType ? rules.docType : 'html';
    this.mdType = rules.mdType ? rules.mdType : 'normal';
    this.titleList = rules.titleList ? rules.titleList : this.titleList;
    this.blanklineFn = rules.blankline ? rules.blankline : this.blanklineFn;
  }
  /**
   * wash rule options
   * @returns 
   */
  private washOptions () {
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

  private washEndInfo (k: string, type: TRuleType, useKey: 'start' | 'end') {
    if (!this.options) return {}
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
      isAtom: this.options[k].isAtom || false,
      isList: this.options[k].isList || false,
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
   * 合并配置，无则添加，有则替换
   * @param op1 
   * @param op2 
   * @returns 
   */
   private mergeOptions (op1: IRuleOptions, op2: IRuleOptions) {
    Object.keys(op2).forEach(k => {
      if (k in op1) {
        Object.assign(op1[k], op2[k]);
      } else {
        op1[k] = op2[k];
      }
    })
    return op1;
  }
}
