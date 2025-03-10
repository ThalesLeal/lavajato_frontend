<template>
  <v-container fluid>
    <s-pagebar
      page-title="Editar Ponto"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-text-field
              v-model="ponto.numero"
              label="Número"
              :error-messages="errors.numero"
            />
          </v-col>
          <v-col
            cols="12"
            md="10"
            sm="12"
          >
            <v-text-field
              v-model="ponto.endereco"
              label="Endereço"
              :error-messages="errors.endereco"
            />
          </v-col>
          <v-col
            cols="12"
            md="5"
            sm="12"
          >
            <v-text-field
              v-model="ponto.bairro"
              label="Bairro"
              :error-messages="errors.bairro"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-text-field
              v-model="ponto.capacidade"
              label="Capacidade"
              :error-messages="errors.capacidade"
            />
          </v-col>
          <v-col
            cols="12"
            md="5"
            sm="12"
          >
            <v-autocomplete
              v-model="ponto.tipo"
              label="Tipo"
              :items="[
                {text: 'Privativo', value: 'privativo'},                
                {text: 'Livre', value: 'livre'}
              ]"
              :error-messages="errors.tipo"
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
  name: 'PontoEdit',
  components: { SPagebar },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Pontos',
        'to': '/ponto',
        'exact': true
      },
      {
        'text': 'Editar',
        'disabled': true
      }
    ],
    ponto: {},
    errors: {}
  }),
  created(){
    this.getPonto(this.$route.params.id)
  },
  methods: {
    async getPonto(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.PONTO,
        id: id
      })
      this.ponto = response.data
    },
    salvar() {
      const response = this.$api.create({
        resource: this.$endpoints.PONTO,
        data: this.ponto
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