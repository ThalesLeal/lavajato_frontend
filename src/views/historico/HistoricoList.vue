<template>
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
    <template #[`item.data`]="{ item }">
      {{ formatDateTime(item.data) }}
    </template>
  </v-data-table>
</template>

<script>


export default {
  name: 'HistoricoList',
  props: {
    permissao: Object
  },
  data: () => ({
    headers: [
      {text: 'Data', value: 'data'},
      {text: 'Descrição', value: 'descricao'},
      {text: 'Requerimento', value: 'numero_requerimento'},
      {text: 'Usuário', value: 'usuario'},
    ],
    items: [],
    totalItems: 0,
    options: {},
  }),
  watch: {
    options: {
      handler: 'getHistorico',
      deep: true,
    },
  },
  created() {
    this.getHistorico()
  },
  methods: {
    async getHistorico() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      const query = {
          permissao: this.permissao.id,
          page: page,
          page_size: itemsPerPage,
          ordering: `${sortDesc && sortDesc[0] ? "-" : ""}${sortBy}`
      }
      const response = await this.$api.list({
          resource: this.$endpoints.HISTORICO,
          query: query
      })
      this.items = response.data.results
      this.totalItems = response.data.count
    },
  }
}
</script>