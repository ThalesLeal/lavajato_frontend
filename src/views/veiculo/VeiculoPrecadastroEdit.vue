<template>
  <v-container fluid>
    <s-pagebar
      page-title="Pré-cadastro - Editar veículo"
      :breadcrumbs="breadcrumbs"
    >
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn
            color="blue-grey darken-4"
            dark
            fab
            small
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            link
            @click="converterCadastro"
          >
            <v-list-item-title>Efetivar Cadastro</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </s-pagebar>
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="veiculo.placa"
              label="Placa"
              :error-messages="errors.placa"
              @input="consultarVeiculoPorPlaca"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="2"
          >
            <v-text-field
              v-model="veiculo.chassi"
              label="Chassi"
              :error-messages="errors.chassi"
              :loading="carregando"
              @input="consultarVeiculoPorChassi"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="veiculo.uf"
              label="UF"
              readonly
              :error-messages="errors.uf"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="4"
          >
            <v-text-field
              v-model="veiculo.municipio"
              label="Município"
              readonly
              :error-messages="errors.municipio"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="6"
          >
            <v-text-field
              v-model="veiculo.proprietario"
              label="Proprietário"
              readonly
              :error-messages="errors.proprietario"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="veiculo.remarcacao_chassi"
              label="Remarcação Chassi"
              readonly
              :error-messages="errors.remarcacao_chassi"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-text-field
              v-model="veiculo.desc_tipo"
              label="Tipo"
              readonly
              :error-messages="errors.desc_tipo"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-text-field
              v-model="veiculo.desc_especie"
              label="Espécie"
              readonly
              :error-messages="errors.desc_especie"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-text-field
              v-model="veiculo.desc_cor"
              label="Cor"
              readonly
              :error-messages="errors.desc_cor"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="9"
          >
            <v-text-field
              v-model="veiculo.desc_marca_modelo"
              label="Marca/Modelo"
              readonly
              :error-messages="errors.desc_marca_modelo"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="veiculo.ano_fabricacao"
              label="Ano Fabricação"
              readonly
              :error-messages="errors.ano_fabricacao"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="veiculo.ano_modelo"
              label="Ano Modelo"
              readonly
              :error-messages="errors.ano_modelo"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="veiculo.licenciamento"
              label="Licenciamento"
              readonly
              :error-messages="errors.licenciamento"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-text-field
              v-model="veiculo.desc_carroceria"
              label="Carroceria"
              readonly
              :error-messages="errors.desc_carroceria"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-text-field
              v-model="veiculo.desc_combustivel"
              label="Combustível"
              readonly
              :error-messages="errors.desc_combustivel"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-text-field
              v-model="veiculo.desc_categoria"
              label="Categoria"
              readonly
              :error-messages="errors.desc_categoria"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-text-field
              v-model="veiculo.status"
              label="Status"
              readonly
              :error-messages="errors.status"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-textarea
              v-model="veiculo.restricoes"
              filled
              label="Restrições"
              readonly
              :error-messages="errors.restricoes"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="4"
          >
            <v-text-field
              v-model="veiculo.capacidade"
              label="Capacidade"
              readonly
              :error-messages="errors.capacidade"
              :loading="carregando"
            />
          </v-col>
          <v-col
            v-if="categoria=='taxi'"
            cols="12"
            sm="12"
            md="4"
          >
            <v-text-field
              v-model="veiculo.taximetro"
              label="Táximetro"
              :error-messages="errors.taximetro"
            />
          </v-col>
          <v-col
            v-if="categoria!='taxi' && veiculo.desc_carroceria!='BUGGY'"
            cols="12"
            sm="12"
            md="4"
          >
            <v-text-field
              v-model="veiculo.tacografo"
              label="Tácografo"
              :error-messages="errors.tacografo"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-textarea
              v-model="veiculo.observacao"
              label="Observações"
              filled
              :error-messages="errors.observacao"
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
    <prompt-dialog ref="prompt" />
  </v-container>
</template>

<script>
import SPagebar from '@/layout/SPagebar.vue'
import * as SemobService from '@/services/semob.service'
import PromptDialog from '@/components/PromptDialog.vue'

export default {
  name: 'VeiculoCreate',
  components: { SPagebar, PromptDialog },
  data: () => ({
    carregando: false,
    breadcrumbs: [
      {
        'text': 'Permissões',
        'to': '/permissao',
        'exact': true
      },
      {
        'text': 'Detalhes',
        'disabled': true
      },
      {
        'text': 'Editar veículo',
        'disabled': true
      }
    ],
    veiculo: {
      placa: '',
      uf: '',
      proprietario: '',
      municipio: '',
      chassi: '',
      remarcacao_chassi: '',
      desc_tipo: '',
      desc_especie: '',
      desc_marca_modelo: '',
      desc_cor: '',
      ano_fabricacao: '',
      ano_modelo: '',
      desc_carroceria: '',
      desc_combustivel: '',
      desc_categoria: '',
      status: '',
      licenciamento: '',
      restricoes: '',
      capacidade:'',
    },
    errors: {}
  }),
  created() {
    this.getVeiculo(this.$route.params.id)
  },
  methods: {
    async getVeiculo(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.VEICULO,
        id: id
      })
      this.veiculo = response.data
    },
    async converterCadastro() {
      const res = await this.$refs.prompt.open(
        'Requerimento',
        'Informe o número do requerimento',
        'Número do requerimento'
      )
      if (res) {
        this.veiculo.numero_requerimento = res
        this.veiculo.pre_cadastro = false
        const response = this.$api.update({
          resource: this.$endpoints.VEICULO,
          id: this.veiculo.id,
          data: this.veiculo
        })
      response
        .then(()=>{
          this.$toast.open({
              message: 'Registro salvo com sucesso',
              type: 'success',
          })
          this.$router.back()
        })
        .catch(error=>{
          this.errors = this.handleError(error)
        })
      }
    },
    async salvar() {
      
      const res = await this.$refs.prompt.open(
        'Requerimento',
        'Informe o número do requerimento',
        'Número do requerimento'
      )
      if (res) {
        this.veiculo.numero_requerimento = res
        const response = this.$api.update({
          resource: this.$endpoints.VEICULO,
          id: this.veiculo.id,
          data: this.veiculo
        })
        response
          .then(()=>{
            this.$toast.open({
                message: 'Registro salvo com sucesso',
                type: 'success',
            })
            this.$router.back()
          })
          .catch(error=>{
            this.errors = this.handleError(error)
          })
      }
    },
    consultarVeiculoPorPlaca(placa) {
      if(placa && placa.length == 7) {
        this.carregando = true
        SemobService.buscarVeiculo({placa:placa}).then(response => {
          Object.assign(this.veiculo, response.data)
          if (Array.isArray(response.data.restricoes)) {
            this.veiculo.restricoes = response.data.restricoes.join(', ');
          }
        })
        .catch((err)=>{
          this.$toast.open({
            message: err.response.data.detail,
            type: 'error',
          })
        })
        .finally(()=>{
          this.carregando = false;
        })
      }
    },
    consultarVeiculoPorChassi(chassi) {
      if(chassi && chassi.length == 17) {
        this.carregando = true
        SemobService.buscarVeiculo({chassi:chassi}).then(response => {
          Object.assign(this.veiculo, response.data)
          if (Array.isArray(response.data.restricoes)) {
            this.veiculo.restricoes = response.data.restricoes.join(', ');
          }
        })
        .catch((err)=>{
          this.$toast.open({
            message: err.response.data.detail,
            type: 'error',
          })
        })
        .finally(()=>{
          this.carregando = false;
        })
      }
    }
  }
}
</script>