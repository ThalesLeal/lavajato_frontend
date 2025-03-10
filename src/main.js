import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import HttpGeneric from '@/services/generic.service'
import endpoints from '@/common/endpoints'  // Import único

import GenericMixin from '@/mixins/GenericMixin'
import VueToast from 'vue-toast-notification'
import VueTheMask from 'vue-the-mask'
import 'vue-toast-notification/dist/theme-sugar.css'

Vue.config.productionTip = false

// Adiciona os endpoints à instância do Vue
Vue.prototype.$endpoints = endpoints

// Configura o serviço genérico de API
Vue.prototype.$api = HttpGeneric

Vue.use(VueToast)
Vue.use(VueTheMask)
Vue.mixin(GenericMixin)

// Diretiva personalizada para verificar permissões
Vue.directive('permission', {
  inserted: function (el, binding) {
    const user = JSON.parse(localStorage.getItem('semob@user'))
    const permissions = Array.isArray(binding.value) ? binding.value : [binding.value]
    const hasPermission = user.is_superuser || permissions.some(permission => user.roles.includes(permission))
    if (!hasPermission) {
      el.parentNode.removeChild(el)
    }
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
