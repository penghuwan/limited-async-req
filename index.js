/**
 * 返回一个可按并发阈值限流执行的函数
 * @param {string} count  最大并发量阈值.
 * @returns {function} 可传入一个async函数作为参数
 */
function initReqLimit(count = 5) {
    let curCount = 0; // 当前并发量
    let asyncFnArr = []; // 超过并发阈值时，存储待调用的异步函数，和对应的resolve方法
    function recursion() {
        if (curCount < count) { // 当前并发量小于阈值时，处理函数调用
            curCount++; // 增加当前并发量
            const { asyncFn, resolve } = asyncFnArr.pop(); // 取出异步函数    
            asyncFn().then((val) => { // 调用异步函数
                resolve({ val, curCount }); //然后调用Promise，使外层Promise变化
                curCount--;  // 当前并发函数已经执行完毕，减少当前并发量
                if (asyncFnArr.length > 0) {
                    recursion(); // 如果还有待调用的异步函数，递归
                }
            }).catch(err => { throw err; })
        }
    }
    return function (asyncFn) {
        // 返回的是一个Promise，以便请求函数可以通过then方法等获得返回值
        return new Promise(function (resolve, reject) {
            // 存储异步函数和对应的resolve，这是因为该函数可能无法
            // 立即得到调用，需在条件满足时再次取出
            asyncFnArr.push({
                asyncFn,
                resolve
            });
            recursion();
        })
    }
}

module.exports = initReqLimit;