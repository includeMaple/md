// 切割规则，如何定义换行和空格
export interface IRuleSpace {
  newline: string, // 换行符
  space: string, // 分隔符
  escape: string, // 转意字符
}
// 文件用配置，匹配规则，用于configs中进行配置
export interface IRuleOptionsInfo {
  type?: string,
  desc?: string,
  titleList?: string[],
  // 需要根据配置动态加载换行和空格等
  options: (ruleSpace: IRuleSpace) => IRuleOptions
}
// 配置项
export interface IRuleOptions {
  [key: string]: {
    start: string,
    end: string,
    isAtom?: boolean, // 原子性，表示不可切割，内部不论匹配到什么情况，不找到结束标志不创造token
    isBlock?: boolean, // 元素内部是否可换行，true表示可换行
    render?: (item: ITreeNode) => string
  }
}

// 下面提供程序内使用
export type TRuleType = 'start'|'end'|'startEnd';
// 匹配规则，将配置文件清洗成使用模式
export interface IRuleMapItem {
  type: TRuleType, // 规则类型
  data: string,
  len: number,
  isBlock: boolean,
  key: string,
  isAtom: boolean,
}
export interface IRuleMap {
  [key: string]: IRuleMapItem[]
}
export interface IRuleEndMap {
  [key: string]: string[]
}

export type TTokenType = 'start'|'end'|'content'|'startEnd';
export interface ITokenItem {
  type: TTokenType,
  data: string,
  key: string,
  isBlock: boolean,
  id: string
}

export type TTreeType = 'content'|'block'|'keyword';
export interface ITreeNode {
  type: TTreeType,
  children?: ITreeNode[],
  key: string,
  data?: string,
  id: string,
  value: string
}

export interface IRenderOption {
  title: string[],
  options: {[key: string]: (item: ITreeNode) => string}
}
