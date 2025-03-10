<template>
  <v-container fluid>
    <s-pagebar
      page-title="Taxas"
      :breadcrumbs="breadcrumbs"
    >
      <v-btn
        color="blue-grey darken-4"
        dark
        fab
        small
        @click="cadastrarTaxa"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </s-pagebar>
    <v-card flat>
      <v-card-text>
        <div class="d-flex align-center">
          <div style="max-width: 500px">
            <v-autocomplete
              v-model="filtro.categoria"
              label="Categoria"
              :items="categorias"
              class="mr-3"
            />
          </div>
          <v-btn
            color="blue-grey darken-4 mr-3"
            dark
            @click="getTaxas"
          >
            <v-icon>search</v-icon>
            Pesquisar
          </v-btn>
          <v-btn
            outlined
            color="blue-grey darken-4"
            @click="limparFiltros"
          >
            Limpar filtros
          </v-btn>
        </div>
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
          <template #[`item.categoria`]="{ item }">
            <span v-if="item.categoria=='taxi'">Táxi</span>
            <span v-if="item.categoria=='escolar'">Escolar</span>
            <span v-if="item.categoria=='turismo'">Turismo</span>
            <span v-if="item.categoria=='fretamento'">Fretamento</span>
          </template>
          <template #[`item.valor_real`]="{ item }">
            R$ {{ item.valor_real }}
          </template>
          <template #[`item.action`]="{ item }">
            <v-toolbar-items>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    v-on="on"
                    @click="editarTaxa(item.id)"         
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
                    @click="excluirTaxa(item.id)"         
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
  name: 'TaxaList',
  components: { SPagebar, ConfirmDialog },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Taxas',
        'to': '/taxa',
        'exact': true
      }
    ],
    categorias: [
      {text: 'Táxi', value: 'taxi'},
      {text: 'Escolar', value: 'escolar'},
      {text: 'Turismo', value: 'turismo'},
      {text: 'Fretamento', value: 'fretamento'},
    ],
    headers: [
      {text: 'Descrição', value: 'descricao'},
      {text: 'Categoria', value: 'categoria'},
      {text: 'Valor Percentual', value: 'valor_percentual'},
      {text: 'Valor Real', value: 'valor_real'},
      {text: 'Ações', value: 'action'},
    ],
    filtro: {
      categoria: null,
    },
    totalItems: 0,
    items: [],
    options: {}
  }),
  watch: {
    options: {
      handler() {
        this.getTaxas()
      },
      deep: true
    },
  },
  methods: {
    async getTaxas() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      const query = {
        page: page,
        page_size: itemsPerPage,
        ordering: `${sortDesc && sortDesc[0] ? '-':''}${sortBy}`,
        categoria: this.filtro.categoria,
      }
      const response = await this.$api.list({
        resource: this.$endpoints.TAXA,
        query: query
      })
      this.items = response.data.results
      this.totalItems = response.data.count
    },
    cadastrarTaxa() {
      this.$router.push('/taxa/cadastrar')
    },
    editarTaxa(id) {
      this.$router.push(`/taxa/${id}`)
    },
    async excluirTaxa(id) {
        const res = await this.$refs.confirm.open(
          'Confirmar exclusão',
          'Tem certeza que deseja excluir este registro ?'
        )
        if (res) {
          const response = this.$api.destroy({
            resource: this.$endpoints.TAXA,
            id: id
          })
          response.then(()=>this.getTaxas())
        }
    },
    limparFiltros() {
      this.filtro = {
        categoria: null
      }
      this.getTaxas()
    }
  }
}
</script>