
export class Rules {
  public rule = {
    newline: '\n',
    space: ' '
  }
  public options = {
    title1: {
      start: '#' + this.rule.space,
      end: this.rule.newline
    },
    title2: {
      start: '##' + this.rule.space,
      end: this.rule.newline
    },
    title3: {
      start: '###' +this.rule.space,
      end: this.rule.newline
    },
    title4: {
      start: '####' + this.rule.space,
      end: this.rule.newline
    },
    tilte5: {
      start: '#####' + this.rule.space,
      end: this.rule.newline
    },
    title6: {
      start: '######' + this.rule.space,
      end: this.rule.newline
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
      end: this.rule.newline
    },
    lineStar: {
      start: '***',
      end: this.rule.newline
    },
    lineHorizontal: {
      start: '---',
      end: this.rule.newline
    },
    codeLine: {
      start: '```',
      end: '```',
      isAtom: true, // 原子性，表示不可切割，内部不论匹配到什么情况，不找到结束标志不创造token
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
      start: '//',
      end: this.rule.newline,
      isAtom: true
    }
  }
  public ruleMap = {}
  public endToStart = {}
  constructor () {}

  setRules (rules) {
    this.rule = Object.assign(this.rule, rules)
  }

  setOptions (opt) {
    this.options = Object.assign(this.options, opt)
  }

  washEndInfo (k, type, useKey) {
    let isBlock = (this.options[k]['end'] && this.options[k]['end'].indexOf(this.rule.newline) >= 0) ||
      (this.options[k]['startEnd'] && this.options[k]['startEnd'].indexOf(this.rule.newline) >= 0) ||
      (this.options[k]['startEnd'] && this.options[k]['startEnd'].isBlock)
    if (this.options[k]['end'] || this.options[k]['startEnd']) {
      let startType = this.options[k].start || this.options[k].startEnd
      let endType = this.options[k].end || this.options[k].startEnd
      if (Object.prototype.hasOwnProperty.call(this.endToStart, endType)) {
        if (this.endToStart[endType].indexOf(startType) < 0) {
          this.endToStart[endType].push(startType)
        }
      } else {
        this.endToStart[endType] = [startType]
      }
    }
    let endInfo = {
      type: type,
      data: this.options[k][useKey],
      len: this.options[k][useKey].length,
      isBlock: isBlock,
      key: k,
      isAtom: this.options[k].isAtom
    }
    let first = this.options[k][useKey][0]
    if (!Object.prototype.hasOwnProperty.call(this.ruleMap, first)) {
      this.ruleMap[first] = [endInfo]
    } else {
      this.ruleMap[first].push(endInfo)
    }
  }

  washOptions () {
    for(let k in this.options) {
      if (this.options[k]['start'] === this.options[k]['end']) {
        this.washEndInfo(k, 'startEnd', 'start')
      } else {
        this.washEndInfo(k, 'start', 'start')
        this.washEndInfo(k, 'end', 'end')
      }
    }
    // 规则排序
    for (let k in this.ruleMap) {
      this.ruleMap[k].sort(function(one, two) {
        return two.len - one.len
      })
    }
    return this.ruleMap
  }
}
