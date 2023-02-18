import { IRuleSpace, ITokenItem, IRuleOptionsInfo } from './iface';
import { toolbox } from '../utils/index';
import { logger } from '../serve/logger';

export const RULE_SPACE: IRuleSpace = {
  newline: '\n',
  space: ' ',
  escape: '\\'
}
// 基础配置，md范围转换为html
export const MD_NORMAL_BASE: IRuleOptionsInfo = {
  type: 'html',
  desc: 'normal md',
  titleList: ['title1', 'title2'],
  options: (ruleSpace: IRuleSpace) => {
    if (!ruleSpace) { ruleSpace = RULE_SPACE; }
    return {
      title1: {
        start: '#' + ruleSpace.space,
        end: ruleSpace.newline,
        render: (item: ITokenItem) => {
          if (!item.isComple) { return ''; }
          return `<h1><a name="title-${item.id}"></a>${item.value}</h1>`
        },
      },
      title2: {
        start: '##' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          if (!item.isComple) { return ''; }
          return `<h2><a name="title-${item.id}"></a>${item.value}</h2>`
        },
      },
      title3: {
        start: '###' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          if (!item.isComple) { return ''; }

          return `<h3><a name="title-${item.id}"></a>${item.value}</h3>`
        },
      },
      title4: {
        start: '####' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          if (!item.isComple) { return ''; }

          return `<h4><a name="title-${item.id}"></a>${item.value}</h4>`
        },
      },
      tilte5: {
        start: '#####' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          if (!item.isComple) { return ''; }

          return `<h5><a name="title-${item.id}"></a>${item.value}</h5>`
        },
      },
      title6: {
        start: '######' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          if (!item.isComple) { return ''; }

          return `<h6><a name="title-${item.id}"></a>${item.value}</h6>`
        },
      },
      bold: {
        start: '**',
        end: '**',
        render: function (item: ITokenItem) {
          if (!item.isComple) { return ''; }

          return `<strong>${item.value}</strong>`
        },
      },
      italic: {
        start: '~~',
        end: '~~',
        render: function (item: ITokenItem) {
          if (!item.isComple) { return ''; }

          return `<i>${item.value}</i>`
        },
      },
      lineStar: {
        start: '***',
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          if (!item.isComple) { return ''; }

          if (item.children) {
            return `***${item.value}`;
          }

          return `<div class="line-star"></div>`
        },
      },
      lineHorizontal: {
        start: '---',
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          if (!item.isComple) { return ''; }

          if (item.children) {
            return `---${item.value}`;
          }

          return `<div class="line-horizotal"></div>`
        },
      },
      codeLine: {
        start: '```',
        end: '```',
        isAtom: true,
        render: function (item: ITokenItem) {
          if (!item.isComple) { return ''; }
          // https://github.com/highlightjs/highlight.js
          return `<pre><code>${item.value}</code></pre>`
        },
      },
      orderList: {
        start: '1. ',
        end: ruleSpace.newline,
        isList: true,
        isBlock: true,
        render: function (item: ITokenItem) {
          if (!item.isComple && !item.children) { return ''; }
          if (!item.isComple) {
            return `<li>${toolbox.getChildrenValue(item)}</li>`;
          }
          return `<ul>${item.value}</ul>`;
        }
      },
      list: { // 无序列表
        start: '* ',
        end: ruleSpace.newline,
        isList: true,
        isBlock: true,
        render: function (item: ITokenItem) {
          if (!item.isComple && !item.children) { return ''; }
          if (!item.isComple) {
            return `<li>${toolbox.getChildrenValue(item)}</li>`;
          }
          return `<ol>${item.value}</ol>`;
        }
      },
      spaceTwo: { // todo
        start: '> ',
        end: ruleSpace.newline,
        render: (item: ITokenItem) => { // 根据渲染需求渲染
          if (!item.isComple && !item.children) { return ''; }
          if (!item.isComple) {
            return `<div class="card-item">${toolbox.getChildrenValue(item)}</div>`;
          }
          return `<div class="card">${item.value}</div>`;
        },
      },
      link: {
        status: ['squareBrackets', 'brackets'],
        start: '',
        end: '',
        render: (item: ITokenItem) => {
          if (!item.isComple) { return ''; }
          if (!item.children ||item.children.length < 2) {
            return item.value;
          }
          try {
            return `<a target="_blank" href="${item.children[0].data}">${item.children[1].data}</a>`
          } catch (error) {
            logger.log
            return item.value           
          }
        }
      },
      image: {
        start: '',
        status: ['exclSquareBrackets', 'brackets'],
        end: '',
        render: (item: ITokenItem) => {
          if (!item.isComple) { return ''; }
          if (!item.isComple) { return ''; }
          if (!item.children ||item.children.length < 2) {
            return item.value;
          }
          try {
            return `<img src="${item.children[0].data}" title="${item.children[1].data}">${item.children[1].data}</a>`
          } catch (error) {
            logger.log
            return item.value           
          }
        }
      },
      brackets: {
        start: '(',
        end: ')',
        render: (item: ITokenItem) => {
          if (!item.isComple) { return ''; }

          item.data = item.value;
          return item.isBlock ? item.value : `(${item.value})`;
        }
      },
      squareBrackets: {
        start: '[',
        end: ']',
        render: (item: ITokenItem) => {
          if (!item.isComple) { return ''; }

          item.data = item.value;
          return item.isBlock ? item.value : `[${item.value}]`;
        }
      },
      exclSquareBrackets: {
        start: '![',
        end: ']',
        render: (item: ITokenItem) => {
          if (!item.isComple) { return ''; }

          item.data = item.value;
          return `![${item.value}]`
        }
      },
      tableCol: {
        start: '|',
        end: ruleSpace.newline,
        isAtom: true,
        isBlock: true,
        isList: true,
        includeSelf: true,
        render: (item: ITokenItem) => {
          // <table border="1">
          //   <tr>
          //     <th>Month</th>
          //     <th>Savings</th>
          //   </tr>
          //   <tr>
          //     <td>January</td>
          //     <td>$100</td>
          //   </tr>
          // </table>
          if (!item.isComple) { return ''; }

          try {
            
          } catch (error) {
            console.error(error);
            // error
          }
        },
      }
    }
  },
  // root newline
  newline: (item: ITokenItem) => {
    if (item.isBlock && !item.children) {
      return '<div class="row-one"></div>';
    }
    return ''
  }
}

