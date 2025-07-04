<template>
  <div>
    <prompt-dialog ref="prompt" />
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
                @click="editarAgendamento(item)"
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
                @click="deletarAgendamento(item.id)"
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
    <!-- O botão "Nova Lavagem" foi removido -->
    <prompt-dialog ref="prompt" />
  </div>
</template>

<script>
import PromptDialog from '@/components/PromptDialog.vue'
import endpoints from '@/common/endpoints'

export default {
  name: 'AgendamentoList',
  components: { PromptDialog },
  props: { disabledButtons: Boolean },
  data() {
    return {
      headers: [
        { text: 'Data', value: 'data' },
        { text: 'Hora Início', value: 'hora_inicio' },
        { text: 'Hora Fim', value: 'hora_fim' },
        { text: 'Veículo', value: 'veiculo' },
        { text: 'Tipo Lavagem', value: 'tipo_lavagem' },
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
        this.getAgendamentos()
      },
      deep: true
    }
  },
  mounted() {
    this.getAgendamentos()
  },
  methods: {
    async getAgendamentos() {
      try {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        const query = {
          page: page,
          page_size: itemsPerPage,
          ordering: `${sortDesc && sortDesc[0] ? '-' : ''}${sortBy}`
        }
        const response = await this.$api.list({
          resource: endpoints.AGENDAMENTOS,
          query
        })
        this.items = response.data.results
        this.totalItems = response.data.count
      } catch (err) {
        console.error('Erro ao buscar agendamentos:', err)
      }
    },
    editarAgendamento(item) {
      this.$router.push(`/lavagens/${item.id}`)
    },
    async deletarAgendamento(id) {
      const resposta = await this.$refs.prompt.open(
        'Excluir Agendamento',
        'Deseja realmente excluir este agendamento?',
        'Digite SIM para confirmar'
      )
      if (resposta && resposta.toUpperCase() === 'SIM') {
        try {
          await this.$api.destroy({
            resource: endpoints.AGENDAMENTOS,
            id
          })
          this.getAgendamentos()
        } catch (err) {
          this.$toast.open({
            message: err.response?.data?.detail || 'Erro ao excluir',
            type: 'error'
          })
        }
      }
    }
  }
}
</script>

<style scoped>
/* Estilos específicos, se necessário */
</style>