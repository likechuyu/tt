import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '@/views/login'
import home from '@/views/home'
import welcome from '@/views/welcome'
import notFound from '@/views/404'
import local from '@/utils/local'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '*', component: notFound },
    {
      path: '/login', component: Login
    },
    {
      path: '/',
      component: home,
      children:
        [
          {
            path: '/',
            component: welcome
          }
        ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  const user = local.getUser()
  if (to.path !== '/login' && !user) return next('/login')
  next()
})
export default router
