import * as path from 'path';
import { readdir, stat, writeFile, readFile } from 'fs/promises';
import { IConfigs, IPathNode } from './iface';

export class FileList {
  private tree: Array<IPathNode> = [];
  private nodeNum: number = 0;

  constructor (public configs: IConfigs) {}

  /**
   * 获取文件列表，将层级文件全部平摊
   */
  async getFileList () {
    await this.getNode(this.configs.entry, this.tree);
    return this.tree;
  }

  /**
   * 读取单个文件
   * @param path 
   * @returns 
   */
  async read (url: string) {
    try {
      let res = await readFile(url, { encoding: 'utf-8' });
      return res;
    } catch (error) {
      console.error(error);
      return '';
    }
  }
  
  async write (info: IPathNode, doc: string) {
    try {
      let filePath = `${path.resolve(__dirname, this.configs.out)}${this.configs.joiner}${info.name}.html`;
      await writeFile(filePath, doc);
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * get Node
   */
  private async getNode (baseUrl: string, parent?: Array<IPathNode>) {
    if (!parent) { return; }
    try {
      let entryPath = path.resolve(__dirname, baseUrl)
      let files = await readdir(entryPath);
      for(let item of files) {
        let type = await this.getType(entryPath, item);
        let node = this.createNode(type, entryPath, item);
        parent.push(node);
        if (type === 'directory') {
          this.getNode(`${entryPath}${this.configs.joiner}${item}`, node.children)
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * createNode
   * @param type file or directory
   * @param path baseUrl
   * @param value name(file or directory)
   * @returns IPathNode
   */
  private createNode (type: string, path: string, value: string) {
    let res: IPathNode = {
      path: `${path}${this.configs.joiner}`,
      fullpath: `${path}${this.configs.joiner}${value}`,
      type: type,
      nodeId: this.getNodeId(),
      name: value,
      fullname: value
    }
    if (type === 'file') {
      let nameList = value.split('.')
      res.extension = nameList.pop();
      res.name = nameList.join('.')
    } else if (type === 'directory') {
      res.children = [];
    }
    return res;
  }

  /**
   * get node id
   * temp
   * @returns 
   */
  private getNodeId () { return String(this.nodeNum ++); }

  private async getType (baseUrl: string, file: string) {
    let res = await stat(path.join(baseUrl, file));
    if (res.isFile()) {
      return 'file';
    } else if (res.isDirectory()) {
      return 'directory';
    }
    return ''
  }

  /**
   * create configs
   */
  private async createConfigs () {
    await this.getNode(this.configs.entry, this.tree);
    // try {
    //   let filePath = path.resolve(__dirname, this.configs.out);
    //   let fileContent = `var data = ${JSON.stringify(this.tree)}`;
    //   await writeFile(filePath, fileContent);
    // } catch (error) {
    //   console.error(error);
    // }
  }
}

// console.log(fileList.tree)