<template>
  <v-container fluid>
    <s-pagebar
      page-title="Configurações"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :options.sync="options"
          :server-items-length="totalItems"
          :items-per-page="10"
          :footer-props="{
            'items-per-page-options': [10, 20, 30]
          }"
        >
          <template #[`item.action`]="{ item }">
            <v-toolbar-items>
              <v-btn
                icon
                @click="editarConfiguracao(item.id)"
              >
                <v-icon class="material-icons-outlined">
                  visibility
                </v-icon>
              </v-btn>
            </v-toolbar-items>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import SPagebar from '@/layout/SPagebar.vue'
export default {
  name: 'ConfiguracaoList',
  components: { SPagebar },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Configurações',
        'to': '/configuracao',
        'exact': true
      }
    ],
    headers: [
      {text: 'Descrição', value: 'descricao'},
      {text: 'Valor', value: 'valor'},
      {text: 'Ações', value: 'action'},
    ],
    totalItems: 0,
    items: [],
    options: {}
  }),
  watch: {
    options: {
      handler() {
        this.getConfiguracoes()
      },
      deep: true
    },
  },
  methods: {
    async getConfiguracoes() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      const query = {
        page: page,
        page_size: itemsPerPage,
        ordering: `${sortDesc && sortDesc[0] ? '-':''}${sortBy}`,
      }
      const response = await this.$api.list({
        resource: this.$endpoints.CONFIGURACAO,
        query: query
      })
      this.items = response.data.results
      this.totalItems = response.data.count
    },
    editarConfiguracao(id) {
      this.$router.push(`/configuracao/${id}`)
    }
  }
}
</script>