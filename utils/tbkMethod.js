const dayjs = require('dayjs')
const md5 = require('js-md5')
// tbk_secret key
let secret = '6f07742d7c6273967f7be78334377056'

function objKeySort(obj) { //排序的函数
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newArray是一个数组
    let newArray = Object.keys(obj).sort()
    let newObj = {}
    for (let i = 0; i < newArray.length; ++i) {
        newObj[newArray[i]] = obj[newArray[i]]
    }
    return newObj
}

// 返回淘宝客请求体
function tbkMethod(method, options) {
    let rawObj = {
        app_key: 30892692,
        method,
        sign_method: 'md5',
        timestamp: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        v: '2.0',
        format: 'json',// 公共参数结束
        ...options
    }
    // 将对象根据首字母排序
    let sortObj = objKeySort(rawObj)
    // 拼接字符串
    let sortStr = ''
    for (let i in sortObj) {
        sortStr += i + sortObj[i]
    }
    // 生成md5码
    let sign = md5(`${secret}${sortStr}${secret}`).toUpperCase()
    return {
        ...sortObj,
        sign
    }
}

module.exports = tbkMethod 