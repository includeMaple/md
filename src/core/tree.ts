

import { Rules } from "./rules";
import { IRuleMapItem, ITokenItem } from './iface';
import { Stack } from "./stack";
import { toolbox } from "../utils";

export class TokenTree{
  public rules: Rules = new Rules();
  public token: ITokenItem[] = [];
  public stack: Stack<ITokenItem> = new Stack();

  public convert (token?: ITokenItem[]) {
    if (token) { this.token = token; }
    this.token2Tree();
    return this.stack.getData();
  }

  private token2Tree () {
    for (let item of this.token) {
      if (this.isRaiseList(item)) {
        this.raiseList();
      }
      if (item.key === 'newline') {
        this.newline(item);
      } else if (item.type === 'start' || item.type === 'checked') {
        this.start(item);
      } else {
        this.end(item);
      }
      if (this.isStatus()) {
        this.raiseStatus();
      }
    }
  }

  private isStatus () {
    let top = this.stack.getTop();
    if (!top || top.type !== 'checked') { return false; }
    for (let key in this.rules.ruleStatus) {
      let rule: IRuleMapItem = this.rules.ruleStatus[key];
      if (rule.status &&  rule.status?.length > 0 && rule.status[rule.status.length - 1] === top.key) {
        return true;
      }
      return false;
    }
  }

  private raiseStatus () {
    for (let key in this.rules.ruleStatus) {
      let rule: IRuleMapItem = this.rules.ruleStatus[key];
      if (rule.status && rule.status?.length > 0) {
        let tempTop = this.stack.top;

        let children = [];
        let i = rule.status.length-1;
        let isOk = true;

        while (i >= 0) {
          let top = this.stack.pop();

          if (top?.key !== rule.status[i]) {
            isOk = false;
            this.stack.top = tempTop;
            break;
          }
          children.unshift(top)
          i--;
        }
        if (isOk) {
          this.stack.push({
            id: toolbox.generateId(),
            data: '',
            key: key,
            type: 'checked',
            isBlock: rule.isBlock,
            isList: false,
            isComple: true,
            children,
            value: ''
          })
          return;
        }
      }
    }
  }

  private newline (item: ITokenItem) {
    // 栈空直接插入，表示第一行是换行
    if (this.stack.isEmpty() || this.stack.getTop()?.isBlock) {
      this.stack.push(item);
      return;
    }
    let children: ITokenItem[] = [item];

    while (true) {
      let top =  this.stack.pop();

      // 第一行或者遇到上一个换行
      if (!top || top.key === 'newline') {
        if (top?.key === 'newline') {
          this.stack.top ++;
        }
        this.stack.push({
          id: toolbox.generateId(),
          type: 'checked',
          data: '',
          key: 'newline',
          isBlock: true,
          isComple: true,
          isList: false,
          children: children,
          value: ''
        });
        break;
      } else if (top.isBlock && top.type === 'start') {
        children.unshift(top);
        this.stack.push({
          id: toolbox.generateId(),
          type: 'checked',
          data: '',
          key: top.key,
          isBlock: true,
          isComple: !top.isList,
          isList: top.isList,
          children: children,
          value: ''
        })
        break;
      } else if (top.isBlock) {
        this.stack.top += 1;
        this.stack.push({
          id: toolbox.generateId(),
          type: 'checked',
          data: '',
          key: 'newline',
          isBlock: true,
          isComple: true,
          isList: false,
          children: children,
          value: ''
        });
        break;
      }
      children.unshift(top);
    }
  }

  /**
   * 判断两个节点是否匹配
   * @param start 
   * @param end 
   */
  isStartNode (start: ITokenItem, end: ITokenItem): boolean {
    // 以换行符结尾的单行内容
    if (start.type === 'start' && end.type === 'end'  && this.rules.ruleEndMap[start.key]?.indexOf(end.data) > -1) {
      return true;
    } else if (start.type === 'start' && end.type === 'end' && start.key === end.key) {
      return true;
    } else if (start.type === 'startEnd' && end.type === 'startEnd' && start.key === end.key) {
      return true;
    }
    return false;
  }

  /**
   * 是否需要升级为列表
   * @param item 
   * @returns 
   */
  isRaiseList (item: ITokenItem) {
    let topItem = this.stack.getTop();
    if (!topItem || !topItem.isList || topItem.type !== 'checked') {
      return false;
    } else if (topItem.type === 'checked' && topItem.isList && item.key !== topItem.key) {
      return true;
    }
    return false;
  }

  raiseList () {
    let tempTopItem: ITokenItem|null = this.stack.getTop();
    // let tempTop = this.stack.top;
    if (!tempTopItem) {
      return;
    }
    let children: ITokenItem[] = [];

    while (true) {
      let top = this.stack.pop();
      if (!top || !top.isList) {
        this.stack.top += 1;
        if (children.length > 0) {
          this.stack.push({
            type: 'checked',
            id: toolbox.generateId(),
            key: tempTopItem.key,
            data: '',
            isBlock: tempTopItem.isBlock,
            isList: true,
            isComple: true,
            children,
            value: ''
          })
        }
        return;
      }
      children.unshift(top);
    }
  }

  private end (item: ITokenItem) {
    let stackTop = this.stack.top;
    // end 变成checked, 并且变成content
    if (this.stack.isEmpty()) {
      this.toContent(item);
      this.stack.push(item);
    }
    let children = [item];

    while (true) {
      let top = this.stack.pop();

      // 栈空都没找到对应的start，降级为content,重置stack指针
      if (!top) {
        this.stack.top = stackTop;
        this.toContent(item);
        this.stack.push(item);
        break;
      } else if (this.isStartNode(top, item)) {
        children.unshift(top);
        this.stack.push({
          id: toolbox.generateId(),
          type: 'checked',
          key: top.key,
          data: '',
          isBlock: item.isBlock,
          isList: item.isList, // todo
          children,
          isComple: !top.isList, // todo
          value: ''
        })
        break;
      } else if (top.isBlock) {
        this.stack.top += 1;
        this.stack.push(item);
        // this.stack.push({
        //   id: toolbox.generateId(),
        //   type: 'checked',
        //   key: top.key,
        //   data: '',
        //   isBlock: item.isBlock,
        //   isList: item.isList, // todo
        //   children,
        //   isComple: !top.isList, // todo
        //   value: ''
        // })
        break;
      }
      children.unshift(top);
    }
  }

  /**
   * 将特殊节点降级为contenet
   * @param item 
   */
  toContent (item: ITokenItem) {
    Object.assign(item, {
      type: 'checked',
      key: 'content',
      isBlock: false,
      isComple: true,
    })
  }

  /**
   * start 直接入栈
   * @param item 
   */
  private start (item: ITokenItem) {
    this.stack.push(item)
  }

  setRule (rules: Rules) {
    this.rules = rules;
  }
}