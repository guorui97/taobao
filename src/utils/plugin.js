// 基于vue的插件
import MyBread from '@/components/my-bread'
import MyChannel from '@/components/my-channel'
import MyCover from '@/components/my-cover'
export default {
    // Vue 来源：main.js使用Vue.use(插件)，调用插件中install函数，且或传入Vue对象。
    install(Vue) {
        // 基于Vue对象来扩展Vue功能
        Vue.component(MyBread.name, MyBread)
        Vue.component(MyChannel.name, MyChannel)
        Vue.component(MyCover.name, MyCover)

        // 将来，你有其他的全局组件，全局过滤器，全局自定义指令及原型属性或函数，都可以在这里进行扩展。
    }
}