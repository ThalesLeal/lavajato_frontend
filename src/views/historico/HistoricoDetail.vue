<template>
  <v-container fluid>
    <s-pagebar
      page-title="Histórico da Permissão"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-card outlined>
          <v-card-title>Pessoas</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="[
                {text: 'Nome', value: 'nome'},
                {text: 'Função', value: 'funcao'},
                {text: 'Data de Cadastro', value: 'data_cadastro'},
                {text: 'Data de Baixa', value: 'data_exclusao'},
              ]"
              :items="pessoas"
              disable-pagination
              hide-default-footer
            />
          </v-card-text>
        </v-card>

        <v-card
          outlined
          class="mt-4"
        >
          <v-card-title>Veículos</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="[
                {text: 'Placa', value: 'placa'},
                {text: 'Marca/Modelo', value: 'desc_marca_modelo'},
                {text: 'Data de Cadastro', value: 'data_cadastro'},
                {text: 'Data de Baixa', value: 'data_exclusao'},
              ]"
              :items="veiculos"
              disable-pagination
              hide-default-footer
            />
          </v-card-text>
        </v-card>
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
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import SPagebar from '@/layout/SPagebar.vue'

export default {
  name: 'HistoricoDetail',
  components: { SPagebar },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Histórico da Permissão',
        'to': '/historico',
        'exact': true
      },
    ],
    pessoas: [],
    veiculos: []
  }),
  created() {
    this.getPessoas(this.$route.params.id)
    this.getVeiculos(this.$route.params.id)
  },
  methods: {
    async getPessoas(permissaoId) {
      const response = await this.$api.list({
          resource: this.$endpoints.PESSOA,
          query: {
            page_size: 1000,
            permissao: permissaoId
          }
      })
      this.pessoas = response.data.results
    },
    async getVeiculos(permissaoId) {
      const response = await this.$api.list({
          resource: this.$endpoints.VEICULO,
          query: {
            page_size: 1000,
            permissao: permissaoId
          }
      })
      this.veiculos = response.data.results
    },
  }
}
</script>