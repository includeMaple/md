
import { TreeWalk } from "./stack";
import { Rules } from "./rules";
import { ITokenItem } from './iface';
import { DEFAULT_RENDER_FN } from "./configs";

export class Render {
  private rules: Rules = new Rules();

  private treeWalk: TreeWalk = new TreeWalk();
  public titleInfo: ITokenItem[] = [];
  constructor () {}

  render (data: ITokenItem[]) {
    // 使用树的深度优先遍历的后序遍历生成value
    let processList: ITokenItem[]  = this.treeWalk.postorder(data);
    processList.forEach((item: ITokenItem) => {
      this.renderItem(item);
    })
    let res = processList[processList.length - 1].value;
    // 生成标题
    this.titleInfo = processList.filter((i: ITokenItem) => {
      return this.rules.titleList.indexOf(i.key) > -1 &&
        i.data !== this.rules.space.newline && i.children;
    })
    this.titleInfo.forEach((item) => { // 这里的代码可以和上面一样，删掉了else，后续可以优化，todo，另外标题渲染和文本渲染应该是不一样的
      if (item.children) {
        if (item.key in this.rules.options || item.key === 'content') {
          item.value = this.getChildrenValue(item)
          let renderFn = this.rules.options[item.key]?.render || DEFAULT_RENDER_FN;
          item.value = renderFn(item);
        }
      }
    })
    return res;
  }

  setRules (rules: Rules) {
    this.rules = rules;
  }

  /**
   * 获得子节点信息
   * @param item 
   * @returns 
   */
  private getChildrenValue (item: ITokenItem) {
    let str = '';
    item.children?.forEach((i) => {
      str += i.value;
    })
    return str;
  }

  /**
   * 渲染节点
   * @param item 
   * @return string
   */
  private renderItem (item: ITokenItem) {
    // 非叶子节点并且配置渲染方式的内容
    if (item.children && (item.key in this.rules.options || item.key === 'content')) {
      item.value = this.getChildrenValue(item)
      let renderFn = this.rules.options[item.key]?.render || DEFAULT_RENDER_FN;
      item.value = renderFn(item);
    } else if (item.tokenType === 'content') {
      item.value = item.data || '';
    }
    item.value = this.rules.blanklineFn(item, this.rules.space, item.isRootLine) ? this.rules.blanklineFn(item, this.rules.space, item.isRootLine) : item.value;
  }
}
