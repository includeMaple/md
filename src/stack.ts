import { ITreeNode } from "./iface";

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

  isFull () {
    return this.top === this.max - 1;
  }

  isEmpty () {
    return this.top === -1;
  }

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
      this.data = data;
      this.top = this.data.length - 1;
    } else {
      this.data = [data];
      this.top = 0;
    }
  }
}

export class StackOne {
  public stackData: Stack = new Stack();
  // public stackTree: Stack = new Stack();

  constructor (public data: unknown[]) {}

  /**
   * 清洗token遍历
   * @param stopInFn true继续，false停止，控制stackData的push，false的时候进行升树操作
   * @param stopOutFn true继续，false停止，stackData.pop(),true继续pop，false停止push入stackTree
   */
  wash (stopInFn: (itemData: unknown)=> boolean,
  stopOutFn: (itemData: unknown)=> boolean,
  generateNode: (itemData: unknown) => {children: unknown[]}) {
    this.data.forEach((item: unknown) => {
      if (stopInFn(item)) {
        this.stackData.push(item);
      } else {
        this.getTreeNode(item, stopOutFn, generateNode);
      }
    })
    // 接受剩余内容
    let top = this.stackData.pop();
    if (top) {
      this.getTreeNode(top, () => {
        return true;
      }, generateNode)
    }
  }

  /**
   * token变成tree
   * @param stopOutFn true继续，false停止
   */
  getTreeNode (item: unknown, stopOutFn: (itemData: unknown)=> boolean,
    generateNode: (itemData: unknown) => {children: unknown[]}) {
    let node: {children: unknown[]} = generateNode(item);
    while (true) {
      let top = this.stackData.pop();

      if (!top && node.children.length > 0) {
        this.stackData.push(node);
        return;
      }
      node.children.unshift(top);
      if (!stopOutFn(top)) {
        this.stackData.push(node);
        return;
      }
    }
  }
}

export class TreeWalk {
  public stack = new Stack();

  constructor () {}

  /**
   * preorder tree walk 树的深度优先遍历的前序遍历
   * 下面代码未仔细测试todo
   * @param data 
   */
  preorder (data: ITreeNode[]) {
    this.stack.initData(data);
    let res: ITreeNode[] = [];
    while (!this.stack.isEmpty()) {
      let top: ITreeNode = this.stack.pop() as ITreeNode;
      res.push(top);

      if (top.children) {
        for (let i= top.children.length-1; i>-1; i--) {
          this.stack.push(top.children[i])
        }
      }
    }
    return res;
  }

  /**
   * inorder tree walk 树的深度优先遍历的中序遍历
   * @param data 
   */
  inorder (data: unknown) {
    // pass
  }

  /**
   * postorder tree walk 树的深度优先遍历的后序遍历
   * @param data 
   */
  postorder (data: ITreeNode[], fn?: (node: ITreeNode) => void) {
    this.stack.initData(data);
    let res: ITreeNode[] = [];
    while (!this.stack.isEmpty()) {
      let top: ITreeNode = this.stack.pop() as ITreeNode;

      res.unshift(top);

      if (top.children) {
        for (let i=0; i<top.children.length; i++) {
          this.stack.push(top.children[i])
        }
      }
    }
    return res;
  }

}