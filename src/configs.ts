import { IRuleSpace, IRuleOptions, IRenderOption, ITreeNode } from './iface';
import { dealString } from './utils';

export const RULE_SPACE: IRuleSpace = {
  newline: '\n',
  space: ' ',
  escape: '\\'
}

export const RULE_OPTIONS: IRuleOptions = {
  title1: {
    start: '#' + RULE_SPACE.space,
    end: RULE_SPACE.newline
  },
  title2: {
    start: '##' + RULE_SPACE.space,
    end: RULE_SPACE.newline
  },
  title3: {
    start: '###' +RULE_SPACE.space,
    end: RULE_SPACE.newline
  },
  title4: {
    start: '####' + RULE_SPACE.space,
    end: RULE_SPACE.newline
  },
  tilte5: {
    start: '#####' + RULE_SPACE.space,
    end: RULE_SPACE.newline
  },
  title6: {
    start: '######' + RULE_SPACE.space,
    end: RULE_SPACE.newline
  },
  bold: {
    start: '**',
    end: '**'
  },
  warning: {
    start: '@@warning ',
    end: '@@',
    isAtom: true
  },
  danger: {
    start: '@@danger ',
    end: '@@',
    isAtom: true
  },
  info: {
    start: '@@info ',
    end: '@@',
    isAtom: true
  },
  success: {
    start: '@@success ',
    end: '@@',
    isAtom: true
  },
  code: {
    start: '@@code ',
    end: '@@',
    isAtom: true
  },
  step: {
    start: '%% ',
    end: '%%'
  },
  italic: {
    start: '~~',
    end: '~~'
  },
  spaceTwo: {
    start: '>',
    end: RULE_SPACE.newline
  },
  lineStar: {
    start: '***',
    end: RULE_SPACE.newline
  },
  lineHorizontal: {
    start: '---',
    end: RULE_SPACE.newline
  },
  codeLine: {
    start: '```',
    end: '```',
    isAtom: true,
    isBlock: true
  },
  image: {
    start: '[image](',
    end: ')'
  },
  hlink: {
    start: '[hlink](',
    end: ')'
  },
  table: {
    start: '[table](',
    end: ')',
    isAtom: true,
    isBlock: true
  },
  book: {
    start: '[book](',
    end: ')',
    isBlock: true
  },
  annotated: {
    start: '// ',
    end: RULE_SPACE.newline,
    isAtom: true
  }
}

export const RENDER_TEXT: IRenderOption  = {
  title: ['title1', 'title2'],
  options: {
    title1: (item: ITreeNode) => {
      return `${item.value}${RULE_SPACE.newline}`
    },
    title2: (item: ITreeNode) => {
      return `${item.value}${RULE_SPACE.newline}`
    },
    title3: (item: ITreeNode) => {
      return `${item.value}${RULE_SPACE.newline}`
    },
    title4: (item: ITreeNode) => {
      return `${item.value}${RULE_SPACE.newline}`
    },
    title5: (item: ITreeNode) => {
      return `${item.value}${RULE_SPACE.newline}`
    },
    title6: (item: ITreeNode) => {
      return `${item.value}${RULE_SPACE.newline}`
    },
    bold: function (item: ITreeNode) {
      return value
    },
    italic: function (item: ITreeNode) {
      return value
    },
    spaceTwo: function (item: ITreeNode) {
      return `  ${item.value}`
    },
    lineStar: function (item: ITreeNode) {
      return `${item.value}${item.value}${item.value}${item.value}${item.value}${item.value}`
    },
    lineHorizontal: function (item: ITreeNode) {
      return `${item.value}${item.value}${item.value}${item.value}${item.value}${item.value}`
    },
    codeLine: function (item: ITreeNode) {
      return  value
    },
    block: (item: ITreeNode) => {
      return `${item.value}${RULE_SPACE.newline}`
    },
    image: function (item: ITreeNode) {
      return value
    },
    hlink: function (item: ITreeNode) {
      return value
    }
  }
}

export const RENDER_HTML: IRenderOption = {
  title: ['title1', 'title2', 'title3', 'title4', 'title5', 'step'],
  options: {
    title1: (item: ITreeNode) => {
      return `<h1><a name="title-${item.id}"></a>${item.value}</h1>`
    },
    title2: function (item: ITreeNode) {
      return `<h2><a name="title-${item.id}"></a>${item.value}</h2>`
    },
    title3: function (item: ITreeNode) {
      return `<h3><a name="title-${item.id}"></a>${item.value}</h3>`
    },
    title4: function (item: ITreeNode) {
      return `<h4><a name="title-${item.id}"></a>${item.value}</h4>`
    },
    tilte5: function (item: ITreeNode) {
      return `<h5><a name="title-${item.id}"></a>${item.value}</h5>`
    },
    title6: function (item: ITreeNode) {
      return `<h6><a name="title-${item.id}"></a>${item.value}</h6>`
    },
    step: function (item: ITreeNode) {
      return `<span class="step"><a name="step-${item.id}"></a>${item.value}</span>`
    },
    bold: function (item: ITreeNode) {
      return `<strong>${item.value}</strong>`
    },
    warning: function (item: ITreeNode) {
      return `<span class="star-warning">${item.value}</span>`
    },
    danger: function (item: ITreeNode) {
      return `<span class="star-danger">${item.value}</span>`
    },
    info: function (item: ITreeNode) {
      return `<span class="star-info">${item.value}</span>`
    },
    success: function (item: ITreeNode) {
      return `<span class="star-success">${item.value}</span>`
    },
    code: function (item: ITreeNode) {
      return `<span class="star-code">${item.value}</span>`
    },
    italic: function (item: ITreeNode) {
      return `<i>${item.value}</i>`
    },
    spaceTwo: (item: ITreeNode) => {
      return `${RULE_SPACE.space}${RULE_SPACE.space}${item.value}`
    },
    lineStar: function (item: ITreeNode) {
      return `<div class="line-star">${item.value}</div>`
    },
    lineHorizontal: function (item: ITreeNode) {
      return `<div class="line-horizotal">${item.value}</div>`
    },
    codeLine: function (item: ITreeNode) {
      // https://github.com/highlightjs/highlight.js
      return `<pre><code>${item.value}</code></pre>`
    },
    block: function (item: ITreeNode) {
      return `<p>${item.value}</p>`
    },
    content: function (item: ITreeNode) {
      if (item.value && item.value[0] ==='\\') {
        return item.value.slice(1)
      }
      return item.value||''
    },
    image: (item: ITreeNode) => {
      if (item.value && item.value.indexOf('http') >= 0) {
        return `<img src="${item.value}"/>`
      }
      if (item.value && item.value.indexOf('id:') === 0) {
        let img = item.value.substring(3)
        if (this.data.img) {
          return `<img src="${this.data.img[img]}">`
        }
      }
      return value
    },
    hlink: function (item: ITreeNode) {
      value = item.value.replace(/，/g,',')
      let arr = value.split(',')
      if (arr[1].indexOf('www') === 0) {
        arr[1] = `http://${arr[1]}`
      }
      return `<a target="_blank" href="${arr[1]}">${arr[0]}</a>`
    },
    table: (item: ITreeNode) => {
      if (!value) return
      let arr = dealString.strToArr(value, RULE_SPACE.newline, '|')
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
}