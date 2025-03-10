<template>
  <v-container fluid>
    <s-pagebar
      page-title="Pré-cadastro - Incluir veículo"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            v-permission="['core.pode_bloquear_permissao']"
            cols="12"
            sm="12"
          >
            <v-switch
              v-model="veiculo.sem_placa"
              label="Veiculo sem Placa"
            />
          </v-col>
          <v-col
            v-if="!veiculo.sem_placa"
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="veiculo.placa"
              label="Placa"
              class="required"
              :error-messages="errors.placa"
              :loading="carregando"
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
              class="required"
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
              v-mask="['XX']"
              label="UF"
              :required="!veiculo.sem_placa"
              :class="{'required': !veiculo.sem_placa}"
              :readonly="isReadonly"
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
              :required="!veiculo.sem_placa"
              :class="{'required': !veiculo.sem_placa}"
              :readonly="isReadonly"
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
              :required="!veiculo.sem_placa"
              :class="{'required': !veiculo.sem_placa}"
              :readonly="isReadonly"
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
              class="required"
              :readonly="isReadonly"
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
              :readonly="isReadonly"
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
              :readonly="isReadonly"
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
              :readonly="isReadonly"
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
              :readonly="isReadonly"
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
              :readonly="isReadonly"
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
              :readonly="isReadonly"
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
              :required="!veiculo.sem_placa"
              :class="{'required': !veiculo.sem_placa}"
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
              :readonly="isReadonly"
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
              :readonly="isReadonly"
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
              :required="!veiculo.sem_placa"
              :class="{'required': !veiculo.sem_placa}"
              :readonly="isReadonly"
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
              :readonly="isReadonly"
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
              :required="!veiculo.sem_placa"
              :class="{'required': !veiculo.sem_placa}"
              :readonly="isReadonly"
              :error-messages="errors.restricoes"
              :loading="carregando"
            />
          </v-col>
          <v-col
            v-if="veiculo.sem_placa"
            cols="12"
            sm="12"
            md="4"
          >
            <v-text-field
              v-model="veiculo.capacidade"
              label="Capacidade"
              :class="{'required':veiculo.sem_placa}"
              :readonly="isReadonly"
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
              :required="!veiculo.sem_placa"
              :class="{'required': !veiculo.sem_placa}"
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
  </v-container>
</template>

<script>
import SPagebar from '@/layout/SPagebar.vue'
import * as SemobService from '@/services/semob.service'

export default {
  name: 'VeiculoCreate',
  components: { SPagebar },
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
      capacidade:'',
      pre_cadastro: false,
    },
    errors: {}
  }),
  computed: {
    isReadonly() {
      return !this.veiculo.sem_placa;
    }
  },
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
  salvar() {
    this.formatarRestricoes();
    this.veiculo.pre_cadastro = true
    
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
  
  formatarRestricoes() {
      // Garantir que as restrições são uma string válida
      if (Array.isArray(this.veiculo.restricoes)) {
        this.veiculo.restricoes = this.veiculo.restricoes.join(', ');
      }
    },
    
  consultarVeiculoPorPlaca(placa) {
    if(placa && placa.length == 7) {
      this.carregando = true
      SemobService.buscarVeiculo({placa:placa})
      .then(response => {
        Object.assign(this.veiculo, response.data)
        if (Array.isArray(response.data.restricoes)) {
          this.veiculo.restricoes = response.data.restricoes.join(", ");
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
    this.carregando = true;
    SemobService.buscarVeiculoChassi({chassi:chassi})
    .then(response => {
      Object.assign(this.veiculo, response.data)
      if (Array.isArray(response.data.restricoes)) {
        this.veiculo.restricoes = response.data.restricoes.join(", ")
      }
    })
    .catch((err)=>{
      this.$toast.open({
        message: err.response.data.detail,
        type: 'error',
      });
    })
    .finally(()=>{
      this.carregando = false;
    });
  }
}}}
</script>

<style>
.required label::after {
    content: "*";
    color: red;
}
</style>