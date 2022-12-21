import { IRuleSpace, ITreeNode, IRuleOptionsInfo } from './iface';

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
        render: (item: ITreeNode) => {
          return `<h1><a name="title-${item.id}"></a>${item.value}</h1>`
        },
      },
      title2: {
        start: '##' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITreeNode) {
          return `<h2><a name="title-${item.id}"></a>${item.value}</h2>`
        },
      },
      title3: {
        start: '###' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITreeNode) {
          return `<h3><a name="title-${item.id}"></a>${item.value}</h3>`
        },
      },
      title4: {
        start: '####' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITreeNode) {
          return `<h4><a name="title-${item.id}"></a>${item.value}</h4>`
        },
      },
      tilte5: {
        start: '#####' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITreeNode) {
          return `<h5><a name="title-${item.id}"></a>${item.value}</h5>`
        },
      },
      title6: {
        start: '######' + ruleSpace.space,
        end: ruleSpace.newline,
        render: function (item: ITreeNode) {
          return `<h6><a name="title-${item.id}"></a>${item.value}</h6>`
        },
      },
      bold: {
        start: '**',
        end: '**',
        render: function (item: ITreeNode) {
          return `<strong>${item.value}</strong>`
        },
      },
      code: {
        start: '@@code ',
        end: '@@',
        isAtom: true,
        render: function (item: ITreeNode) {
          return `<span class="star-code">${item.value}</span>`
        },
      },
      italic: {
        start: '~~',
        end: '~~',
        render: function (item: ITreeNode) {
          return `<i>${item.value}</i>`
        },
      },
      spaceTwo: {
        start: '>',
        end: ruleSpace.newline,
        render: (item: ITreeNode) => {
          return `${ruleSpace.space}${ruleSpace.space}${item.value}`
        },
      },
      lineStar: {
        start: '***',
        end: ruleSpace.newline,
        render: function (item: ITreeNode) {
          return `<div class="line-star">${item.value}</div>`
        },
      },
      lineHorizontal: {
        start: '---',
        end: ruleSpace.newline,
        render: function (item: ITreeNode) {
          return `<div class="line-horizotal">${item.value}</div>`
        },
      },
      codeLine: {
        start: '```',
        end: '```',
        isAtom: true,
        isBlock: true,
        render: function (item: ITreeNode) {
          // https://github.com/highlightjs/highlight.js
          return `<pre><code>${item.value}</code></pre>`
        },
      },
      image: {
        start: '[image](',
        end: ')',
        render: (item: ITreeNode) => {
          if (item.value && item.value.indexOf('http') >= 0) {
            return `<img src="${item.value}"/>`
          }
          if (item.value && item.value.indexOf('id:') === 0) {
            let img = item.value.substring(3)
            // if (this.data.img) {
            //   return `<img src="${this.data.img[img]}">`
            // }
          }
          return '';
          // return value
        },
      },
      hlink: {
        start: '[hlink](',
        end: ')',
        render: function (item: ITreeNode) {
          let value = item.value.replace(/，/g,',')
          let arr = value.split(',')
          if (arr[1].indexOf('www') === 0) {
            arr[1] = `http://${arr[1]}`
          }
          return `<a target="_blank" href="${arr[1]}">${arr[0]}</a>`
        },
      },
      table: {
        start: '[table](',
        end: ')',
        isAtom: true,
        isBlock: true,
        render: (item: ITreeNode) => {
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
        render: function (item: ITreeNode) {
          return `<span class="star-warning">${item.value}</span>`
        },
      },
      danger: {
        start: '@@danger ',
        end: '@@',
        isAtom: true,
        render: function (item: ITreeNode) {
          return `<span class="star-danger">${item.value}</span>`
        },
      },
      info: {
        start: '@@info ',
        end: '@@',
        isAtom: true,
        render: function (item: ITreeNode) {
          return `<span class="star-info">${item.value}</span>`
        },
      },
      success: {
        start: '@@success ',
        end: '@@',
        isAtom: true,
        render: function (item: ITreeNode) {
          return `<span class="star-success">${item.value}</span>`
        },
      },
      step: {
        start: '%% ',
        end: '%%',
        render: function (item: ITreeNode) {
          return `<span class="step"><a name="step-${item.id}"></a>${item.value}</span>`
        },
      },
      hlink: {
        start: '[hlink](',
        end: ')',
        render: function (item: ITreeNode) {
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
        render: (item: ITreeNode) => {
          return `${item.value}${ruleSpace.newline}`
        },
      },
      title2: {
        start: '##' + ruleSpace.space,
        end: ruleSpace.newline,
        render: (item: ITreeNode) => {
          return `${item.value}${ruleSpace.newline}`
        },
      },
      title3: {
        start: '###' +ruleSpace.space,
        end: ruleSpace.newline,
        render: (item: ITreeNode) => {
          return `${item.value}${ruleSpace.newline}`
        },
      },
      title4: {
        start: '####' + ruleSpace.space,
        end: ruleSpace.newline,
        render: (item: ITreeNode) => {
          return `${item.value}${ruleSpace.newline}`
        },
      },
      tilte5: {
        start: '#####' + ruleSpace.space,
        end: ruleSpace.newline,
        render: (item: ITreeNode) => {
          return `${item.value}${ruleSpace.newline}`
        },
      },
      title6: {
        start: '######' + ruleSpace.space,
        end: ruleSpace.newline,
        render: (item: ITreeNode) => {
          return `${item.value}${ruleSpace.newline}`
        },
      },
      bold: {
        start: '**',
        end: '**',
        render: function (item: ITreeNode) {
          return item.value
        },
      },
      code: {
        start: '@@code ',
        end: '@@',
        isAtom: true,
        render: function (item: ITreeNode) {
          return item.value
        },
      },
      italic: {
        start: '~~',
        end: '~~',
        render: function (item: ITreeNode) {
          return item.value
        },
      },
      spaceTwo: {
        start: '>',
        end: ruleSpace.newline,
        render: function (item: ITreeNode) {
          return `  ${item.value}`
        },
      },
      lineStar: {
        start: '***',
        end: ruleSpace.newline,
        render: function (item: ITreeNode) {
          return `${item.value}${item.value}${item.value}${item.value}${item.value}${item.value}`
        },
      },
      lineHorizontal: {
        start: '---',
        end: ruleSpace.newline,
        render: function (item: ITreeNode) {
          return `${item.value}${item.value}${item.value}${item.value}${item.value}${item.value}`
        },
      },
      codeLine: {
        start: '```',
        end: '```',
        isAtom: true,
        isBlock: true,
        render: function (item: ITreeNode) {
          return  item.value;
        },
      },
      image: {
        start: '[image](',
        end: ')',
        render: function (item: ITreeNode) {
          return item.value;
        },
      },
      hlink: {
        start: '[hlink](',
        end: ')',
        render: function (item: ITreeNode) {
          return item.value;
        }
      },
      table: {
        start: '[table](',
        end: ')',
        isAtom: true,
        isBlock: true,
        render: (item: ITreeNode) => {
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
        render: (item: ITreeNode) => {
          return item.value;
        },
      },
      danger: {
        start: '@@danger ',
        end: '@@',
        isAtom: true,
        render: (item: ITreeNode) => {
          return item.value;
        },
      },
      info: {
        start: '@@info ',
        end: '@@',
        isAtom: true,
        render: (item: ITreeNode) => {
          return item.value;
        },
      },
      success: {
        start: '@@success ',
        end: '@@',
        isAtom: true,
        render: (item: ITreeNode) => {
          return item.value;
        },
      },
      step: {
        start: '%% ',
        end: '%%',
        render: (item: ITreeNode) => {
          return item.value;
        },
      },
      hlink: {
        start: '[hlink](',
        end: ')',
        render: (item: ITreeNode) => {
          return item.value;
        },
      },
      book: {
        start: '[book](',
        end: ')',
        isBlock: true,
        render: (item: ITreeNode) => {
          return item.value;
        },
      },
      annotated: {
        start: '// ',
        end: ruleSpace.newline,
        isAtom: true,
        render: (item: ITreeNode) => {
          return '';
        },
      },
    }
  }
}

// 规则之外的渲染
// export const DEFAULT_RENDER: IRuleOptions = {
//   // block: {
//   //   render: function (item: ITreeNode) {
//   //     return `<p>${item.value}</p>`
//   //   },
//   // },
//   // @ts-ignore
//   // content: {
//   //   render: function (item: ITreeNode) {
//   //     if (item.value && item.value[0] ==='\\') {
//   //       return item.value.slice(1)
//   //     }
//   //     return item.value||''
//   //   },
//   // }
// }

export const DEFAULT_RENDER_FN = (item: ITreeNode) => {
  return item.value
}
