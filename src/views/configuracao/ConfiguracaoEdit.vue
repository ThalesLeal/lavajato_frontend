<template>
  <v-container fluid>
    <s-pagebar
      page-title="Editar Configuração"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="configuracao.descricao"
              label="Descrição"
              :error-messages="errors.descricao"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="configuracao.valor"
              label="Valor"
              :error-messages="errors.valor"
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
          @click="salvar"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import SPagebar from '@/layout/SPagebar.vue'
export default {
  name: 'TaxaCreate',
  components: { SPagebar },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Configurações',
        'to': '/configuracao',
        'exact': true
      },
      {
        'text': 'Editar',
        'disabled': true
      }
    ],
    configuracao: {},
    errors: {}
  }),
  created(){
    this.getConfiguracao(this.$route.params.id)
  },
  methods: {
    async getConfiguracao(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.CONFIGURACAO,
        id: id
      })
      this.configuracao = response.data
    },
    salvar() {
      const response = this.$api.update({
        resource: this.$endpoints.CONFIGURACAO,
        id: this.configuracao.id,
        data: this.configuracao
      })
      response
        .then(()=>{
          this.$toast.open({
              message: 'Registro salvo com sucesso',
              type: 'success',
          })
          this.$router.back()
        })
        .catch(error=>this.errors = this.handleError(error))
    },
  }
}
</script>