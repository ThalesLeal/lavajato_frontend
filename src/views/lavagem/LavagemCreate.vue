<template>
  <v-container fluid>
    <s-pagebar page-title="Agendar Lavagem" :breadcrumbs="breadcrumbs" />

    <v-card flat>
      <v-card-text>
        <v-row dense>
          <!-- Campo para a placa do veículo -->
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="lavagem.veiculo"
              label="Placa do Veículo"
              class="required"
              :error-messages="errors.veiculo"
            />
          </v-col>

          <!-- Tipo de Lavagem -->
          <v-col cols="12" sm="4">
            <v-select
              v-model="lavagem.tipo_lavagem"
              :items="tipoLavagens"
              label="Tipo de Lavagem"
              class="required"
              :error-messages="errors.tipo_lavagem"
            />
          </v-col>

          <!-- Data do agendamento -->
          <v-col cols="12" sm="4">
            <v-menu
              ref="menuData"
              v-model="menuData"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="lavagem.data"
                  label="Data"
                  class="required"
                  :error-messages="errors.data"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="lavagem.data"
                scrollable
                @input="menuData = false"
              />
            </v-menu>
          </v-col>

          <!-- Hora de Início -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="lavagem.hora_inicio"
              label="Hora Início (HH:MM)"
              class="required"
              :error-messages="errors.hora_inicio"
            />
          </v-col>

          <!-- Hora de Término -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="lavagem.hora_fim"
              label="Hora Fim (HH:MM)"
              class="required"
              :error-messages="errors.hora_fim"
            />
          </v-col>

          <!-- Observações -->
          <v-col cols="12">
            <v-textarea v-model="lavagem.observacao" label="Observações" />
          </v-col>

          <!-- Seleção de Funcionários (múltiplo) -->
          <v-col cols="12">
            <v-select
              v-model="lavagem.funcionarios"
              :items="funcionarios"
              label="Funcionários"
              multiple
              :error-messages="errors.funcionarios"
            />
          </v-col>

          <!-- Exemplo de upload (Dropzone) -->
          <v-col cols="12" sm="12">
            <div ref="imageDropzone" class="dropzone" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn outlined color="blue-grey darken-4" @click="$router.back()">Voltar</v-btn>
        <v-btn color="blue-grey darken-4" dark @click="salvar">Salvar</v-btn>
      </v-card-actions>
      <prompt-dialog ref="prompt" />
    </v-card>
  </v-container>
</template>

<script>
import moment from 'moment'
import SPagebar from '@/layout/SPagebar.vue'
import PromptDialog from '@/components/PromptDialog.vue'
import Dropzone from 'dropzone'
import endpoints from '@/common/endpoints'

export default {
  name: 'LavagemCreate',
  components: { SPagebar, PromptDialog },
  data() {
    return {
      carregando: false,
      menuData: false,
      breadcrumbs: [
        { text: 'Lavagens', to: '/lavagens', exact: true },
        { text: 'Detalhes', disabled: true },
        { text: 'Agendar Lavagem', disabled: true }
      ],
      tipoLavagens: [
        { text: 'Simples', value: 'simples' },
        { text: 'Completa', value: 'completa' },
        { text: 'Especial', value: 'especial' }
      ],
      // "lavagem.veiculo" recebe a placa digitada (ex: "OGG-12A1")
      lavagem: {
        veiculo: '',
        tipo_lavagem: '',
        data: null,
        hora_inicio: '',
        hora_fim: '',
        observacao: '',
        funcionarios: []
      },
      // Lista de funcionários, carregada via API
      funcionarios: [],
      errors: {}
    }
  },
  mounted() {
    this.initDropzone()
    this.getFuncionarios()
  },
  methods: {
    initDropzone() {
      let myDropzone = new Dropzone(this.$refs.imageDropzone, {
        url: '#',
        paramName: 'foto',
        maxFilesize: 2,
        acceptedFiles: 'image/*',
        addRemoveLinks: true,
        uploadMultiple: false,
        clickable: true,
        dictDefaultMessage: 'Arraste o arquivo ou clique aqui para fazer o upload',
        autoProcessQueue: false
      })
      myDropzone.on('addedfile', file => {
        this.lavagem.foto = file
      })
    },
    async getFuncionarios() {
      try {
        const response = await this.$api.list({
          resource: endpoints.FUNCIONARIOS
        })
        // Supondo que os funcionários venham em response.data.results
        this.funcionarios = response.data.results.map(func => ({
          text: func.nome,
          value: func.id
        }))
      } catch (error) {
        console.error('Erro ao carregar funcionários:', error)
      }
    },
    async salvar() {
      let payload = { ...this.lavagem }
      if (payload.data) {
        payload.data = moment(payload.data).format('DD/MM/YYYY')
      }
      
      console.log("Endpoint utilizado:", this.$endpoints.AGENDAMENTOS) // Deve exibir '/api/agendamentos/'
      
      this.$api.create({
        resource: this.$endpoints.AGENDAMENTOS,
        data: payload
      })
      .then(() => {
        this.$toast.open({ message: 'Agendamento salvo com sucesso', type: 'success' })
        this.$router.back()
      })
      .catch(error => {
        this.errors = this.handleError(error)
      })
    },
    handleError(error) {
      if (error.response && error.response.data) {
        return error.response.data
      }
      return { non_field_errors: ['Erro desconhecido'] }
    }
  }
}
</script>

<style>
.required label::after {
  content: "*";
  color: red;
}

.dropzone {
  border: 2px dashed #ccc;
  padding: 10px;
  background-color: #f1f1f1;
  color: #333;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease-in-out;
  width: 200px;
}
.dropzone:hover {
  border-color: #999;
}
.dropzone .dz-preview .dz-progress {
  display: none !important;
}
</style>
