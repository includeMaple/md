
export class Stack {
  public top = -1;
  public data = [];
  public max = 10000;

  constructor (max?: number) {
    if (max) { this.max = max; }
  }

  create (arr) {
    this.top = arr.length - 1;
    this.data = arr;
  }

  isFull () {
    return this.top === this.max - 1;
  }

  isEmpty () {
    return this.top === -1;
  }

  push (item) {
    if (this.isFull()) {
      console.error('stack is full');
      return false;
    }
    this.data[this.top + 1] = item;
    this.top ++;
    return true;
  }

  pop () {
    if (this.isEmpty()) {
      console.error('stack is empty');
      return;
    }
    this.top--
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
    return this.data.slice(0, this.top+1)
  }
}