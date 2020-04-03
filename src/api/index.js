// 导出配置好的axios提供给main.js去使用
import axios from 'axios'
import auth from '@/utils/auth'
import router from '@/router'
import JSONbig from 'json-bigint'

// 进行axios的配置，将来这回又很多axios相关的配置
// 基准地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 请求头 配置token
// axios.defaults.headers.Authorization = `Bearer ${auth.getUser().token}`

// 1. transformResponse配置中的函数   2. 响应拦截器    3. then()catch()
axios.defaults.transformResponse = [data => {
    // data 就是后台原始响应数据  理想情况下：json字符串
    // 其实在现在我们的后台接口有时候，返回的不是json字符串，结果来进行转换会报错
    // 转换后的数据要return出去
    try {
        return JSONbig.parse(data)
    } catch (e) {
        return data
    }
}]

// 请求拦截器
axios.interceptors.request.use(config => {
    // 当前函数：在每次请求前都会执行。
    // 修改请求头配置，追加上token
    // 做一个严谨的判断，本地存储了token就是追加
    const { token } = auth.getUser()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
}, err => Promise.reject(err))

// 响应拦截器
axios.interceptors.response.use(res => res, err => {
    // 业务：判断401状态码，清除本地token信息，跳转到登录页面
    // 1. 获取响应状态码  在响应报文中
    // 2. 响应报文对象 err.response
    // 3. 总结：statusCode ==== err.response.status  响应状态码
    if (err.response && err.response.status === 401) {
        // 1. 清除本地token信息
        auth.delUser()
        // 2. 跳转到登录页面
        // 在vue实例下,在组件代码中，可以使用this.$router.push('/login')
        // 所以在这里不能通过组件实例，访问$router这个对象，使用其push函数。
        // 方案1：window.location.href = 'http://localhost:8080/#/login'
        // 方案2：window.location.hash = '#/login'
        // 以上方式不建议：通过location直接修改地址，可能导致路由有些功能无法触发。
        // $router 其实就是 new VueRouter() 的实例对象，所以 路由实例也可以调用push函数
        router.push('/login')
    }
    return Promise.reject(err)
})

export default axios