
import { Stack, TreeWalk } from "./stack";
import { RULE_SPACE, RENDER_TEXT, RENDER_HTML } from './configs';
import { IRuleSpace, ITreeNode } from './iface';

export class Render {
  public title: string[] = RENDER_HTML.title;
  public options: {[key: string]: (item: ITreeNode) => string} = RENDER_HTML.options;
  public treeWalk: TreeWalk = new TreeWalk();
  constructor (public type?: string) {
    if (this.type === 'text') {
      this.title = RENDER_TEXT.title;
      this.options = RENDER_TEXT.options;
    }
  }

  render (data: ITreeNode[]) {
    let cc = JSON.parse(JSON.stringify(data));
    // 使用树的深度优先遍历的后序遍历生成value
    let processList: ITreeNode[]  = this.treeWalk.postorder(data);
    processList.forEach((item: ITreeNode) => {
      if (item.children) {
        console.log(item)
        // item.value = item
      }
    })
    console.log(processList)
    // this.treeWalk.postorder(data, (node: ITreeNode) => {
    //   // 处理节点
    // });
  }

  generateValue () {}

  // 递归生成html和标题
  // 
}


// export class Render {

//   public rule: IRuleSpace = RULE_SPACE;
//   public stack: Stack = new Stack();
//   public html: string = '';
//   public objInfo: any = {};
//   public bookInfo: unknown;
//   public tree: any;
//   public anchorOpt = {
//     title1: function (value: string, id: string) {
//       return `<h1><a href="#title-${id}">${value}</a></h1>`
//     },
//     title2: function (value: string, id: string) {
//       return `<h2><a href="#title-${id}">${value}</a></h2>`
//     },
//     title3: function (value: string, id: string) {
//       return `<h3><a href="#title-${id}">${value}</a></h3>`
//     },
//     title4: function (value: string, id: string) {
//       return `<h4><a href="#title-${id}">${value}</a></h4>`
//     },
//     title5: function (value: string, id: string) {
//       return `<h5><a href="#title-${id}">${value}</a></h5>`
//     },
//     title6: function (value: string, id: string) {
//       return `<h6><a href="#title-${id}">${value}</a></h6>`
//     },
//     step: function (value: string, id: string) {
//       return `<span><a href="#step-${id}" class="step">${value}</span>`
//     }
//   }

//   constructor () {
//     // this.stack.push(this.token)
//   }

//   setOptions (options: any) {
//     this.opt = Object.assign(this.opt, options)
//   }

//   render (tree: any, type?: string) {
//     this.tree = tree;
//     this.stack.push(tree)
//     while (!this.stack.isEmpty()) {
//       let curToken = this.stack.pop();
//       if (!curToken) { break; }
//       if (!curToken.isLeaf) {
//         curToken.isLeaf = true
//         this.stack.push(curToken)
//         for (let j=0; j<curToken.length; j++) {
//           if (curToken.type==="token" || curToken.type === "block" || !curToken.type) {
//             this.stack.push(curToken[j])
//           }
//         }
//         continue
//       }
//       curToken.html = this.renderLeaf(curToken, type)
//     }
//     this.html = this.tree.html
//     return this.tree.html;
//   }

//   renderLeaf (token: any, type='markdown') {
//     // 作为叶子的token有这么几种情况：
//     // 1、type是block，里面就是content
//     // 2、type是token，里面就是规则加content
//     let options
//     switch (type) {
//       case 'markdown':
//         options = this.opt
//         break
//       case 'txt':
//         options = this.txtOpt
//         break
//     }
//     let str = ''
//     if (token.html) {
//       return token.html
//     }
//     switch (token.type) {
//       case 'block':
//         for (let i=0; i<token.length; i++) {
//           if (token[i].html) {
//             str += token[i].html
//           } else if(token[i].type === 'content') {
//             if (options.content) {
//               str += options.content(token[i].data)
//             } else {
//               str += token[i].data
//             }          
//           } else if (token[i].type === 'end') {
//             // 很容易出现在正文中的括号需要单独处理，因为前面规则添加了是结束符号，最好这里代码重新整理下，现在感觉越整理越乱，这个文件快1000行了
//             // 下面token中也这样处理了一遍
//             if (token[i].data === ')') {
//               str += token[i].data
//             }
//           }
//         }
//         str = options.block.call(this, str)
//         break
//       case 'token':
//         for (let i=0; i<token.length; i++) {
//           if (token[i].html) {
//             str += token[i].html
//           } else if (token[i].type === 'content') {
//             if (options.content) {
//               str += options.content(token[i].data)
//             } else {
//               str += token[i].data
//             }
//           } else if (token[i].type === 'end') {
//             console.log(i, token.length)
//             console.log(token)
//             if (i === token.length-1) continue
//             if (token[i].data === ')') {
//               str += token[i].data
//             }
//           }
//         }
//         // 添加锚点
//         let funAnchor = this.anchorOpt[token[0].key]
//         if (funAnchor) {
//           token.anchor = funAnchor.call(this, str, token.id)
//         }
//         let funStr = options[token[0].key]
//         str = funStr.call(this, str, token.id)
//         break
//       case undefined: // 最外层token是这个
//         for (let i=0; i<token.length; i++) {
//           if (token[i].html) {
//             str += token[i].html
//           } else if(token[i].type === 'content') {
//             str += token[i].data
//           }
//         }
//         break
//     }
//     return str 
//   }
// }