export const MD_EX_BASE: IRuleOptionsInfo = {
  type: 'html',
  desc: 'EX md',
  titleList: ['title1', 'title2', 'title3', 'title4', 'title5', 'step'],
  options: (ruleSpace: IRuleSpace) => {
    return {
      warning: {
        start: '@@warning ',
        end: '@@',
        isAtom: true,
        render: function (item: ITokenItem) {
          return `<span class="star-warning">${item.value}</span>`
        },
      },
      danger: {
        start: '@@danger ',
        end: '@@',
        isAtom: true,
        render: function (item: ITokenItem) {
          return `<span class="star-danger">${item.value}</span>`
        },
      },
      info: {
        start: '@@info ',
        end: '@@',
        isAtom: true,
        render: function (item: ITokenItem) {
          return `<span class="star-info">${item.value}</span>`
        },
      },
      success: {
        start: '@@success ',
        end: '@@',
        isAtom: true,
        render: function (item: ITokenItem) {
          return `<span class="star-success">${item.value}</span>`
        },
      },
      step: {
        start: '%% ',
        end: '%%',
        render: function (item: ITokenItem) {
          return `<span class="step"><a name="step-${item.id}"></a>${item.value}</span>`
        },
      },
      hlink: {
        start: '[hlink](',
        end: ')',
        render: function (item: ITokenItem) {
          let value = item.value.replace(/，/g,',')
          let arr = value.split(',')
          if (arr[1].indexOf('www') === 0) {
            arr[1] = `http://${arr[1]}`
          }
          return `<a target="_blank" href="${arr[1]}">${arr[0]}</a>`
        },
      },
      book: {
        start: '[book](',
        end: ')',
        isBlock: true,
        render: (item: any) => {
          if (!item.value) return ''
          // let obj = dealString.strToJson(value)
          // this.bookInfo = obj
          return ''
        },
      },
      annotated: {
        start: '// ',
        end: ruleSpace.newline,
        isAtom: true,
        render: (value: any) => {
          return ''
        }
      },
    }
  }
}

