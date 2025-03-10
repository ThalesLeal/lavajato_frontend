<template>
  <v-card flat>
    <v-card-text>
      <div class="d-flex align-center">
        <div style="max-width: 500px">
          <v-text-field
            v-model="filtro.placa"
            label="Placa"
            :items="placa"
            class="mr-3"
            @input="transformToUppercase"
            @keyup.enter="getOficios"
          />
        </div>
        <v-btn
          color="blue-grey darken-4 mr-3"
          dark
          @click="getOficios"
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
        <template #[`item.action`]="{ item }">
          <v-toolbar-items>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  icon
                  :disabled="permissao.bloqueado"
                  v-on="on"
                  @click="imprimirOficio(item.id)"
                >
                  <v-icon class="material-icons-outlined">
                    print
                  </v-icon>
                </v-btn>
              </template>
              <span>Imprimir Ofício</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  icon
                  :disabled="disabledButtons"
                  v-on="on"
                  @click="cancelarOficios(item.id)"
                >
                  <v-icon class="material-icons-outlined">
                    cancel_presentation
                  </v-icon>
                </v-btn>
              </template>
              <span>Cancelar Ofício</span>
            </v-tooltip>
          </v-toolbar-items>
        </template>
        <template #[`item.situacao`]="{ item }">
          <v-icon
            v-if="item.situacao"
            color="green"
          >
            check_circle
          </v-icon>
          <v-icon
            v-else
            color="red"
          >
            cancel
          </v-icon>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import * as documentoService from '@/services/documento.service'

export default {
  name: 'OficioList',
  props: {
    permissao: Object,
    disabledButtons: Boolean
  },
  data: () => ({
    headers: [
      {text: 'Número', value: 'numero'},
      {text: 'Data de Envio', value: 'data'},
      {text: 'Data de Validade', value: 'validade'},
      {text: 'Placa', value: 'placa'},
      {text: 'Exercício', value: 'exercicio'},
      {text: 'Usuário', value: 'usuario'},
      {text: 'Situação', value: 'situacao'},
      {text: 'Ações', value: 'action'},
    ],
    placa:{},
    filtro: {
      placa: null,
    },
    items: [],
    totalItems: 0,
    options: {},
    errors: [],
    filtroAnterior: {
      placa: null,
    },
  }),
  watch: {
    options: {
      handler() {
        this.getOficios()
      },
      deep: true
    },
  },
  methods: {
    async getOficios() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      
      let resetPage = false;
      let ordering = sortBy[0];
      if (sortDesc[0]) {
        ordering = `-${ordering}`;
      }

      if (
        this.filtro.placa !== this.filtroAnterior.placa
      ) {
        resetPage = true;
        this.options.page = 1;
        this.filtroAnterior = { ...this.filtro };
      }
      
      ordering = `${sortDesc && sortDesc[0] ? '-' : ''}${sortBy}`;
      
      const query = {
        permissao: this.permissao.id,
        page: resetPage ? 1 : page,
        page_size: itemsPerPage,
        ordering: ordering,
        placa: this.filtro.placa,
      }
      
      const response = await this.$api.list({
          resource: this.$endpoints.OFICIO,
          query: query
      })
      this.items = response.data.results
      this.totalItems = response.data.count
    },
    imprimirOficio(oficioId) {
      let request = documentoService.carregarArquivo({
        resource: `${this.$endpoints.OFICIO}/segunda_via/`,
        data: {
          id_oficio: oficioId
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
    cancelarOficios(oficioId) {
      if (confirm('Tem certeza que deseja cancelar este ofício?')) {
        const response = this.$api.create({
          resource: this.$endpoints.CANCELAR_OFICIOS,
          data: {
            id_oficio: oficioId
          }
        });
        response
          .then(() => {
            this.$toast.open({
              message: 'Ofícios cancelados com sucesso',
              type: 'success',
            });
          })
          .catch(error => {
            this.errors = this.handleError(error);
          });
      } else {
        return; // Retorna sem fazer nada se o usuário não confirmar
      }
    },
    limparFiltros() {
      this.filtro = {
        placa: null,
      }
      this.getOficios()
    },
    transformToUppercase() {
      this.filtro.placa = this.filtro.placa.toUpperCase();
    },
  }
}
</script>