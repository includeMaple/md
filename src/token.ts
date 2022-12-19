
import { Stack } from './stack';
import { STRING_SPACE, TITLE_RULES } from './configs';
import { IStringSpace, IRuleMap, ITokenItem, TTokenType } from './iface';
export class Token {
  public ruleSpace: IStringSpace = STRING_SPACE;
  public document = '';
  private token: ITokenItem[] = [];


  // public endToken = []
  public highToken = []
  public blockToken = []
  public title = []
  public isTitle = TITLE_RULES;

  constructor () {}

  getToken (document: string, ruleMap: IRuleMap) {
    // 初始化
    // this.rule = rule
    // this.rule.washOptions()
    // this.title = []
    this.document = document? document: this.document;
    // 生成token stream
    this.getEndToken(ruleMap);
    // 生成抽象语法树
    this.getHighToken();
    this.addBlockToken()
    return this.blockToken
  }

  /**
   * 词法解析，生成token流
   * @param ruleMap 
   */
  getEndToken (ruleMap: IRuleMap) {
    this.token = [];
    // 上次扫描到的位置
    let lastPoint: number = 0
    // let isAtom = false
    // let atomKey = ''
    // let jump = {
    //   slash: {
    //     data: '\\',
    //     num: 1
    //   }
    // }
    // 扫描文档流
    for (let i=0; i<this.document.length; i++) {
      let s = this.document[i]
      // 转义字符处理
      if (s === this.ruleSpace.escape) {
        i += 1;
        continue;
      }
      // 生成token
      if (Object.prototype.hasOwnProperty.call(ruleMap, s)) {
        // 扫描规则，是否符合
        let rule = ruleMap[s]
        for (let j=0; j< rule.length; j++) {
          let docMayToken = this.document.substring(i, i+rule[j].len);
          if ( docMayToken !== rule[j].data) {
            continue;
          }
          // 存入之前的内容
          if (lastPoint < i) {
            this.token.push({
              type: 'content',
              data: this.document.substring(lastPoint, i),
              key: 'content'
            })
          }
          this.token.push({
            type: rule[j].type,
            data: docMayToken,
            key: rule[j].key
          })
          lastPoint = i + rule[j].len;
          i = lastPoint - 1;
          break;
          // 存入token
          // 扫描到是规则里的东西
          // if (this.document.substring(i, i+temp[j].len) === temp[j].data) {
          //   if (isAtom && (!this.rule.endToStart[temp[j].data] ||
          //      this.rule.endToStart[temp[j].data] && this.rule.endToStart[temp[j].data].indexOf(atomKey) < 0)) {
          //     i = i + temp[j].len - 1
          //     continue
          //   }
          //   // 将前面的content存入
          //   if (lastPoint < i) {
          //     token.push({
          //       type: 'content',
          //       data: this.document.substring(lastPoint, i)
          //     })
          //   }
          //   token.push(temp[j])
          //   lastPoint = i + temp[j].len
          //   i = lastPoint - 1
          //   // atom
          //   if (temp[j].isAtom) {
          //     isAtom = !isAtom
          //     atomKey = temp[j].data
          //   }
          //   break
        }
      }
    }
    // }
    if (lastPoint < this.document.length) {
      this.token.push({
        type: 'content',
        data: this.document.substring(lastPoint, this.document.length)
      })
    }
    // this.token = token
  }

  /**
   * 生成抽象语法树
   */
  getHighToken () {
    let stack: Stack = new Stack();
    let stackStartEnd: Stack = new Stack(); // 用来存储开头和结尾一样的情况
    let stackStart: Stack = new Stack(); // 用来存储开头start，当找到end的时候，在这里寻找，是否要进行high层次
    let lastType = ''
    for (let i=0; i<this.token.length; i++) {
      let curEndToken = this.token[i]
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
          let lastStartend = stackStartEnd.pop();
          
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
          if (curEndToken.data === this.ruleSpace.newline) {
            // this.getHighNew(stack, curEndToken)
            this.getHigh(stack, ['start'], 'token', [])
            lastType = 'end'
            break
          }
          // if (this.rule.endToStart[curEndToken.data].indexOf(stackStart.getTop()) >= 0 ) {
          //   stackStart.pop()
          //   // this.getHighNew(stack, curEndToken)
          //   this.getHigh(stack, ['start'], 'token', [])
          //   lastType = 'end'
          //   break
          }
      }
    // }
    this.highToken = stack.getData()
    this.highToken.type = 'token'
  }

  getHighNew (stack: Stack, stopToken, tempArr = []) {
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

  getHigh (stack: Stack, stopType: TTokenType[], goalType: TTokenType, tempArr: ITokenItem[]) {
    let isLeaf = true
    while (!stack.isEmpty()) {
      // 这样的temp就比之前多了一种token类型，当作content处理
      let curToken = stack.pop();
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

  addBlockToken () {
    let token = this.highToken
    let curToken
    let tempArr
    let temp
    let stack: Stack = new Stack();
    let isLeaf = true;
    for (let i=0; i<token.length; i++) {
      curToken = token[i]
      isLeaf = true
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
