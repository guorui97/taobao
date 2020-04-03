// 导入路由
import VueRouter from 'vue-router'
// 导入vue
import Vue from 'vue'

// 导入auth模块
import auth from '@/utils/auth'

// 导入组件(路由懒加载)
const Login = () => import('../views/Login.vue')
const Home = () => import('../views/Home.vue')
const Welcome = () => import('../views/Welcome.vue')
const NotFound = () => import('../views/404.vue')
const Article = () => import('../views/Article.vue')
const Image = () => import('../views/Image.vue')
const Publish = () => import('../views/Publish.vue')
const Comment = () => import('../views/Comment.vue')
const Fans = () => import('../views/Fans.vue')
const Setting = () => import('../views/Setting.vue')

// 注册路由
Vue.use(VueRouter)

// 声明路由规则
const routes = [
    // 登录
    { path: '/login', component: Login },
    // 首页
    {
        path: '/',
        component: Home,
        children: [
            { path: '/', component: Welcome },
            { path: '/article', component: Article },
            { path: '/image', component: Image },
            { path: '/publish', component: Publish },
            { path: '/comment', component: Comment },
            { path: '/fans', component: Fans },
            { path: '/setting', component: Setting }
        ]
    },
    // 通配规则，匹配以上规则没处理的 路径
    { path: '*', component: NotFound }
]

// 初始化路由实例
const router = new VueRouter({ routes })

// 导航守卫
router.beforeEach((to, from, next) => {
    // 如果你访问的路径是除去登录外的路径，并且你此时没有登录，拦截到登录页面。
    // 其他情况一概放行。
    const user = auth.getUser()
    if (to.path !== '/login' && !user.token) return next('/login')
    next()
})

// 导出路由实例
export default router