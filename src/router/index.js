import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import VueJsonp from "vue-jsonp"
import VueScroller from 'vue-scroller'
import { ToastPlugin } from 'vux'
Vue.use(Router)
Vue.use(VueJsonp)
Vue.use(VueScroller)
Vue.use(ToastPlugin)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
