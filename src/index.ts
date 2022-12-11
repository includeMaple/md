import { Rules } from './rules';
import { Token } from './token';
import { Render } from './render';
let Markdown = function () {
  this.rule = new Rules()
  this.token = new Token()
  this.title = []
}
Markdown.prototype.setRules = function (rules) {
  this.rule.setRules(rules)
}
Markdown.prototype.setOptions = function (options) {
  this.rule.setOptions(options)
}
Markdown.prototype.setRender = function (options) {
  this.render.setOptions(options)
}
Markdown.prototype.mark = function (value, data) {
  let token = this.token.getToken(value, this.rule)
  this.render = new Render(token, data)
  this.render.render()
  // title
  this.title = this.getTitle(this.token.title)
  this.bookInfo = this.render.bookInfo
  return this.render.html
}
Markdown.prototype.getTitle = function (arr) {
  let html = ''
  for (let i=0; i<arr.length; i++) {
    html += arr[i].anchor
  }
  return html
}
let markdown = new Markdown()