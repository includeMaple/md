
import { Stack } from './stack';
export class Token {
  public str = ''
  public endToken = []
  public highToken = []
  public blockToken = []
  public title = []
  public isTitle = ['title1', 'title2', 'title3', 'title4', 'title5', 'step']

  constructor (str?: string) {
    if (str) { this.str = str; }
  }

  getToken (str, rule) {
    // 初始化
    this.rule = rule
    this.rule.washOptions()
    this.title = []
    this.str = str? str: this.str
    this.getEndToken()
    console.log('endToken')
    console.log(this.endToken)
    this.getHighToken()
    console.log('highToken')
    console.log(this.highToken)
    this.addBlockToken()
    console.log('blockToken')
    console.log(this.blockToken)
    console.log(this.rule)
    return this.blockToken
  }

  getEndToken (rule) {
    rule = rule ? rule: this.rule.ruleMap
    let token = []
    // 上次扫描到的位置
    let lastPoint = 0
    let isAtom = false
    let atomKey = ''
    let jump = {
      slash: {
        data: '\\',
        num: 1
      }
    }
    // 扫描字符串
    for (let i=0; i<this.str.length; i++) {
      let s = this.str[i]
      // jump
      for (let k in jump) {
        if (jump[k].data === s) {
          i += jump[k].num
          continue
        }
      }
      if (Object.prototype.hasOwnProperty.call(rule, s)) {
        // 扫描规则，是否符合
        let temp = rule[s]      
        for (let j=0;j< temp.length; j++) {
          // 扫描到是规则里的东西
          if (this.str.substring(i, i+temp[j].len) === temp[j].data) {
            if (isAtom && (!this.rule.endToStart[temp[j].data] ||
               this.rule.endToStart[temp[j].data] && this.rule.endToStart[temp[j].data].indexOf(atomKey) < 0)) {
              i = i + temp[j].len - 1
              continue
            }
            // 将前面的content存入
            if (lastPoint < i) {
              token.push({
                type: 'content',
                data: this.str.substring(lastPoint, i)
              })
            }
            token.push(temp[j])
            lastPoint = i + temp[j].len
            i = lastPoint - 1
            // atom
            if (temp[j].isAtom) {
              isAtom = !isAtom
              atomKey = temp[j].data
            }
            break
          }
        }
      }
    }
    if (lastPoint < this.str.length) {
      token.push({
        type: 'content',
        data: this.str.substring(lastPoint, this.str.length)
      })
    }
    this.endToken = token
  }

  getHighToken () {
    let stack = new Stack()
    let stackStartEnd = new Stack() // 用来存储开头和结尾一样的情况
    let stackStart = new Stack() // 用来存储开头start，当找到end的时候，在这里寻找，是否要进行high层次
    let lastType = ''
    for (let i=0; i<this.endToken.length; i++) {
      let curEndToken = this.endToken[i]
      stack.push(curEndToken)
      switch (curEndToken.type) {
        case 'start':
          lastType = 'start'
          stackStart.push(curEndToken.data)
          break
        case 'startEnd':
          if (stackStartEnd.isEmpty()) {
            stackStartEnd.push(curEndToken)
            break
          }
          let lastStartend = stackStartEnd.pop()
          if (lastStartend.data !== curEndToken.data) {
            stackStartEnd.push(lastStartend)
            stackStartEnd.push(curEndToken)
            break
          }
          // this.getHighNew(stack, curEndToken, [stack.pop()])
          this.getHigh(stack, ['startEnd'], 'token', [stack.pop()])
          break
        case 'end':
          if (!lastType || lastType === 'end') break
          // 理论上来说，开始也可能有问题，需要一直追溯，但是这里为了简单只追溯1个
          if (curEndToken.data === this.rule.rule.newline) {
            // this.getHighNew(stack, curEndToken)
            this.getHigh(stack, ['start'], 'token', [])
            lastType = 'end'
            break
          }
          if (this.rule.endToStart[curEndToken.data].indexOf(stackStart.getTop()) >= 0 ) {
            stackStart.pop()
            // this.getHighNew(stack, curEndToken)
            this.getHigh(stack, ['start'], 'token', [])
            lastType = 'end'
            break
          }
      }
    }
    this.highToken = stack.getData()
    this.highToken.type = 'token'
  }

