// 文件的转换，服务等还是需要使用node或者其他语言，目前暂时使用node写
// 1. 后续拆分出去

import { MdC } from '../index';
import { FileList } from './filelist';
import { CONFIGS } from './configs';
import { IPathNode } from './iface';


class Md2html {
  public md = new MdC();
  public fileList = new FileList(CONFIGS);

  async exec () {
    // 获取目录下的文件列表
    let li: IPathNode[]= await this.fileList.getFileList();

    // 文件列表中每个文件做：1、读取文件内容；2、转换为html；3、写入文件
    li.forEach(async (item: IPathNode) => {
      let res = await this.fileList.read(item.fullpath);
      // 转换为html
      let markdown = new MdC();
      let html = markdown.toHtml(res);
      this.write(item, html);
    })
  }

  write (info: IPathNode, text: string) {
    this.fileList.write(info, text)
  }
}

let md2html = new Md2html();
md2html.exec();




