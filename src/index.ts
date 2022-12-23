import { Rules } from './rules';
import { Token } from './token';
import { Render } from './render';
import { ITreeNode } from './iface';
export class MdC {
  public rule: Rules = new Rules();
  private token: Token = new Token();
  private render: Render = new Render();

  constructor () {}

  exec (document: string) {
    this.rule.generate();
    this.token.setRule(this.rule);
    let tree = this.token.getToken(document);

    this.render.setRules(this.rule);
    // 将抽象语法树渲染回指定文本
    return this.render.render(tree as ITreeNode[]);
  }
  /**
   * 将md转换为html
   * @param document 
   * @returns 
   */
  toHtml (document: string) {
    this.rule.setRules({docType: 'html'});
    return this.exec(document);
  }

  /**
   * 将md转换为text
   * @param document 
   */
  toText (document: string) {
    this.rule.setRules({docType: 'text'});
    return this.exec(document)
  }
}
let doc = `
1. ccc
1. ddd

* ee
* 8878

`
// ` + '```**cc** let cc = bb;```'
let markdown = new MdC();
// 设置规则
markdown.rule.setRules({
  docType: 'html',
  mdType: 'normal',
  // title: ['title1']
  // options: {}
})

let res = markdown.toHtml(doc);
console.log(res)
