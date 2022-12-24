import { IRuleSpace, ITokenItem, IRuleOptionsInfo } from './iface';

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
          return `<h1><a name="title-${item.id}"></a>${item.value}</h1>`
        },
      },
      title2: {
        start: '##' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          return `<h2><a name="title-${item.id}"></a>${item.value}</h2>`
        },
      },
      title3: {
        start: '###' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          return `<h3><a name="title-${item.id}"></a>${item.value}</h3>`
        },
      },
      title4: {
        start: '####' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          return `<h4><a name="title-${item.id}"></a>${item.value}</h4>`
        },
      },
      tilte5: {
        start: '#####' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          return `<h5><a name="title-${item.id}"></a>${item.value}</h5>`
        },
      },
      title6: {
        start: '######' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          return `<h6><a name="title-${item.id}"></a>${item.value}</h6>`
        },
      },
      bold: {
        start: '**',
        end: '**',
        render: function (item: ITokenItem) {
          return `<strong>${item.value}</strong>`
        },
      },
      italic: {
        start: '~~',
        end: '~~',
        render: function (item: ITokenItem) {
          return `<i>${item.value}</i>`
        },
      },
      spaceTwo: { // todo
        start: '>',
        end: ruleSpace.newline,
        render: (item: ITokenItem) => {
          return `${ruleSpace.space}${ruleSpace.space}${item.value}`
        },
      },
      lineStar: {
        start: '***',
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          return `<div class="line-star">${item.value}</div>`
        },
      },
      lineHorizontal: {
        start: '---',
        end: ruleSpace.newline,
        render: function (item: ITokenItem) {
          return `<div class="line-horizotal">${item.value}</div>`
        },
      },
      codeLine: {
        start: '```',
        end: '```',
        isAtom: true,
        render: function (item: ITokenItem) {
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
          if (!item.isList) {
            item.value = '';
            item.children?.forEach((i) => {
              item.value += i.value;
            })
            return `<ul>${item.value}</ul>`;
          }
          if (item.children && item.children.length > 1) {
            return `<li>${item.children[1].value}</li>`;
          }
          return `<li>${item.value}</li>`;
        }
      },
      list: { // 无序列表
        start: '* ',
        end: ruleSpace.newline,
        isList: true,
        isBlock: true,
        render: function (item: ITokenItem) {
          if (!item.isList) {
            item.value = '';
            item.children?.forEach((i) => {
              item.value += i.value;
            })
            return `<ol>${item.value}</ol>`;
          }
          if (item.children && item.children.length > 1) {
            return `<li>${item.children[1].value}</li>`;
          }
          return `<li>${item.value}</li>`;
        }
      },
      link: {
        status: ['[', '](', ')'],
        start: '[',
        end: ')',
        render: (item: ITokenItem) => {
          if (item.value.indexOf('](') > -1) {
            let arr = item.value.split('](');
            return `<img src="${arr[1]}" title="${arr[0]}"/>`;
          } else if (item.children) {
            return item.value;
          }
          return `[${item.value})`;
        }
      },
      image: {
        status: ['![', '](', ')'],
        start: '![',
        end: ')',
        render: (item: ITokenItem) => {
          if (item.value.indexOf('](') > -1) {
            let arr = item.value.split('](');
            return `<a target="_blank" href="${arr[1]}">${arr[0]}</a>`;
          } else if (item.children) {
            return item.value;
          }
          return `![${item.value})`;
        }
      },
      table: {
        start: '|',
        end: '|' + ruleSpace.newline,
        // isAtom: true,
        isBlock: true,
        isList: true,
        render: (item: ITokenItem) => {
          let value = item.value;
          if (!value) return ''
          return item.value;
        },
      },
    }
  },
  /**
   * 所有节点渲染完毕后，对换行进行处理
   * @param item 
   * @param ruleSpace 
   * @param isRootLine 是否根节点上的行
   * @returns 
   */
  blankline: (item: ITokenItem, ruleSpace: IRuleSpace, isRootLine?: boolean) => {
    if (isRootLine && item.data === ruleSpace.newline) {
      return '<div class="row-one"></div>';
    }
    if (!item.isBlock ||
      item.data === ruleSpace.newline ||
      !item.children || item.isList) {
        return '';
    }
    return `<div class="row">${item.value}</div>`;
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
