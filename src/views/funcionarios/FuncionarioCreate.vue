<template>
  <v-container fluid>
    <s-pagebar
      page-title="Cadastrar Funcionário"
      :breadcrumbs="breadcrumbs"
    />

    <v-card flat>
      <v-card-text>
        <v-row dense>
          <!-- Campo para o nome do funcionário -->
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="funcionario.nome"
              label="Nome do Funcionário"
              class="required"
              :error-messages="errors.nome"
            />
          </v-col>

          <!-- Campo para a idade -->
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="funcionario.idade"
              label="Idade"
              class="required"
              :error-messages="errors.idade"
              type="number"
            />
          </v-col>

          <!-- Campo para o CPF -->
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="funcionario.cpf"
              label="CPF"
              class="required"
              :error-messages="errors.cpf"
            />
          </v-col>

          <!-- Campo para o telefone -->
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="funcionario.telefone"
              label="Telefone"
              class="required"
              :error-messages="errors.telefone"
            />
          </v-col>

          <!-- Campo para o email -->
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="funcionario.email"
              label="Email"
              class="required"
              :error-messages="errors.email"
              type="email"
            />
          </v-col>

          <!-- Campo para a foto do funcionário -->
          <v-col
            cols="12"
            sm="6"
          >
            <v-file-input
              v-model="funcionario.foto"
              label="Foto do Funcionário"
              accept="image/*"
              show-size
              outlined
              prepend-icon="mdi-camera"
              :error-messages="errors.foto"
              class="upload-file-box"
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
import PromptDialog from '@/components/PromptDialog.vue'
import endpoints from '@/common/endpoints'

export default {
  name: 'FuncionarioCreate',
  components: { SPagebar, PromptDialog },
  data() {
    return {
      carregando: false,
      breadcrumbs: [
        { text: 'Funcionários', to: '/funcionarios', exact: true },
        { text: 'Cadastrar', disabled: true },
        { text: 'Cadastrar Funcionário', disabled: true }
      ],
      funcionario: {
        nome: '',
        idade: '',
        cpf: '',
        telefone: '',
        email: '',
        foto: null, // Campo para a foto
      },
      errors: {}
    }
  },
  methods: {
    async salvar() {
      let payload = { ...this.funcionario }

      try {
        // Se houver uma foto, o arquivo pode ser processado aqui
        if (this.funcionario.foto) {
          const formData = new FormData();
          formData.append('foto', this.funcionario.foto);

          // Adiciona outros campos
          formData.append('nome', this.funcionario.nome);
          formData.append('idade', this.funcionario.idade);
          formData.append('cpf', this.funcionario.cpf);
          formData.append('telefone', this.funcionario.telefone);
          formData.append('email', this.funcionario.email);

          await this.$api.create({
            resource: endpoints.FUNCIONARIOS,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          // Caso não tenha foto
          await this.$api.create({
            resource: endpoints.FUNCIONARIOS,
            data: payload,
          });
        }

        this.$toast.open({ message: 'Funcionário cadastrado com sucesso', type: 'success' })
        this.$router.back()
      } catch (error) {
        this.errors = this.handleError(error)
      }
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

<style scoped>
.required label::after {
  content: "*";
  color: red;
}

/* Personalização do campo de upload de arquivo (foto) */
.upload-file-box .v-input__control {
  border-radius: 8px;
  border: 2px dashed #ccc;
  padding: 20px;
  background-color: #f9f9f9;
  color: #333;
  text-align: center;
}

.upload-file-box .v-file-input__icon {
  color: #4CAF50; /* Cor do ícone de upload */
}

.upload-file-box:hover .v-input__control {
  border-color: #3f51b5; /* Cor ao passar o mouse */
}

.upload-file-box .v-file-input__message {
  font-size: 14px;
  color: #888;
}

.upload-file-box input[type="file"] {
  display: none;
}

.upload-file-box .v-file-input__icon {
  cursor: pointer;
}
</style>
