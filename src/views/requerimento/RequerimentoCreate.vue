<template>
  <v-container fluid>
    <s-pagebar
      page-title="Cadastrar Requerimento"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            md="5"
            sm="12"
          >
            <v-text-field
              v-model="requerimento.numero"
              label="Número"
              class="required"
              :error-messages="errors.numero"
            />
          </v-col>
          <v-col
            cols="12"
            md="5"
            sm="12"
          >
            <v-text-field
              v-model="requerimento.placa"
              label="Placa"
              class="required"
              :error-messages="errors.numero"
            />
          </v-col>
          <!-- <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-autocomplete
              v-model="permissao.categoria"
              :items="categorias"
              item-text="text"
              item-value="value"
              label="Categorias"
              :error-messages="errors.categoria"
              readonly
              @change="getDescricoes"
            />
          </v-col> -->
          <v-col
            cols="12"
            md="5"
            sm="12"
          >
            <v-autocomplete
              v-model="requerimento.descricao"
              :items="descricoes"
              item-text="descricao"
              item-value="id"
              label="Descrição"
              :error-messages="errors.descricao"
              multiple
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-file-input
              label="Documento"
              :error-messages="errors.documento"
              @change="handleFile"
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
  name: 'RequerimentoCreate',
  components: { SPagebar },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Requerimentos',
        'to': '/requerimentos',
        'exact': true
      },
      {
        'text': 'Cadastrar',
        'disabled': true
      }
    ],
    requerimento: {},
    errors: {},
    permissao: {},
    descricoes: [],
    status: [
      {text: 'Em andamento', value: 'em_andamento'},
      {text: 'Cancelado', value: 'cancelado'},
      {text: 'Finalizado', value: 'finalizado'},
    ],
    categorias: [
      {text: 'Táxi', value: 'taxi'},
      {text: 'Escolar', value: 'escolar'},
      {text: 'Turismo', value: 'turismo'},
      {text: 'Fretamento', value: 'fretamento'},
    ],
  }),
  created(){
    this.getPermissao(this.$route.query.permissao)
  },
  methods: {
    async getPermissao(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.PERMISSAO,
        id: id
      })
      this.permissao = response.data
      this.getDescricoes()
    },
    async getDescricoes() {
      const response = await this.$api.list({
        resource: this.$endpoints.PROCESSO_DESCRICAO,
        query: {
          page_size: 10000,
          categoria: this.permissao.categoria
        }
      })
      this.descricoes = response.data.results
    },
    salvar() {
      this.requerimento.placa = this.requerimento.placa.toUpperCase();
      let descricaoIDs = this.requerimento.descricao.join(',');
      
      let formData = new FormData()
      formData.append('permissao', this.permissao.id)
      formData.append('numero', this.requerimento.numero)
      formData.append('placa', this.requerimento.placa)
      formData.append('categoria', this.permissao.categoria)
      formData.append('descricao', descricaoIDs);
      formData.append('documento', this.requerimento.documento)
      const response = this.$api.create({
        resource: this.$endpoints.PROCESSO,
        data: formData
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
    handleFile(val) {
      this.requerimento.documento = val
    }
  }
}
</script>