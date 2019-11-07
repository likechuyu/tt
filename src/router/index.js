import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '@/views/login'
import home from '@/views/home'
import welcome from '@/views/welcome'
import notFound from '@/views/404'
import local from '@/utils/local'
import article from '@/views/article'
import image from '@/views/image'
import publish from '@/views/publish'
import comment from '@/views/comment'
import Setting from '@/views/setting'
import fans from '@/views/fans'

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
          },
          {
            path: '/article',
            component: article
          },
          {
            path: '/image',
            component: image
          },
          {
            path: '/publish',
            component: publish
          },
          {
            path: '/comment',
            component: comment
          },
          {
            path: '/setting',
            component: Setting
          },
          {
            path: '/fans',
            component: fans
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
