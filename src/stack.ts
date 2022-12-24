import { ITokenItem } from "./iface";

// stack
export class Stack {
  public top = -1;
  public data: unknown[] = [];
  public max = 10000;

  constructor (max?: number) {
    if (max) { this.max = max; }
  }

  create (arr: unknown[]) {
    this.top = arr.length - 1;
    this.data = arr;
  }

  isFull () { return this.top === this.max - 1; }
  isEmpty () { return this.top === -1; }

  /**
   * 入栈
   * @param item 
   * @returns 
   */
  push (item: unknown) {
    if (this.isFull()) {
      console.error('stack is full');
      return false;
    }
    this.data[this.top + 1] = item;
    this.top ++;
    return true;
  }

  /**
   * 出栈
   * @returns 
   */
  pop () {
    if (this.isEmpty()) {
      console.error('stack is empty');
      return;
    }
    this.top--;
    return this.data[this.top+1];
  }

  getTop () {
    if (this.isEmpty()) {
      console.error('stack is empty');
      return;
    }
    return this.data[this.top];
  }

  getData () {
    return this.data.slice(0, this.top+1);
  }

  /**
   * 加载初始化数据
   * @param data 
   */
  initData (data: unknown) {
    if (Array.isArray(data)) {
      this.create(data);
    } else {
      this.data = [data];
      this.top = 0;
    }
  }
}

// 栈的一种应用，将token stream转换为token tree
export class Stream2tree {
  public stackData: Stack = new Stack();
  constructor (public data: unknown[]) {}

  /**
   * 清洗token遍历
   * @param stopInFn true继续入栈，false停止入栈进行升树操作，等升成树后再入栈，控制stackData的push
   * @param stopOutFn true继续出栈升级别，false停止（将父节点push回stackData），控制升级
   */
  wash (
    isGenerateStackNode: (itemData: unknown, top: unknown)=> boolean, // 是否对stack进行升树操作
    isStopGenerateStackNode: (itemData: unknown, top: unknown) => boolean, // 是否停止对stack进行升树操作
    gennerateStackNode: (itemData: unknown) => {children: unknown[]}, // 生成node
    stopInFn: (itemData: unknown, top: unknown)=> boolean,
    stopOutFn: (itemData: unknown, top: unknown, ttop: unknown)=> boolean,
    generateNode: (itemData: unknown) => {children: unknown[]},
    updateNode: (itemData: unknown) => void) {
    // 循环遍历stream token，要判断的是，什么时候入栈什么时候升级别
    this.data.forEach((item: unknown) => {
      let top = this.stackData.getTop();
      // 是否需要对stack内的内容进行升树操作（不包含item）
      if (isGenerateStackNode(item, top)) {
        this.getStackNode(isStopGenerateStackNode, gennerateStackNode);
      }
      // 是否要进行升树操作（包含item）
      if (stopInFn(item, top)) {
        this.stackData.push(item); // 入栈
      } else {
        this.getTreeNode(item, stopOutFn, generateNode, updateNode); // 升级别
        console.log(item)
      }
    })
  }

  /**
   * 出栈变成children并添加父节点，需要考虑的是什么时候停止出栈
   * @param stopOutFn true继续出栈，false停止出栈
   */
  getTreeNode (item: unknown,
    stopOutFn: (itemData: unknown, top: unknown, ttop: unknown)=> boolean,
    generateNode: (itemData: unknown) => {children: unknown[]},
    updateNode: (itemData: unknown) => void) {
    let node: {children: unknown[]} = generateNode(item);
    while (true) {
      let top = this.stackData.pop();
      let ttop = this.stackData.getTop();

      if (!top && node.children.length > 0) {
        this.stackData.push(node);
        return;
      }
      node.children.unshift(top);
      if (!stopOutFn(item, top, ttop)) {
        updateNode(node); // 插入前更新下
        this.stackData.push(node);
        return;
      }
    }
  }

  getStackNode (
    isStopGenerateStackNode: (itemData: unknown, top: unknown) => boolean,
    gennerateStackNode: (itemData: unknown) => {children: unknown[]},) {
    let item: unknown = this.stackData.pop();
    let node: {children: unknown[]} = gennerateStackNode(item);
    while (true) {
      let ttop = this.stackData.getTop();
      if (!ttop) { break; }
      if (isStopGenerateStackNode(item, ttop)) {
        break;
      }
      this.stackData.pop();
      node.children.push(ttop);
    }
    this.stackData.push(node);
  }
}

// stack的一种应用，树的深度优先遍历
export class TreeWalk {
  public stack = new Stack();

  constructor () {}

  /**
   * preorder tree walk 树的深度优先遍历的前序遍历
   * 下面代码未仔细测试todo
   * @param data 
   */
  preorder (data: ITokenItem[]) {
    this.stack.initData(data);
    let res: ITokenItem[] = [];
    while (!this.stack.isEmpty()) {
      let top: ITokenItem = this.stack.pop() as ITokenItem;
      res.push(top);

      if (top.children) {
        for (let i= top.children.length-1; i>-1; i--) {
          this.stack.push(top.children[i]);
        }
      }
    }
    return res;
  }

  /**
   * inorder tree walk 树的深度优先遍历的中序遍历 todo
   * @param data 
   */
  inorder (data: unknown) {
    // pass
  }

  /**
   * postorder tree walk 树的深度优先遍历的后序遍历
   * @param data 
   */
  postorder (data: ITokenItem[], fn?: (node: ITokenItem) => void) {
    this.stack.initData(data);
    let res: ITokenItem[] = [];
    while (!this.stack.isEmpty()) {
      let top: ITokenItem = this.stack.pop() as ITokenItem;

      res.unshift(top);

      if (top.children) {
        for (let i=0; i<top.children.length; i++) {
          this.stack.push(top.children[i]);
        }
      }
    }
    return res;
  }

}
