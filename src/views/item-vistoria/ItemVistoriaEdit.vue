<template>
  <v-container fluid>
    <s-pagebar
      page-title="Editar Item Vistoria"
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
  name: 'ItemVistoriaEdit',
  components: { SPagebar },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Item Vistoria',
        'to': '/item-vistoria',
        'exact': true
      },
      {
        'text': 'Editar',
        'disabled': true
      }
    ],
    itemVistoria: {},
    errors: {}
  }),
  created(){
    this.getItemVistoria(this.$route.params.id)
  },
  methods: {
    async getItemVistoria(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.VISTORIA_ITEM,
        id: id
      })
      this.itemVistoria = response.data
    },
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