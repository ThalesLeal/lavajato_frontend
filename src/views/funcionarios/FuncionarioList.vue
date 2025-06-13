<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="totalItems"
      :items-per-page="10"
      :footer-props="{'items-per-page-options': [10, 20, 30]}"
    >
      <template #[`item.action`]="{ item }">
        <v-toolbar-items>
          <v-tooltip bottom>
            <template #activator="{ attrs }">
              <v-btn
                v-bind="attrs"
                icon
                @click="editarFuncionario(item)"
              >
                <v-icon class="material-icons-outlined">
                  visibility
                </v-icon>
              </v-btn>
            </template>
            <span>Editar</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template #activator="{ attrs }">
              <v-btn
                v-bind="attrs"
                icon
                @click="deletarFuncionario(item.id)"
              >
                <v-icon class="material-icons-outlined">
                  delete
                </v-icon>
              </v-btn>
            </template>
            <span>Deletar</span>
          </v-tooltip>
        </v-toolbar-items>
      </template>
    </v-data-table>

    <!-- Coloque o PromptDialog aqui -->
    <PromptDialog ref="prompt" />
  </div>
</template>

<script>
import PromptDialog from '@/components/PromptDialog.vue'
import endpoints from '@/common/endpoints'

export default {
  name: 'FuncionarioList',
  components: { PromptDialog },
  data() {
    return {
      headers: [
        { text: 'Nome', value: 'nome' },
        { text: 'Idade', value: 'idade' },
        { text: 'CPF', value: 'cpf' },
        { text: 'Telefone', value: 'telefone' },
        { text: 'Email', value: 'email' },
        { text: 'Ações', value: 'action', sortable: false }
      ],
      items: [],
      totalItems: 0,
      options: {},
      errors: {}
    }
  },
  watch: {
    options: {
      handler() {
        this.getFuncionarios()
      },
      deep: true
    }
  },
  mounted() {
    this.getFuncionarios()
  },
  methods: {
    async getFuncionarios() {
      try {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        const query = {
          page: page,
          page_size: itemsPerPage,
          ordering: `${sortDesc && sortDesc[0] ? '-' : ''}${sortBy}`
        }
        const response = await this.$api.list({
          resource: endpoints.FUNCIONARIOS,
          query
        })
        this.items = response.data.results
        this.totalItems = response.data.count
      } catch (err) {
        console.error('Erro ao buscar funcionários:', err)
      }
    },
    editarFuncionario(item) {
      this.$router.push(`/funcionarios/${item.id}`)
    },
    async deletarFuncionario(id) {
      try {
        // Usando o PromptDialog para confirmar a exclusão
        const resposta = await this.$refs.prompt.open(
          'Excluir Funcionário',
          'Deseja realmente excluir este funcionário?',
          'Digite SIM para confirmar'
        )

        // Se o usuário confirmar, exclui o funcionário
        if (resposta && resposta.toUpperCase() === 'SIM') {
          await this.$api.destroy({
            resource: endpoints.FUNCIONARIOS,
            id
          })
          this.getFuncionarios()  // Atualiza a lista após a exclusão
        }
      } catch (err) {
        this.$toast.open({
          message: err.response?.data?.detail || 'Erro ao excluir',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
