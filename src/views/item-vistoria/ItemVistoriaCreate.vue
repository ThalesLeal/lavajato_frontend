<template>
  <v-container fluid>
    <s-pagebar
      page-title="Cadastrar Item Vistoria"
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
              v-model="itemVistoria.descricao"
              label="Descrição"
              :error-messages="errors.descricao"
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
  name: 'ItemVistoriaCreate',
  components: { SPagebar },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Item Vistoria',
        'to': '/item-vistoria',
        'exact': true
      },
      {
        'text': 'Cadastrar',
        'disabled': true
      }
    ],
    itemVistoria: {},
    errors: {}
  }),
  methods: {
    salvar() {
      const response = this.$api.create({
        resource: this.$endpoints.VISTORIA_ITEM,
        data: this.itemVistoria
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