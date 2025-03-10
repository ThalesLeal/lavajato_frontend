<template>
  <v-container fluid>
    <s-pagebar
      page-title="Listar Boletos"
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
              :loading="carregando"
              @keyup.enter="getVistoriaBoleto"
              @input="transformToUppercase('placa')"
            />
          </div>
          <div style="max-width: 200px">
            <v-text-field
              v-model="filtro.ordem"
              label="Nª Ordem"
              class="mr-3"
              :loading="carregando"
              @keyup.enter="getVistoriaBoleto"
              @input="transformToUppercase('ordem')"
            />
          </div>
          <div style="max-width: 200px">
            <v-text-field
              v-model="filtro.cpf_cnpj"
              v-mask="['XXX.XXX.XXX-XX', 'XX.XXX.XXX/XXXX-XX']"
              label="CPF/CNPJ"
              class="mr-3"
              :loading="carregando"
              @keyup.enter="getVistoriaBoleto"
            />
          </div>
          <v-btn
            color="blue-grey darken-4 mr-3"
            dark
            @click="getVistoriaBoleto"
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
                    v-on="on"
                    @click="imprimir(item)"       
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
  name: 'VistoriaListBoleto',
  components: { SPagebar, ConfirmDialog },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Listar',
        'exact': true
      }
    ],
    headers: [
      { text: 'Placa', value: 'AIT_PLACA' },
      { text: 'AIT', value: 'AIT_CODIGO' },
      { text: 'AIT valor', value: 'AIT_VALOR_TOTAL' },
      { text: 'AIT Nº Ordem', value: 'AIT_NUM_ORDEM' },
      { text: 'Ações', value: 'action' },
    ],
    carregando: false,
    totalItems: 0,
    items: [],
    options: {},
    filtro: {
      placa: '',
      ordem: ''
    },
  }),
  methods: {
    async getVistoriaBoleto() {
      this.carregando = true
      try {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        const query = {
          page: page,
          page_size: itemsPerPage,
          ordering: `${sortDesc && sortDesc[0] ? '-' : ''}${sortBy}`,
          placa: this.filtro.placa,
          ordem: this.filtro.ordem,
          cpf_cnpj: this.filtro.cpf_cnpj,
        };

        const response = await this.$api.list({
          resource: this.$endpoints.VISTORIA_BOLETO,
          query: query
        });
        
        this.items = response.data;
        this.totalItems = response.data.count;

        this.$toast.open({
          message: 'Consulta realizada com sucesso',
          type: 'success',
        });

      } catch (error) {
        this.errors = this.handleError(error);
      } finally {
        this.carregando = false;
      }
    },
    limparFiltros() {
      this.filtro = {
        placa: '',
        ordem: '',
        cpf_cnpj: '',
      }
      this.items = []
      this.totalItems = 0
    },
    async imprimir(item) {
      documentoService
        .carregarArquivo({
          resource: this.$endpoints.REGISTRAR,
          data: item
        })
        .then((response) => {
          const downloadUrl = window.URL.createObjectURL(response.data);
          window.open(downloadUrl, '__blank');
        })
        .catch(async (error) => {
          if (error.response?.data instanceof Blob) {
            const errorText = await error.response.data.text();
            try {
              const errorJson = JSON.parse(errorText);
              const errorMessage = errorJson.error;
              this.$toast.open({
                message: errorMessage,
                type: 'error',
              });
            } catch (parseError) {
              this.$toast.open({
                message: 'Erro desconhecido. Por favor, tente novamente.',
                type: 'error',
              });
            }
          } else {
            const errorMessage = error.response?.data?.error;
            this.$toast.open({
              message: errorMessage,
              type: 'error',
            });
          }
        });
    },
    transformToUppercase(field) {
      this.filtro[field] = this.filtro[field].toUpperCase();
    },
  }
}
</script>