<template>
  <v-container fluid>
    <s-pagebar
      page-title="Emitir Relatório"
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
              v-model="relatorio.categoria"
              row
              :error-messages="errors.categoria"
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
            <v-autocomplete
              v-model="relatorio.tipo_relatorio"
              :items="tiposRelatorioFiltrados"
              label="Tipo de Relatório"
              :error-messages="errors.tipo_relatorio"
            />
          </v-col>
          <v-col
            v-if="relatorio.categoria === 'taxi' && relatorio.tipo_relatorio === 'permissionario'"
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="relatorio.ponto_numero"
              label="Ponto"
              :error-messages="errors.ponto"
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
          :loading="loading"
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
  name: 'DocumentoList',
  components: { SPagebar },
  data() {
    return {
      breadcrumbs: [
        {
          text: 'Relatórios',
          to: '/relatorio',
          exact: true
        }
      ],
      relatorio: {
        tipo_relatorio: '',
        categoria: '',
        ponto_numero: ''
      },
      errors: {},
      tiposRelatorio: [
        { text: 'Auxiliar', value: 'auxiliar', categorias: ['turismo', 'escolar', 'taxi'] },
        { text: 'Acompanhante', value: 'acompanhante', categorias: ['escolar'] },
        { text: 'Condutor', value: 'condutor', categorias: ['fretamento'] },
        { text: 'Cooperado', value: 'cooperado', categorias: ['turismo'] },
        { text: 'Arrendador', value: 'arrendador', categorias: ['turismo', 'fretamento'] },
        { text: "Idade Média", value: "idade" },
        { text: "Infrações", value: "infracoes" },
        { text: "Permissionários", value: "permissionario" },
        { text: "Pontos", value: "pontos", categorias: ['taxi'] },
      ],
      loading: false,
    };
  },
  computed: {
    tiposRelatorioFiltrados() {
      if (!this.relatorio.categoria) return [];

      return this.tiposRelatorio.filter(tipo => {
        return !tipo.categorias || tipo.categorias.includes(this.relatorio.categoria);
      });
    }
  },
  methods: {
    salvar() {
      this.loading = true
      let request = documentoService.carregarArquivo({
        resource: this.$endpoints.RELATORIO,
        data: this.relatorio
      })
      request
        .then(response => {
          this.loading = false
          const downloadUrl = window.URL.createObjectURL(response.data)
          window.open(downloadUrl, '__blank')
        })
        .catch((error) => {
          this.handleBlobError(error)
          this.loading = false
        });
    },
  }
}
</script>
