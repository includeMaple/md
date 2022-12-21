
import { TreeWalk } from "./stack";
import { Rules } from "./rules";
import { ITreeNode } from './iface';
import { DEFAULT_RENDER_FN } from "./configs";

export class Render {
  private rules: Rules = new Rules();

  private treeWalk: TreeWalk = new TreeWalk();
  public titleInfo: ITreeNode[] = [];
  constructor () {}

  render (data: ITreeNode[]) {
    // 使用树的深度优先遍历的后序遍历生成value
    let processList: ITreeNode[]  = this.treeWalk.postorder(data);
    processList.forEach((item: ITreeNode) => {
      if (item.children) {
        if (item.key in this.rules.options || item.key === 'content') {
          item.value = this.getChildrenValue(item)
          let renderFn = this.rules.options[item.key]?.render || DEFAULT_RENDER_FN;
          item.value = renderFn(item);
        }
      } else {
        // 这里的叶子节点实际没有完全修改完type（主要为了stack的通用性，改掉了最后一个，但没改前面的）
        if (item.type !== 'content' && item.type !== 'block') {
          item.type = 'keyword';
          item.value = '';
        }
        if (item.type == 'content') {
          item.value = item.data || '';
        }
      }
    })
    let res = processList[processList.length - 1].value;
    // 生成标题
    this.titleInfo = processList.filter((i: ITreeNode) => {
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
  private getChildrenValue (item: ITreeNode) {
    let str = '';
    item.children?.forEach((i) => {
      str += i.value;
    })
    return str;
  }
}
