import { Rules } from './rules';
import { Token } from './token';
import { Render } from './render';
class Markdown {
  public rule: Rules = new Rules();
  public token: Token = new Token(this.rule);
  public title: string = '';
  public render: Render = new Render();
  public bookInfo: unknown;

  constructor (document: string) {
    let tree = this.token.getToken(document);
    let html = this.render.render(tree);
    console.log(html)
  }

  setRules (rules: any) {
    this.rule.setRules(rules)
  }

  setOptions (options: any) {
    this.rule.setOptions(options)
  }

  setRender (options: any) {
    this.render.setOptions(options)
  }

  mark (value: any, data: any) {
    let token = this.token.getToken(value, this.rule)
    this.render = new Render(token, data)
    this.render.render()
    // title
    this.title = this.getTitle(this.token.title)
    this.bookInfo = this.render.bookInfo
    return this.render.html
  }

  getTitle (arr: any) {
    let html = ''
    for (let i=0; i<arr.length; i++) {
      html += arr[i].anchor
    }
    return html
  }
}
let doc = `# 想00**009**99

1. 默认有可插拔插件，直接先配置上去`
let markdown = new Markdown(doc)