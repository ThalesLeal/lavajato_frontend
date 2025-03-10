<template>
  <v-container fluid>
    <s-pagebar
      page-title="Emitir Boleto"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            sm="12"
          >
            <v-radio-group
              v-model="boleto.categoria"
              row
              :error-messages="errors.categoria"
              @change="buscarTaxas"
            >
              <v-radio
                label="Táxi"
                value="taxi"
              />
              <v-radio
                label="Escolar"
                value="escolar"
              />
              <v-radio
                label="Turismo"
                value="turismo"
              />
              <v-radio
                label="Fretamento"
                value="fretamento"
              />
            </v-radio-group>
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-switch
              v-model="boleto.sem_placa"
              label="Veiculo sem Placa"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-text-field
              v-if="!boleto.sem_placa"
              v-model="boleto.placa"
              v-mask="['XXXXXXX']"
              label="Placa do Veículo"
              :error-messages="errors.placa"
            />
            <v-text-field
              v-else
              v-model="boleto.chassi"
              v-mask="['XXXXXXXXXXXXXXXXXXXX']"
              label="Chassi"
              :error-messages="errors.chassi"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-data-table
              v-if="boleto.categoria"
              v-model="taxasSelecionadas"
              :headers="headers"
              :items="taxas"
              item-key="id"
              show-select
              hide-default-footer
              disable-pagination
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          outlined
          color="blue-grey darken-4"
          @click="$router.back()"
        >
          Voltar
        </v-btn>
        <v-btn
          color="blue-grey darken-4"
          dark
          :loading="carregando"
          @click="salvar"
        >
          Gerar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
  
  <script>
  import SPagebar from '@/layout/SPagebar.vue'
  import * as documentoService from '@/services/documento.service'

  export default {
    name: 'BoletoList',
    components: { SPagebar },
    data: () => ({
      breadcrumbs: [
        {
          'text': 'Boletos',
          'to': '/boleto',
          'exact': true
        },
      ],
      boleto: {},
      errors: {},
      taxas: [],
      taxasSelecionadas: [],
      headers: [
        {text: 'Descrição', value: 'descricao'},
        {text: 'Valor Percentual', value: 'valor_percentual'},
      ],
      carregando: false,
    }),
    methods: {
      salvar() {
        this.carregando = true
        this.boleto.taxas = this.taxasSelecionadas
        let request = documentoService.carregarArquivo({
          resource: this.$endpoints.REGISTRAR,
          data: this.boleto
        })
        request.then(response => {
            const downloadUrl = window.URL.createObjectURL(response.data)
            window.open(downloadUrl, '__blank')
            this.carregando = false
        })
      },
      async buscarTaxas() {
        this.taxasSelecionadas = []
        const response = await this.$api.list({
          resource: this.$endpoints.TAXA,
          query: {
            categoria: this.boleto.categoria,
            page_size: 10000,
          }
        })
        this.taxas = response.data.results
      }
    }
  }
  </script>