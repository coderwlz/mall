import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/home'
  },
  {
    path:'/home',
    name:'Home',
    component: ()=>import('../views/home/Home.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/cart/Cart.vue')
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('../views/category/Category.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/profile/Profile.vue')
  },
  {
    path: '/detail/:iid',
    name: 'Detail',
    component: () => import('../views/detail/Detail.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
