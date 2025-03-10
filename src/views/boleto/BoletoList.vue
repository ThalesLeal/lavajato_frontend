<template>
  <v-card-text>
    <div class="d-flex align-center">
      <div style="max-width: 500px">
        <v-text-field
          v-model="filtro.nosso_numero"
          label="Nosso Numero"
          :items="nosso_numero"
          class="mr-3"
          @keyup.enter="getBoletos"
        />
      </div>
      <v-btn
        color="blue-grey darken-4 mr-3"
        dark
        @click="getBoletos"
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
      <template #[`item.data`]="{ item }">
        {{ formatDateTime(item.data) }}
      </template>
      <template #[`item.pago`]="{ item }">
        <v-icon
          v-if="item.data_pagamento"
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
      <template #[`item.action`]="{ item }">
        <v-toolbar-items>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                icon
                v-on="on"
                @click="reimprimirBoleto(item.nosso_numero)"         
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
</template>

<script>
import * as boletoService from '@/services/boleto.service'

export default {
  name: 'BoletoList',
  props: {
    permissao: Object
  },
  data: () => ({
    headers: [
      {text: 'Data de Registro', value: 'data_documento'},
      {text: 'Data Vencimento', value: 'data_vencimento'},
      {text: 'Data Pagamento', value: 'data_pagamento'},
      {text: 'Nosso número', value: 'nosso_numero'},
      {text: 'AIT', value: 'ait'},
      {text: 'Pago', value: 'pago'},
      {text: 'Ações', value: 'action'},
    ],
    nosso_numero:{},
    filtro: {
      nosso_numero: null,
    },
    items: [],
    totalItems: 0,
    options: {},
    filtroAnterior: {
      nosso_numero: null,
    },
  }),
  watch: {
    options: {
        handler() {
            this.getBoletos();
        },
        deep: true
    },
  },
  methods: {
    async getBoletos() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      
      let resetPage = false;
      let ordering = sortBy[0];
      if (sortDesc[0]) {
        ordering = `-${ordering}`;
      }

      if (
        this.filtro.nosso_numero !== this.filtroAnterior.nosso_numero
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
        nosso_numero: this.filtro.nosso_numero,
      }
      
      const response = await this.$api.list({
          resource: this.$endpoints.PERMISSAO_BOLETO,
          query: query
      })
      this.items = response.data.results
      this.totalItems = response.data.count
    },
    reimprimirBoleto(nossoNumero) {
      let request = boletoService.emitirSegundaVia(nossoNumero)
      request
        .then(response => {
          const downloadUrl = window.URL.createObjectURL(response.data)
          window.open(downloadUrl, '__blank')
        })
        .catch((error) => {
          this.handleBlobError(error)
        });
    },
    limparFiltros() {
      this.filtro = {
        nosso_numero: null,
      }
      this.getBoletos()
    },
  }
}
</script>