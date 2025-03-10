<template>
  <v-container fluid>
    <s-pagebar
      page-title="Consultar pessoa"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            sm="12"
          >
            <v-radio-group
              v-model="pessoa.tipo"
              row
              class="required"
            >
              <v-radio
                label="Pessoa Física"
                value="fisica"
              />
              <v-radio
                label="Pessoa Jurídica"
                value="juridica"
              />
            </v-radio-group>
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.numero_documento"
              :label="pessoa.tipo=='fisica' ? 'CPF' : 'CNPJ'"
              class="required"
              :error-messages="errors.numero_documento"
              @input="consultarCondutor"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.nome"
              label="Nome"
              class="required"
              :error-messages="errors.nome"
              :loading="carregandoCondutor"
            />
          </v-col>
          <v-col
            v-if="pessoa.tipo=='fisica'"
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.data_nascimento"
              label="Data de Nascimento"
              class="required"
              :error-messages="errors.data_nascimento"
              :loading="carregandoCondutor"
            />
          </v-col>
          <v-col
            v-if="pessoa.tipo=='fisica'"
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.cnh"
              label="CNH"
              :error-messages="errors.cnh"
              :loading="carregandoCondutor"
            />
          </v-col>
          <v-col
            v-if="pessoa.tipo=='fisica'"
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.cnh_categoria"
              label="Categoria CNH"
              :error-messages="errors.cnh_categoria"
              :loading="carregandoCondutor"
            />
          </v-col>
          <v-col
            v-if="pessoa.tipo=='fisica'"
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.cnh_validade"
              label="Validade CNH"
              :error-messages="errors.cnh_validade"
              :loading="carregandoCondutor"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.cep"
              v-mask="['########']"
              label="CEP"
              class="required"
              :error-messages="errors.cep"
              @input="consultarCep"
            />
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
            >Clique se não localizar o CEP</a>
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.endereco"
              label="Endereço"
              class="required"
              :error-messages="errors.endereco"
              :readonly="disabledEndereco"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.numero"
              label="Número"
              class="required"
              :error-messages="errors.numero"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.complemento"
              label="Complemento"
              :error-messages="errors.complemento"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.bairro"
              label="Bairro"
              class="required"
              :error-messages="errors.bairro"
              :readonly="disabledEndereco"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.municipio"
              label="Município"
              class="required"
              :error-messages="errors.municipio"
              :readonly="disabledEndereco"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.uf"
              label="UF"
              class="required"
              :error-messages="errors.uf"
              :readonly="disabledEndereco"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.telefone"
              v-mask="['(##) ####-####', '(##) #####-####']"
              label="Telefone"
              class="required"
              :error-messages="errors.telefone"
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
      </v-card-actions>
      <prompt-dialog ref="prompt" />
    </v-card>
  </v-container>
</template>

<script>
import moment from 'moment'
import SPagebar from '@/layout/SPagebar.vue'
import * as SemobService from '@/services/semob.service'
import * as ViaCepService from '@/services/cep.service'
import PromptDialog from '@/components/PromptDialog.vue'

export default {
  name: 'PessoaConsulta',
  components: { SPagebar, PromptDialog },
  data: () => ({
    carregando: false,
    carregandoCondutor: false,
    breadcrumbs: [
      {
        'text': 'Consultar pessoa',
        'disabled': true
      }
    ],
    pessoa: {
      tipo: 'fisica',
      nome: '',
      cnh: '',
      cnh_categoria: '',
      cnh_validade: null,
      endereco: '',
      complemento: '',
      bairro: '',
      municipio: '',
      uf: '',
    },
    errors: {},
    categoria: '',
    disabledEndereco: true,
  }),
  methods: {
    consultarCondutor(cpf) {
      if(cpf && cpf.length == 11 && this.pessoa.tipo == 'fisica') {
        this.carregandoCondutor = true
        SemobService.buscarCondutor(cpf)
        .then(response => {
          Object.assign(this.pessoa, {
            nome: response.data.nome_condutor,
            cnh: response.data.num_registro,
            cnh_categoria: response.data.cod_categoria,
            cnh_validade: moment(response.data.data_validade, "DDMMYYYY").format('DD/MM/YYYY'),
            data_nascimento: moment(response.data.data_nascimento, "DDMMYYYY").format('DD/MM/YYYY')
          })
        })
        .catch((err)=>{
          this.$toast.open({
            message: err.response.data.detail,
            type: 'error',
          })
        })
        .finally(()=>{
          this.carregandoCondutor = false;
        })
      }
    },
    consultarCep(cep) {
      if(cep && cep.length == 8) {
        this.carregando = true
        this.disabledEndereco = true
        ViaCepService.buscarEndereco(cep).then(response => {
          Object.assign(this.pessoa, {
            endereco: response.data.logradouro,
            complemento: response.data.complemento,
            bairro: response.data.bairro,
            municipio: response.data.localidade,
            uf: response.data.uf
          })
          this.carregando = false
        })
      }
      if(cep == '58000000') {
        this.disabledEndereco = false
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