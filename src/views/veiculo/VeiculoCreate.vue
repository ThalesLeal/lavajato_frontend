<template>
  <v-container fluid>
    <s-pagebar
      page-title="Incluir veículo"
      :breadcrumbs="breadcrumbs"
    />
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
              class="required"
              :error-messages="errors.placa"
              @input="consultarVeiculo"
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
              class="required"
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
              class="required"
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
              class="required"
              readonly
              :error-messages="errors.proprietario"
              :loading="carregando"
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
              class="required"
              :error-messages="errors.chassi"
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
              class="required"
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
              class="required"
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
              class="required"
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
              class="required"
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
              class="required"
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
              class="required"
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
              class="required"
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
              class="required"
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
              class="required"
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
              class="required"
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
              class="required"
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
              class="required"
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
              class="required"
              readonly
              :error-messages="errors.restricoes"
              :loading="carregando"
            />
          </v-col>
          <v-col
            v-if="categoria!='taxi'"
            cols="12"
            sm="12"
            md="4"
          >
            <v-text-field
              v-model="veiculo.capacidade"
              label="Capacidade"
              class="required"
              readonly
              :error-messages="errors.capacidade"
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
              class="required"
              :error-messages="errors.taximetro"
            />
          </v-col>
          <v-col
            v-if="categoria!='taxi' && veiculo.desc_carroceria!='BUGGY' && veiculo.buggy!=true"
            cols="12"
            sm="12"
            md="4"
          >
            <v-text-field
              v-model="veiculo.tacografo"
              label="Tacógrafo"
              class="required"
              :error-messages="errors.tacografo"
            />
          </v-col>
          <v-col
            v-if="categoria =='turismo'"
            cols="12"
            sm="12"
          >
            <v-switch
              v-model="veiculo.buggy"
              label="Veiculo BUGGY"
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
      <prompt-dialog ref="prompt" />
    </v-card>
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
        'text': 'Incluir veículo',
        'disabled': true
      }
    ],
    categoria: null,
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
      capacidade: '',
      buggy:'',
    },
    errors: {}
  }),
  created() {
    this.veiculo.permissao = this.$route.query.permissao
    this.getPermissao()
  },
  methods: {
    async getPermissao() {
      const response = await this.$api.get({
        resource: this.$endpoints.PERMISSAO,
        id: this.veiculo.permissao
      })
      this.categoria = response.data.categoria
    },
    async salvar() {
      
      if (this.veiculo.desc_carroceria.length >= 20) {
        this.veiculo.desc_carroceria = this.veiculo.desc_carroceria.substring(0, 20);
      }

      const response = this.$api.create({
        resource: this.$endpoints.VEICULO,
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
    },
    consultarVeiculo(placa) {
      if (placa && placa.length == 7) {
        this.carregando = true;
        SemobService.buscarVeiculo({ placa: placa })
          .then(response => {
            Object.assign(this.veiculo, response.data);
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

<style>
.required label::after {
    content: "*";
    color: red;
}
</style>