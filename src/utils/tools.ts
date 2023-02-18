import { ITokenItem } from "../core/iface";

export let toolbox = {
  generateId () {
    return `${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}`
  },
  dataFormat (d?: Date) {
    let date = d ? d : new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  },
  getChildrenValue (item: ITokenItem) {
    if (!item.children) {
      return;
    }
    let str = '';
    item.children?.forEach((i) => {
      str += i.value;
    })
    return str;
  }
}
