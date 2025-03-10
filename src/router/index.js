import Vue from 'vue'
import VueRouter from 'vue-router'
import { isValidToken } from '@/services/auth.service'

Vue.use(VueRouter)

const Layout = () => import('@/layout/SApp.vue')

const routeOptions = [
  { path: 'lavagens', name: 'AgendamentoList' },
  { path: 'lavagens/create', name: 'LavagemCreate' },
  { path: 'lavagens/:id', name: 'LavagemEdit' }
]

const routes = routeOptions.map(route => ({
  ...route,
  component: () => import(`@/views/lavagem/${route.name}.vue`)
}))

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/',
      component: Layout,
      children: routes
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log('Navegando para:', to.fullPath)
  const token = localStorage.getItem('semob@accessToken')
  const user = localStorage.getItem('semob@user') ? JSON.parse(localStorage.getItem('semob@user')) : null
  console.log('Token:', token)
  console.log('User:', user)
  
  const { authorize } = to.meta
  if (to.name !== 'Login' && !isValidToken(token)) {
    console.log('Token inválido ou ausente, redirecionando para Login')
    next({ name: 'Login' })
  } else if (user && !user.is_superuser && authorize && !user.roles.includes(authorize)) {
    Vue.$toast.open({
      message: "Você não tem permissão para executar esta ação",
      type: "error"
    })
    // Você pode decidir se bloqueia ou não a navegação, ex.: next(false)
  } else {
    next()
  }
})

export default router
