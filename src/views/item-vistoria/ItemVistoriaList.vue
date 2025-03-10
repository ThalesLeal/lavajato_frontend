<template>
  <v-container fluid>
    <s-pagebar
      page-title="Item Vistoria"
      :breadcrumbs="breadcrumbs"
    >
      <v-btn
        color="blue-grey darken-4"
        dark
        fab
        small
        @click="cadastrarPonto"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </s-pagebar>
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
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    v-on="on"
                    @click="editarPonto(item.id)"         
                  >
                    <v-icon class="material-icons-outlined">
                      visibility
                    </v-icon>
                  </v-btn>
                </template>
                <span>Editar</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    v-on="on"
                    @click="excluirPonto(item.id)"         
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
      </v-card-text>
    </v-card>
    <ConfirmDialog ref="confirm" />
  </v-container>
</template>

<script>
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import SPagebar from '@/layout/SPagebar.vue'
export default {
  name: 'ItemVistoriaList',
  components: { SPagebar, ConfirmDialog },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Item Vistoria',
        'to': '/item-vistoria',
        'exact': true
      }
    ],
    headers: [
      {text: 'Descrição', value: 'descricao'},
      {text: 'Ações', value: 'action'},
    ],
    totalItems: 0,
    items: [],
    options: {}
  }),
  watch: {
    options: {
      handler() {
        this.getItemVistoria()
      },
      deep: true
    },
  },
  methods: {
    async getItemVistoria() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      const query = {
        page: page,
        page_size: itemsPerPage,
        ordering: `${sortDesc && sortDesc[0] ? '-':''}${sortBy}`,
      }
      const response = await this.$api.list({
        resource: this.$endpoints.VISTORIA_ITEM,
        query: query
      })
      this.items = response.data.results
      this.totalItems = response.data.count
    },
    cadastrarPonto() {
      this.$router.push('/item-vistoria/cadastrar')
    },
    editarPonto(id) {
      this.$router.push(`/item-vistoria/${id}`)
    },
    async excluirPonto(id) {
        const res = await this.$refs.confirm.open(
          'Confirmar exclusão',
          'Tem certeza que deseja excluir este registro ?'
        )
        if (res) {
          const response = this.$api.destroy({
            resource: this.$endpoints.VISTORIA_ITEM,
            id: id
          })
          response.then(()=>this.getItemVistoria())
        }
    },
  }
}
</script>