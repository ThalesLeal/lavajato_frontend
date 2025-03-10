<template>
  <v-container fluid>
    <s-pagebar
      page-title="Editar Taxa"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="taxa.descricao"
              label="Descrição"
              :error-messages="errors.descricao"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-autocomplete
              v-model="taxa.categoria"
              label="Categoria"
              :items="categorias"
              :error-messages="errors.categoria"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="taxa.valor_percentual"
              label="Valor Percentual"
              :error-messages="errors.valor_percentual"
              suffix="%"
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
        'text': 'Taxas',
        'to': '/taxa',
        'exact': true
      },
      {
        'text': 'Editar',
        'disabled': true
      }
    ],
    categorias: [
      {text: 'Táxi', value: 'taxi'},
      {text: 'Escolar', value: 'escolar'},
      {text: 'Turismo', value: 'turismo'},
      {text: 'Fretamento', value: 'fretamento'},
    ],
    taxa: {},
    errors: {}
  }),
  created(){
    this.getTaxa(this.$route.params.id)
  },
  methods: {
    async getTaxa(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.TAXA,
        id: id
      })
      this.taxa = response.data
    },
    salvar() {
      const response = this.$api.update({
        resource: this.$endpoints.TAXA,
        id: this.taxa.id,
        data: this.taxa
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