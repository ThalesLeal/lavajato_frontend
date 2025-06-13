<template>
  <v-toolbar
    flat
    style="overflow-x:auto; white-space: nowrap;"
  >
    <!-- Menu de Lavagens -->
    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <v-btn
          v-if="user && ((user.roles && user.roles.includes('core.change_vistoria')) || user.is_superuser)"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-icon class="material-icons-outlined mr-1">
            directions_car
          </v-icon>
          Lavagens
        </v-btn>
      </template>
      <v-list dense>
        <!-- Opção para Lista de Lavagens -->
        <v-list-item @click="goToLavagemList">
          <v-list-item-title>Lista de Lavagens</v-list-item-title>
        </v-list-item>

        <!-- Opção para Cadastro de Lavagem -->
        <v-list-item @click="goToLavagemCreate">
          <v-list-item-title>Cadastro de Lavagem</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Menu de Funcionários -->
    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <v-btn
          v-if="user && ((user.roles && user.roles.includes('core.change_vistoria')) || user.is_superuser)"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-icon class="material-icons-outlined mr-1">
            checklist
          </v-icon>
          Funcionários
        </v-btn>
      </template>
      <v-list dense>
        <!-- Opção para Lista de Funcionários -->
        <v-list-item @click="goToFuncionarioList">
          <v-list-item-title>Lista de Funcionários</v-list-item-title>
        </v-list-item>

        <!-- Opção para Cadastro de Funcionário -->
        <v-list-item @click="goToFuncionarioCreate">
          <v-list-item-title>Cadastro de Funcionário</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Botões de Relatórios e Configurações -->
    <v-btn
      v-if="user && ((user.roles && user.roles.includes('core.change_permissao')) || user.is_superuser)"
      text
      to="/relatorio"
    >
      <v-icon class="material-icons-outlined mr-1">
        print
      </v-icon>
      Relatórios
    </v-btn>

    <v-btn
      v-if="user && ((user.roles && user.roles.includes('core.change_permissao')) || user.is_superuser)"
      text
      to="/configuracao"
    >
      <v-icon class="material-icons-outlined mr-1">
        tune
      </v-icon>
      Configurações
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  name: 'SToolbar',
  computed: {
    user() {
      // Tenta obter o usuário do localStorage
      const stored = localStorage.getItem('semob@user')
      return stored ? JSON.parse(stored) : null
    }
  },

  methods: {
  // Navegar para a lista de lavagens, com verificação para evitar navegação redundante
  goToLavagemList() {
    if (this.$route.path !== '/lavagens') {
      this.$router.push('/lavagens')
    }
  },
  
  // Navegar para o cadastro de lavagem, com verificação para evitar navegação redundante
  goToLavagemCreate() {
    if (this.$route.path !== '/lavagens/create') {
      this.$router.push('/lavagens/create')
    }
  },
  
  // Navegar para a lista de funcionários, com verificação para evitar navegação redundante
  goToFuncionarioList() {
    if (this.$route.path !== '/funcionarios') {
      this.$router.push('/funcionarios')
    }
  },
  
  // Navegar para a página de cadastro de funcionário, com verificação para evitar navegação redundante
  goToFuncionarioCreate() {
    if (this.$route.path !== '/funcionarios/create') {
      this.$router.push('/funcionarios/create')
    }

  }
}}
</script>

<style lang="scss" scoped>
.v-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 400;
}
</style>
