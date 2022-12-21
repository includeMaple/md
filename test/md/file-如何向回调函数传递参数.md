[book](title: 如何向回调函数传递参数)
# 概要
需要给回调函数传递参数有很多情况，如下调用回调函数本身接受需要传递给回调函数的参数，这种并非难事，如果代码复杂（比如里面有不同的分支，走不同的回调函数，需要不同个数不同类型的参数，比如绑定事件的时候因为希望能移除事件，没有用匿名函数作为参数）
```function testCallback(str, callback) {
  if (callback) callback(str)
}
testCallback('cc', function (param) {
  console.log(param)
})
```
比如如下情况
```function testCallback(callback) {
  if (callback) callback(str)
}```
# 全局变量
定义一个全局变量，下面案例使用了匿名函数作为回调函数，普通函数类似，不举例
```let tStr = 'global veriable' // 定义一个全局变量
testCallback('this is global veriable', function (param) {
   console.log(param)
})
function testCallback(str, callback) {
   console.log(str)
   if (callback) callback(tStr) // 参数使用前面定义的全局变量
}
```
结果
```this is global veriable
global veriable
```
# Closure
闭包+return函数，如下：
```function testCallback(callback) {
  if (callback) callback()
}

let fun = function (param) {
  return function () {
    console.log(param)
  }
}
testCallback(fun('sssssss'))
```
## bind
@@info 使用情况@@
1、被bind对象没有this：this绑定什么都不影响使用
2、绑定this和对象本身this一致，比如全局绑定全局的this，给某个对象传递参数，bind这个对象本身
3、本身就需要绑定this，顺便传递参数，比如事件绑定使用有名称函数并且传递参数
bind的目的在于重新绑定this，并且在函数调用时生效，可以利用这个特性变相传递参数.
如下第一种情况：function本身没有this操作，可以可以绑定{}
```function testCallback(callback) {
  if (callback) callback()
}
let fun = function (param) {
  console.log(param)
}
testCallback(fun.bind({}, 'T_T'))
```
建议不需要this的情况尽量用Closure，容易出错，如下是使用bind绑定后this被改变影响正常使用的情况
```function testCallback(callback) {
  if (callback) callback()
}
let Fun = function () {
  this.b = 'dddd'
}
Fun.prototype.show = function (param) {
  console.log(this.b)
  console.log(this.a)
  console.log(param)
}
let fun = new Fun()
fun.show('0000') // 可以访问到this.b
testCallback(fun.show.bind({a: 'sss'}, 'T_T')) // 虽然bind only a,but cant visit b, b is undefined
```

