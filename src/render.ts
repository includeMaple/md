
import { Stack } from "./stack";
import { STRING_SPACE } from './configs';
import { IStringSpace } from './iface';
import { dealString } from "./utils";
export class Render {

  public rule: IStringSpace = STRING_SPACE;
  public stack: Stack = new Stack();
  public html: string = '';
  public objInfo: any = {};
  public bookInfo: unknown;
  public tree: any;
  public opt: any = {
    title1: (value: string, id: string) => {
      return `<h1><a name="title-${id}"></a>${value}</h1>`
    },
    title2: function (value: string, id: string) {
      return `<h2><a name="title-${id}"></a>${value}</h2>`
    },
    title3: function (value: string, id: string) {
      return `<h3><a name="title-${id}"></a>${value}</h3>`
    },
    title4: function (value: string, id: string) {
      return `<h4><a name="title-${id}"></a>${value}</h4>`
    },
    tilte5: function (value: string, id: string) {
      return `<h5><a name="title-${id}"></a>${value}</h5>`
    },
    title6: function (value: string, id: string) {
      return `<h6><a name="title-${id}"></a>${value}</h6>`
    },
    step: function (value: string, id: string) {
      return `<span class="step"><a name="step-${id}"></a>${value}</span>`
    },
    bold: function (value: string) {
      return `<strong>${value}</strong>`
    },
    warning: function (value: string) {
      return `<span class="star-warning">${value}</span>`
    },
    danger: function (value: string) {
      return `<span class="star-danger">${value}</span>`
    },
    info: function (value: string) {
      return `<span class="star-info">${value}</span>`
    },
    success: function (value: string) {
      return `<span class="star-success">${value}</span>`
    },
    code: function (value: string) {
      return `<span class="star-code">${value}</span>`
    },
    italic: function (value: string) {
      return `<i>${value}</i>`
    },
    spaceTwo: (value: string) => {
      return `${this.rule.space}${this.rule.space}${value}`
    },
    lineStar: function (value: string) {
      return `<div class="line-star">${value}</div>`
    },
    lineHorizontal: function (value: string) {
      return `<div class="line-horizotal">${value}</div>`
    },
    codeLine: function (value: string) {
      // https://github.com/highlightjs/highlight.js
      return `<pre><code>${value}</code></pre>`
    },
    block: function (value: string) {
      return `<p>${value}</p>`
    },
    content: function (value: string) {
      if (value[0] ==='\\') {
        return value.slice(1)
      }
      return value
    },
    image: (value: string) => {
      if (value.indexOf('http') >= 0) {
        return `<img src="${value}"/>`
      }
      if (value.indexOf('id:') === 0) {
        let img = value.substring(3)
        if (this.data.img) {
          return `<img src="${this.data.img[img]}">`
        }
      }
      return value
    },
    hlink: function (value: string) {
      value = value.replace(/，/g,',')
      let arr = value.split(',')
      if (arr[1].indexOf('www') === 0) {
        arr[1] = `http://${arr[1]}`
      }
      return `<a target="_blank" href="${arr[1]}">${arr[0]}</a>`
    },
    table: (value: string) => {
      if (!value) return
      let arr = dealString.strToArr(value, this.rule.newline, '|')
      let tableContent = '<table>'
      tableContent += '<tr>'
      for (let i=0; i<arr[0].length; i++) {
        tableContent += `<th>${arr[0][i]}</th>`
      }
      tableContent += '</tr>'
      for (let i=1; i<arr.length; i++) {
        tableContent += '<tr>'
        for (let j=0; j<arr[i].length; j++) {
          tableContent += `<td>${arr[i][j]}</td>`
        }
        tableContent += '</tr>'
      }
      tableContent += `</table>`
      return tableContent
    },
    book: (value: any) => {
      if (!value) return
      let obj = dealString.strToJson(value)
      this.bookInfo = obj
      return ''
    },
    annotated:  (value: any) => {
      return ''
    }
  }
  public anchorOpt = {
    title1: function (value, id) {
      return `<h1><a href="#title-${id}">${value}</a></h1>`
    },
    title2: function (value, id) {
      return `<h2><a href="#title-${id}">${value}</a></h2>`
    },
    title3: function (value, id) {
      return `<h3><a href="#title-${id}">${value}</a></h3>`
    },
    title4: function (value, id) {
      return `<h4><a href="#title-${id}">${value}</a></h4>`
    },
    title5: function (value, id) {
      return `<h5><a href="#title-${id}">${value}</a></h5>`
    },
    title6: function (value, id) {
      return `<h6><a href="#title-${id}">${value}</a></h6>`
    },
    step: function (value, id) {
      return `<span><a href="#step-${id}" class="step">${value}</span>`
    }
  }
  public txtOpt = { 
    title1: function (value) {
      return `${value}${this.rule.newline}`
    },
    title2: function (value) {
      return `${value}${this.rule.newline}`
    },
    title3: function (value) {
      return `${value}${this.rule.newline}`
    },
    title4: function (value) {
      return `${value}${this.rule.newline}`
    },
    title5: function (value) {
      return `${value}${this.rule.newline}`
    },
    title6: function () {
      return `${value}${this.rule.newline}`
    },
    bold: function (value) {
      return value
    },
    italic: function (value) {
      return value
    },
    spaceTwo: function (value) {
      return `  ${value}`
    },
    lineStar: function (value) {
      return `${value}${value}${value}${value}${value}${value}`
    },
    lineHorizontal: function (value) {
      return `${value}${value}${value}${value}${value}${value}`
    },
    codeLine: function (value) {
      return  value
    },
    block: function (value) {
      return `${value}${this.rule.newline}`
    },
    image: function (value) {
      return value
    },
    hlink: function (value) {
      return value
    }
  }

