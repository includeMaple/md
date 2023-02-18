import { Rules } from './core/rules';
import { Token } from './core/token';
import { TokenTree } from './core/tree';
import { Render } from './core/render';
import { toolbox } from './utils';
export class MdC {
  public rule: Rules = new Rules();
  private token: Token = new Token();
  private render: Render = new Render();
  private tree: TokenTree = new TokenTree();

  constructor () {}

  exec (document: string) {
    
    this.rule.generate();
    
    this.token.setRule(this.rule);
    let tokenData = this.token.convert(document);
    
    this.tree.setRule(this.rule);
    let treeData = this.tree.convert(tokenData);
    
    this.render.setRules(this.rule);
    let doc = this.render.render([{
      type: 'checked',
      id: toolbox.generateId(),
      data: '',
      value: '',
      children: treeData,
      key: 'root',
      isBlock: false,
      isList: false,
      isComple: true,
    }]);
    return doc;
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
|标题1|标题1|
|内容1|内容2|
|内容3|内容4|

[连接](ee/dedd/)
![图片](/sd/sd/fsa)
1. ddd
1. ddd
1. 444ddsd
# 标题1
## 标题2
### 标**题**3
***yyyddd
---dddd

**cccc**
~~cccvvv~~
` + '```' +
`
let cc = '222';
console.log(cc);

`+
'```'

// 333
// 1. dddd
// 1. dd344
// 1. ddsl
// # ccc
// ## fff
// let doc = `
// [连接](ee/dedd/)
// ![图片](/sd/sd/fsa)
// ![图片](/sd/sd/fsa)
// [aaa]ddddd(000)
// (--dddww)[ddd]
// [ddd]
// (--dddww)
// [aaa]ddddd(000)

// `
// ` + '```**cc** let cc = bb;```'
//
//

//
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
