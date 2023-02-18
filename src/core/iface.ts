// 切割规则，如何定义换行和空格
export interface IRuleSpace {
  newline: string, // 换行符
  space: string, // 分隔符
  escape: string, // 转意字符
}
export type TRuleType = 'start'|'end'|'startEnd';

// 文件用配置，匹配规则，用于configs中进行配置
export interface IRuleOptionsInfo {
  type?: string,
  desc?: string,
  titleList?: string[],
  // 需要根据配置动态加载换行和空格等
  options: (ruleSpace: IRuleSpace) => IRuleOptions,
  newline?: (item: ITokenItem) => string
}

export interface IRuleOptionsItem {
  type?: TRuleType,
  start: string,
  end: string,
  status?: string[],
  isAtom?: boolean, // 原子性，表示不可切割，内部不论匹配到什么情况，不找到结束标志不创造token
  includeSelf?: boolean,
  isBlock?: boolean, // 元素内部是否可换行，true表示可换行
  isList?: boolean, // 是否和前后作为一个组
  render?: (item: ITokenItem) => string
}
// 配置项
export interface IRuleOptions {
  [key: string]: IRuleOptionsItem
}

// 匹配规则，将配置文件清洗成使用模式
export interface IRuleMapItem {
  type: TRuleType, // 规则类型
  data: string,
  len: number,
  isBlock: boolean,
  key: string,
  isAtom: boolean,
  isList: boolean,
  status?: string[],
  includeSelf: boolean,
}
export interface IRuleMap {
  [key: string]: IRuleMapItem[]
}
export interface IRuleMapStatus {
  [key: string]: IRuleMapItem
}
export interface IRuleEndMap {
  [key: string]: string[]
}

export type TType = 'start'|'end'|'startEnd'|'checked';
export interface ITokenItem {
  // 基本数据
  id: string,
  type: TType,
  key: 'content'|'newline'|'root'|string,
  data: string,
  isBlock: boolean,
  isList: boolean,
  isComple: boolean,
  children?: ITokenItem[],
  // reander时使用
  value: string,
}

export interface IRenderOption {
  title: string[],
  options: {[key: string]: (item: ITokenItem) => string}
}
