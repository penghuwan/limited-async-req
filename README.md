# limited-async-req
用于处理按并发阈值限流执行的异步函数

# Installation
```
npm i limited-async-req
```

# Introduction
## initReqLimit方法
通过调用initReqLimit，传入并发阈值作为参数，则可返回一个接受异步函数为参数的处理函数，**假设其为reqLimit**，接收的异步函数会在适当的时候调用，
如果当前并发量没有超出阈值，则该异步函数会立刻得到调用，但如果超出了阈值，则异步函数会先存储起来，并在其他并发函数处理完毕时候尝试调用
## reqLimit方法的参数和返回值
+ reqLimit的参数可以是一个async函数，也可以是任何一个返回Promise的函数。
+ reqLimit的返回值是一个Promise，这意味着你可以通过then方法或await去处理该异步任务的返回值

# Example Usage
```
import initReqLimit from 'limited-async-req'
async function func1() {
  return 1
}
async function func2() {
  return 2
}

async function func3() {
  return 3;
}
let reqLimit = initReqLimit(2);
reqLimit(func1).then(({ val, curCount }) => console.log("返回值=%s,当前并发量=%s", val, curCount));
reqLimit(func2).then(({ val, curCount }) => console.log("返回值=%s,当前并发量=%s", val, curCount));
reqLimit(func3).then(({ val, curCount }) => console.log("返回值=%s,当前并发量=%s", val, curCount));

```
输出如下：
```
返回值=1,当前并发量=2
返回值=2,当前并发量=2
返回值=3,当前并发量=1
```
# Background 
事实上，流行的流程控制工具包async提供了async.mapLimit方法用于并发数量控制的功能，但使用方式不同，需传入一个请求数组，
并以回调的方式进行处理，本项目主要是想开发一种自己熟悉且喜欢的方式，即类似于fetch().then(...)这样的方式，就是这样子而已啦
 
