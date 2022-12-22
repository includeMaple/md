import { IRuleOptions } from './iface';

// 文件
export type TDocType = 'html'|'text';
export type TMdType = 'normal'|'ex';

// 用户配置用
export type ruleOptions = {
  docType?: TDocType, // 文档类型
  mdType?: TMdType, // md类型
  options?: IRuleOptions, // 解析和渲染规则
  isReplace?: boolean, // 是否使用options直接替换所有规则
  titleList?: string[], // 标题列表
  blankline?: () => string
}