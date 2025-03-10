<template>
  <v-toolbar
    flat
    style="overflow-x:auto; white-space: nowrap;"
  >
    <v-btn
      v-if="user && ((user.roles && user.roles.includes('core.change_permissao')) || user.is_superuser)"
      text
      to="/lavagens"
    >
      <v-icon class="material-icons-outlined mr-1">
        directions_car
      </v-icon>
      Lavagem
    </v-btn>
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
          Vistoria
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item to="/vistoria">
          <v-list-item-title>Vistorias</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
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
  }
}
</script>

<style lang="scss" scoped>
.v-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 400;
}
</style>
