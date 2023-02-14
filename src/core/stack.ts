import { ITokenItem } from "./iface";

// stack
export class Stack<T> {
  public top = -1;
  public data: T[] = [];
  public max = 10000;

  constructor (max?: number) {
    if (max) { this.max = max; }
  }

  create (arr: T[]) {
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
  push (item: T) {
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
  pop (): T|null {
    if (this.isEmpty()) {
      console.error('stack is empty');
      return null;
    }
    this.top--;
    return this.data[this.top+1];
  }

  getTop (): T|null {
    if (this.isEmpty()) {
      console.error('stack is empty');
      return null;
    }
    return this.data[this.top];
  }

  getData (): T[] {
    return this.data.slice(0, this.top+1);
  }

  /**
   * 加载初始化数据
   * @param data 
   */
  initData (data: T) {
    if (Array.isArray(data)) {
      this.create(data);
    } else {
      this.data = [data];
      this.top = 0;
    }
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
