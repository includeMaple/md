// 切割规则，如何定义换行和空格
export interface IStringSpace {
  newline: string, // 换行符
  space: string, // 分隔符
  escape: string, // 转意字符
}
// 匹配规则，用于配制
export interface IRuleOptions {
  [key: string]: {
    start: string,
    end: string,
    isAtom?: boolean, // 原子性，表示不可切割，内部不论匹配到什么情况，不找到结束标志不创造token
    isBlock?: boolean // 元素内部是否可换行，true表示可换行
  }
}
export type TRuleType = 'start'|'end'|'startEnd';
// 匹配规则，将配置文件清洗成使用模式
export interface IRuleInfoItem {
  type: TRuleType, // 规则类型
  data: string,
  len: number,
  isBlock: boolean,
  key: string,
  isAtom: boolean,
}
export interface IRuleMap {
  [key: string]: IRuleInfoItem[]
}
export type TTokenType = 'start'|'end'|'content'|'startEnd'|'token'
export interface ITokenItem {
  type: TTokenType,
  data: string,
  key: string,
}