// 其他配置都是有需要覆盖就写，不需要覆盖就不写
export const MD_NORMAL_TEXT: IRuleOptionsInfo = {
  type: 'html',
  desc: 'normal md',
  options: (ruleSpace: IRuleSpace) => {
    return {
      title1: {
        start: '#' + ruleSpace.space,
        end: ruleSpace.newline,
        render: (item: ITokenItem) => {
          return `${item.value}${ruleSpace.newline}`
        },
      },
      title2: {
        start: '##' + ruleSpace.space,
        end: ruleSpace.newline,
        render: (item: ITokenItem) => {
          return `${item.value}${ruleSpace.newline}`
        },
      },
      title3: {
        start: '###' +ruleSpace.space,
        end: ruleSpace.newline,
        render: (item: ITokenItem) => {
          return `${item.value}${ruleSpace.newline}`
        },
      },
      title4: {
        start: '####' + ruleSpace.space,
        end: ruleSpace.newline,
        render: (item: ITokenItem) => {
          return `${item.value}${ruleSpace.newline}`
        },
      },
      tilte5: {
        start: '#####' + ruleSpace.space,
        end: ruleSpace.newline,
        render: (item: ITokenItem) => {
          return `${item.value}${ruleSpace.newline}`
        },
      },
      title6: {
        start: '######' + ruleSpace.space,
        end: ruleSpace.newline,
        render: (item: ITokenItem) => {
          return `${item.value}${ruleSpace.newline}`
        },
      },
      bold: {
        start: '**',
        end: '**',
        render: function (item: ITokenItem) {
          return item.value
        },
      },
      code: {
        start: '@@code ',
        end: '@@',
        isAtom: true,
        render: function (item: ITokenItem) {
          return item.value
        },
      },
      italic: {
        start: '~~',
        end: '~~',
        render: function (item: ITokenItem) {
          return item.value
        },
      },
      spaceTwo: {
        start: '>',
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          return `  ${item.value}`
        },
      },
      lineStar: {
        start: '***',
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          return `${item.value}${item.value}${item.value}${item.value}${item.value}${item.value}`
        },
      },
      lineHorizontal: {
        start: '---',
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          return `${item.value}${item.value}${item.value}${item.value}${item.value}${item.value}`
        },
      },
      codeLine: {
        start: '```',
        end: '```',
        isAtom: true,
        isBlock: true,
        render: function (item: ITokenItem) {
          return  item.value;
        },
      },
      image: {
        start: '[image](',
        end: ')',
        render: function (item: ITokenItem) {
          return item.value;
        },
      },
      hlink: {
        start: '[hlink](',
        end: ')',
        render: function (item: ITokenItem) {
          return item.value;
        }
      },
      table: {
        start: '[table](',
        end: ')',
        isAtom: true,
        isBlock: true,
        render: (item: ITokenItem) => {
          let value = item.value;
          if (!value) return ''
          return '';
          // let arr = dealString.strToArr(value, ruleSpace.newline, '|')
          // let tableContent = '<table>'
          // tableContent += '<tr>'
          // for (let i=0; i<arr[0].length; i++) {
          //   tableContent += `<th>${arr[0][i]}</th>`
          // }
          // tableContent += '</tr>'
          // for (let i=1; i<arr.length; i++) {
          //   tableContent += '<tr>'
          //   for (let j=0; j<arr[i].length; j++) {
          //     tableContent += `<td>${arr[i][j]}</td>`
          //   }
          //   tableContent += '</tr>'
          // }
          // tableContent += `</table>`
          // return tableContent
        },
      },
    }
  }
}

export const MD_EX_TEXT: IRuleOptionsInfo = {
  type: 'html',
  desc: 'EX md',
  options: (ruleSpace: IRuleSpace) => {
    return {
      warning: {
        start: '@@warning ',
        end: '@@',
        isAtom: true,
        render: (item: ITokenItem) => {
          return item.value;
        },
      },
      danger: {
        start: '@@danger ',
        end: '@@',
        isAtom: true,
        render: (item: ITokenItem) => {
          return item.value;
        },
      },
      info: {
        start: '@@info ',
        end: '@@',
        isAtom: true,
        render: (item: ITokenItem) => {
          return item.value;
        },
      },
      success: {
        start: '@@success ',
        end: '@@',
        isAtom: true,
        render: (item: ITokenItem) => {
          return item.value;
        },
      },
      step: {
        start: '%% ',
        end: '%%',
        render: (item: ITokenItem) => {
          return item.value;
        },
      },
      hlink: {
        start: '[hlink](',
        end: ')',
        render: (item: ITokenItem) => {
          return item.value;
        },
      },
      book: {
        start: '[book](',
        end: ')',
        isBlock: true,
        render: (item: ITokenItem) => {
          return item.value;
        },
      },
      annotated: {
        start: '// ',
        end: ruleSpace.newline,
        isAtom: true,
        render: (item: ITokenItem) => {
          return '';
        },
      },
    }
  }
}

// 规则之外的渲染
// export const DEFAULT_RENDER: IRuleOptions = {
//   // block: {
//   //   render: function (item: ITokenItem) {
//   //     return `<p>${item.value}</p>`
//   //   },
//   // },
//   // @ts-ignore
//   // content: {
//   //   render: function (item: ITokenItem) {
//   //     if (item.value && item.value[0] ==='\\') {
//   //       return item.value.slice(1)
//   //     }
//   //     return item.value||''
//   //   },
//   // }
// }

export const DEFAULT_RENDER_FN = (item: ITokenItem) => {
  return item.value
}
