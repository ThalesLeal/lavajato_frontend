<template>
  <v-container fluid>
    <s-pagebar
      page-title="Vistorias"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <div class="d-flex align-center">
          <div style="max-width: 200px">
            <v-text-field
              v-model="filtro.placa"
              label="Placa"
              class="mr-3"
              @keyup.enter="getVistorias"
              @input="transformToUppercase"
            />
          </div>
          <div style="max-width: 500px">
            <v-autocomplete
              v-model="filtro.parecer"
              label="Parecer"
              :items="itensParecer"
              class="mr-3"
              @keyup.enter="getVistorias"
            />
          </div>
          <v-btn
            color="blue-grey darken-4 mr-3"
            dark
            @click="getVistorias"
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
          <template #[`item.parecer`]="{ item }">
            <v-chip
              :color="corParecer(item.parecer)"
              dark
            >
              {{ labelParecer(item.parecer) }}
            </v-chip>
          </template>
          <template #[`item.action`]="{ item }">
            <v-toolbar-items>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    v-on="on"
                    @click="editarVistoria(item.id)"       
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
                    @click="imprimirParecer(item.id)"       
                  >
                    <v-icon class="material-icons-outlined">
                      print
                    </v-icon>
                  </v-btn>
                </template>
                <span>Imprimir</span>
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
import * as documentoService from '@/services/documento.service'

export default {
  name: 'VistoriaList',
  components: { SPagebar, ConfirmDialog },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Vistorias',
        'to': '/vistoria',
        'exact': true
      }
    ],
    headers: [
      {text: 'Placa', value: 'veiculo.placa'},
      {text: 'Data da Vistoria', value: 'data'},
      {text: 'Parecer', value: 'parecer'},
      {text: 'Usuário', value: 'usuario.username'},
      {text: 'Ações', value: 'action'},
    ],
    totalItems: 0,
    items: [],
    options: {},
    filtro: {},
    itensParecer: [
      {text: 'Pendente', value: 'pendente'},
      {text: 'Aprovado', value: 'aprovado'},
      {text: 'Aprovado com Ressalva', value: 'aprovado_com_ressalva'},
      {text: 'Reprovado', value: 'reprovada'},
    ],
  }),
  watch: {
    options: {
      handler() {
        this.getVistorias()
      },
      deep: true
    },
  },
  methods: {
    async getVistorias() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      const query = {
        page: page,
        page_size: itemsPerPage,
        ordering: `${sortDesc && sortDesc[0] ? '-':''}${sortBy}`,
        expand: 'veiculo,usuario',
        veiculo__placa: this.filtro.placa,
        parecer: this.filtro.parecer,
      }
      const response = await this.$api.list({
        resource: this.$endpoints.VISTORIA,
        query: query
      })
      this.items = response.data.results
      this.totalItems = response.data.count
    },
    cadastrarVistoria() {
      this.$router.push('/vistoria/cadastrar')
    },
    editarVistoria(id) {
      this.$router.push(`/vistoria/${id}`)
    },
    limparFiltros() {
      this.filtro = {
        placa: null,
        parecer: null
      }
      this.getVistorias()
    },
    async imprimirParecer(vistoriaId) {
      let request = documentoService.carregarArquivo({
          resource: this.$endpoints.VISTORIA_LAUDO,
          data: {
            vistoria: vistoriaId,
            tipo_documento: 'laudo_vistoria'
          }
        })
        request
          .then(response => {
            const downloadUrl = window.URL.createObjectURL(response.data)
            window.open(downloadUrl, '__blank')
          })
          .catch((error) => {
            this.handleBlobError(error)
          });
    },
    corParecer(parecer) {
      const colors = {
        'aprovado': 'green darken-1',
        'reprovado': 'red darken-1',
        'aprovado_com_ressalva': 'orange darken-1'
      };

      return colors[parecer] || 'grey darken-1';
    },
    labelParecer(parecer) {
      const labels = {
        'aprovado': 'Aprovado',
        'reprovado': 'Reprovado',
        'aprovado_com_ressalva': 'Aprovado com ressalva'
      };

      return labels[parecer] || 'Pendente';
    },
    transformToUppercase() {
      this.filtro.placa = this.filtro.placa.toUpperCase();
    },
  }
}
</script>