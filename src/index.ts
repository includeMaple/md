import { Rules } from './rules';
import { Token } from './token';
import { Render } from './render';
class Markdown {
  public rule: Rules = new Rules();
  public token: Token = new Token();
  public title: string = '';
  public render: Render = new Render();
  public bookInfo: unknown;

  constructor (document: string) {
    let tree = this.token.getToken(document, this.rule.ruleMap);
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
let doc = `# 想

1. 默认有可插拔插件，直接先配置上去
1. 不要使用全局类似gitbook的命令，使用本地的，防止影响
1. 打包chrome和node，这样可以让非开发人员使用
1. 导出成txt文本


# 要做的事情
gitbook还有四块内容
1. 怎么阅读源码并编写插件，插件设计思路是什么
1. 深化应用，比如怎么到处pdf格式，怎么添加一些新的功能
1. 服务器部署
1. 后面gitlab是不是应该专门做一块用来做这个的

a
<!-- 过程：
  1. 找一个插件看源码
  1. 找插件开发方式尝试开发插件
  1. 查看gitbook-cli源码
  1. 了解gitbook-cli与gitbook之间的关系 
-->

后面部署需要再看
http://demo.kujiajia.xyz/

后面部署需要再看
http://www.chengweiyang.cn/gitbook/gitbook.com/config/domain.html 

最后一个视频部署nginx服务器需要再看看
https://www.bilibili.com/video/BV1dv411J7B8?p=2&spm_id_from=pageDriver 

这些信息到底哪里来的，这里还有很多信息
https://www.jianshu.com/p/53fccf623f1c

怎么转换为pdf等

插件怎么写
https://www.imooc.com/article/details/id/293112`
let markdown = new Markdown(doc)