import Vue from 'vue'
import VueRouter from 'vue-router'
import { isValidToken } from '@/services/auth.service'

Vue.use(VueRouter)

const Layout = () => import('@/layout/SApp.vue')

// Rotas específicas de Lavagem
const routeOptionsLavagem = [
  { path: 'lavagens', name: 'AgendamentoList' },
  { path: 'lavagens/create', name: 'LavagemCreate' },
  { path: 'lavagens/:id', name: 'LavagemEdit' },
]

// Rotas específicas de Funcionário
const routeOptionsFuncionario = [
  { path: 'funcionarios', name: 'FuncionarioList' },
  { path: 'funcionarios/create', name: 'FuncionarioCreate' },
]

// Função para importar componentes de Lavagem
const importLavagemComponent = (name) => {
  return () => import(`@/views/lavagem/${name}.vue`)
}

// Função para importar componentes de Funcionário
const importFuncionarioComponent = (name) => {
  return () => import(`@/views/funcionarios/${name}.vue`)
}

// Mapear as rotas para os componentes de Lavagem
const routesLavagem = routeOptionsLavagem.map(route => ({
  ...route,
  component: importLavagemComponent(route.name)
}))

// Mapear as rotas para os componentes de Funcionário
const routesFuncionario = routeOptionsFuncionario.map(route => ({
  ...route,
  component: importFuncionarioComponent(route.name)
}))

// Juntando todas as rotas
const routes = [
  ...routesLavagem,
  ...routesFuncionario,
]

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
    next(false) // Bloqueia a navegação se o usuário não tiver permissão
  } else {
    next()
  }
})

export default router
