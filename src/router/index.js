import { createRouter, createWebHistory } from 'vue-router'
import OrderBrowseView from '../views/OrderBrowseView.vue'
import OrderDetail from '../views/OrderDetail.vue'
import EditProductView from '../views/EditProductView.vue'
import HomeView from '../views/HomeView.vue'
import ManageOrders from '../views/ManageOrders.vue'
import InitView from '../views/InitView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/shop',
      name: 'shop',
      component: () => import('../views/AllProductsView.vue'),
    },
    {
      path: '/init',
      name: 'init',
      component: () => import('../views/InitView.vue'),
    },
    {
      path: '/manage-orders',
      name: 'manage-orders',
      component: () => import('../views/ManageOrders.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrderBrowseView
    }, 
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/orders/:id',
      name: 'orderDetail',
      component: OrderDetail
    },
    {
      path: '/AllProducts',
      name: 'AllProducts',
      component: () => import('../views/AllProductsView.vue'),
    },
    {
      path: '/product-detail/:id',
      name: 'product-details',
      component: () => import('../views/ProductView.vue'),
    },
    {
      path: '/product-edit/:id',
      name: 'product-edit',
      component: EditProductView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/checkout',
      name: 'checlout',
      component: () => import('../views/CartCheckoutView.vue'),
    },
     
  ],
})

export default router
