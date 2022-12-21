export interface IConfigs {
  entry: string,
  out: string,
  joiner: string
}

export interface IPathNode {
  path: string, // 只到文件夹
  fullpath: string, // 包括名称和扩展名
  type: string, // 'file' | 'directory'
  extension?: string, // 扩展名
  nodeId: string,
  children?: Array<IPathNode>,
  name: string, // 名称不包括扩展名
  fullname: string // 名称包括扩展名
}