  constructor () {
    // this.stack.push(this.token)
  }

  setOptions (options: any) {
    this.opt = Object.assign(this.opt, options)
  }

  render (tree: any, type?: string) {
    this.tree = tree;
    this.stack.push(tree)
    while (!this.stack.isEmpty()) {
      let curToken = this.stack.pop()
      if (!curToken.isLeaf) {
        curToken.isLeaf = true
        this.stack.push(curToken)
        for (let j=0; j<curToken.length; j++) {
          if (curToken.type==="token" || curToken.type === "block" || !curToken.type) {
            this.stack.push(curToken[j])
          }
        }
        continue
      }
      curToken.html = this.renderLeaf(curToken, type)
    }
    this.html = this.tree.html
    return this.tree.html;
  }

  renderLeaf (token: any, type='markdown') {
    // 作为叶子的token有这么几种情况：
    // 1、type是block，里面就是content
    // 2、type是token，里面就是规则加content
    let options
    switch (type) {
      case 'markdown':
        options = this.opt
        break
      case 'txt':
        options = this.txtOpt
        break
    }
    let str = ''
    if (token.html) {
      return token.html
    }
    switch (token.type) {
      case 'block':
        for (let i=0; i<token.length; i++) {
          if (token[i].html) {
            str += token[i].html
          } else if(token[i].type === 'content') {
            if (options.content) {
              str += options.content(token[i].data)
            } else {
              str += token[i].data
            }          
          } else if (token[i].type === 'end') {
            // 很容易出现在正文中的括号需要单独处理，因为前面规则添加了是结束符号，最好这里代码重新整理下，现在感觉越整理越乱，这个文件快1000行了
            // 下面token中也这样处理了一遍
            if (token[i].data === ')') {
              str += token[i].data
            }
          }
        }
        str = options.block.call(this, str)
        break
      case 'token':
        for (let i=0; i<token.length; i++) {
          if (token[i].html) {
            str += token[i].html
          } else if (token[i].type === 'content') {
            if (options.content) {
              str += options.content(token[i].data)
            } else {
              str += token[i].data
            }
          } else if (token[i].type === 'end') {
            console.log(i, token.length)
            console.log(token)
            if (i === token.length-1) continue
            if (token[i].data === ')') {
              str += token[i].data
            }
          }
        }
        // 添加锚点
        let funAnchor = this.anchorOpt[token[0].key]
        if (funAnchor) {
          token.anchor = funAnchor.call(this, str, token.id)
        }
        let funStr = options[token[0].key]
        str = funStr.call(this, str, token.id)
        break
      case undefined: // 最外层token是这个
        for (let i=0; i<token.length; i++) {
          if (token[i].html) {
            str += token[i].html
          } else if(token[i].type === 'content') {
            str += token[i].data
          }
        }
        break
    }
    return str 
  }
}