  getHighNew (stack, stopToken, tempArr = []) {
    let isLeaf = true
    while (!stack.isEmpty()) {
      // 这样的temp就比之前多了一种token类型，当作content处理
      let curToken = stack.pop()
      let rand = `${Math.floor(Math.random()*1000)}-${Math.floor(Math.random()*100)}-${Math.floor(Math.random()*1000)}`
      tempArr.push(curToken)
      if (curToken.type === 'token') isLeaf = false
      if (this.rule.endToStart[stopToken.data].indexOf(curToken.data) >= 0 || stack.isEmpty) {
        tempArr.type = 'token'
        tempArr.isLeaf = isLeaf
        tempArr.isBlock = curToken.isBlock
        tempArr.id = rand
        tempArr.reverse()
        if (this.isTitle.indexOf(tempArr[0].key) >= 0) {
          this.title.push(tempArr)
        }
        stack.push(tempArr)
        break
      }
    }
  }

  getHigh = function (stack, stopType, goalType, tempArr) {
    let isLeaf = true
    while (!stack.isEmpty()) {
      // 这样的temp就比之前多了一种token类型，当作content处理
      let curToken = stack.pop()
      let rand = `${Math.floor(Math.random()*1000)}-${Math.floor(Math.random()*100)}-${Math.floor(Math.random()*1000)}`
      tempArr.push(curToken)
      if (curToken.type === 'token') isLeaf = false
      if (stopType.indexOf(curToken.type) >= 0) {
        tempArr.type = goalType
        tempArr.isLeaf = isLeaf
        tempArr.isBlock = curToken.isBlock
        tempArr.id = rand
        tempArr.reverse()
        if (this.isTitle.indexOf(tempArr[0].key) >= 0) {
          this.title.push(tempArr)
        }
        stack.push(tempArr)
        break
      }
    }
  }

  addBlockToken = function (token) {
    token = token || this.highToken
    let curToken
    let tempArr
    let stack = new Stack()
    for (let i=0; i<token.length; i++) {
      curToken = token[i]
      let isLeaf = true
      tempArr = []
      stack.push(curToken)
      if (curToken.isBlock) {
        stack.pop()
        if (curToken.type === 'end') {
          tempArr = [curToken]
        }
        while (!stack.isEmpty()) {
          let temp = stack.pop()
          if (temp.type === 'token') isLeaf = false
          if (!temp.isBlock) {
            tempArr.push(temp)
          }
          if (stack.isEmpty() || temp.isBlock) {
            if (temp.isBlock) {
              stack.push(temp)
            }
            break
          }
        }
        if (tempArr.length > 0) {
          tempArr.type = 'block'
          tempArr.isLeaf = isLeaf
          tempArr.isBlock = true
          tempArr.reverse()
          stack.push(tempArr)
        }
        if (curToken.type === 'token') {
          stack.push(curToken)
        }
      }
    }
    // 最后插进去的可能不是block
    temp = stack.pop()
    if (temp.isBlock) {
      stack.push(temp)
      this.blockToken = stack.getData()
      return
    }
    tempArr.push(temp)
    isLeaf = true
    if (temp.type === 'token') isLeaf = false
    while(!stack.isEmpty()) {
      temp = stack.pop()
      if (temp.type === 'token') isLeaf = false
      if (stack.isEmpty()) {
        tempArr.push(temp)
        break
      }
      if (temp.type === 'block') {
        stack.push(temp)
        break
      } else {
        tempArr.push(temp)
      }
    }
    tempArr.isLeaf = isLeaf
    tempArr.isBlock = true
    tempArr.type='block'
    tempArr.reverse()
    stack.push(tempArr)
    this.blockToken = stack.getData()
  }
}