<template>
  <v-container fluid>
    <s-pagebar
      page-title="Editar pessoa"
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
            <v-autocomplete
              v-model="pessoa.funcao"
              :items="funcoes"
              label="Função"
              :error-messages="errors.funcao"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.numero_documento"
              :label="pessoa.tipo=='fisica' ? 'CPF' : 'CNPJ'"
              :error-messages="errors.numero_documento"
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
              :error-messages="errors.nome"
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
              :error-messages="errors.data_nascimento"
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
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.cep"
              v-mask="['########']"
              label="CEP"
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
              :error-messages="errors.endereco"
              :readonly="disabledEndereco"
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
              :error-messages="errors.bairro"
              :readonly="disabledEndereco"
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
              :error-messages="errors.municipio"
              :readonly="disabledEndereco"
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
              :error-messages="errors.uf"
              :readonly="disabledEndereco"
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
              :error-messages="errors.telefone"
            />
          </v-col>
          <v-col
            v-if="categoria=='turismo'"
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.inscricao_municipal"
              label="Inscrição Municipal"
              :error-messages="errors.inscricao_municipal"
            />
          </v-col>
          <v-col
            v-if="categoria=='turismo'"
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.registro_ministerio_turismo"
              label="Registro Ministério de Turismo"
              :error-messages="errors.registro_ministerio_turismo"
            />
          </v-col>
          <v-col
            v-if="pessoa.funcao=='permissionario' && categoria=='taxi'"
            cols="12"
            sm="12"
          >
            <v-autocomplete
              v-model="pessoa.ponto"
              :items="pontos"
              label="Ponto"
              item-text="endereco"
              item-value="id"
              :error-messages="errors.ponto"
            >
              <template #item="{ item }">
                {{ item.numero }} - {{ item.endereco }}
              </template>
              <template #selection="{ item }">
                {{ item.numero }} - {{ item.endereco }}
              </template>
            </v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <div>
              <span v-if="pessoa.foto">
                <img
                  class="dropzone"
                  :src="mostrarFoto()"
                  alt="Fotos"
                ><br>
                <button
                  class="trocar-btn"
                  @click="openDropzoneOrUpload"
                >ATUALIZAR FOTO</button>
              </span>
              <span v-else>
                <div
                  ref="imageDropzone"
                  class="dropzone"
                />
              </span>
            </div>
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
import * as ViaCepService from '@/services/cep.service'
import PromptDialog from '@/components/PromptDialog.vue'
import Dropzone from 'dropzone'

export default {
  name: 'PessoaCreate',
  components: { SPagebar, PromptDialog },
  data: () => ({
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
        'text': 'Editar pessoa',
        'disabled': true
      }
    ],
    funcoes: [
      {text: 'Permissionário', value: 'permissionario'},
      {text: 'Auxiliar', value: 'auxiliar'},
      {text: 'Acompanhante', value: 'acompanhante'},
      {text: 'Cooperado', value: 'cooperado'},
      {text: 'Condutor', value: 'condutor'},
      {text: 'Arrendador', value: 'arrendador'},
    ],
    pessoa: {
      id: '',
      foto: '',
    },
    errors: {},
    pontos: [],
    categoria: '',
    disabledEndereco: true,
  }),
  mounted() {
    this.initDropzone()
    this.getPessoa(this.$route.params.id)
    this.getPontos()
  },
  methods: {
    mostrarFoto() {
      return this.pessoa.foto ? this.pessoa.foto : '';
    },
    initDropzone() {
      this.myDropzone = new Dropzone(this.$refs.imageDropzone, {
        url: "#",
        paramName: 'foto',
        maxFilesize: 2,
        acceptedFiles: 'image/*',
        addRemoveLinks: true,
        uploadMultiple: false,
        clickable: true,
        dictDefaultMessage: 'Arraste o arquivo ou clique aqui para fazer o upload',
        autoProcessQueue: false,
      });

      this.myDropzone.on("addedfile", file => {
        this.pessoa.foto = URL.createObjectURL(file);
      });
    },
    openDropzoneOrUpload() {
      this.myDropzone.hiddenFileInput.click();
    },
    async getPessoa(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.PESSOA,
        id: id
      })
      this.pessoa = response.data
      this.getPermissao(this.pessoa.permissao)
    },
    async getPontos() {
      const response = await this.$api.list({
        resource: this.$endpoints.PONTO
      })
      this.pontos = response.data.results
    },
    async getPermissao(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.PERMISSAO,
        id: id
      })
      this.categoria = response.data.categoria
    },
    async salvar() {
      this.errors = {};
      const res = await this.$refs.prompt.open(
        'Requerimento',
        'Informe o número do requerimento',
        'Número do requerimento'
      )
      if (res) {
        this.pessoa.numero_requerimento = res;

        if (this.pessoa.tipo === 'juridica') {
          delete this.pessoa.cnh_validade;
          delete this.pessoa.data_nascimento;
        }
        if (this.categoria!='taxi'){
          this.pessoa.ponto = ''
        }
        
        let formData = this.getFormData(this.pessoa);  

        if (this.pessoa.foto && this.myDropzone.files.length > 0) {
          const file = this.myDropzone.files[0];
          if (file.type.startsWith('image/')) {
            formData.append('foto', file);
          }
        }else{
          formData.delete('foto');
        }

        const response = this.$api.update({
          resource: this.$endpoints.PESSOA,
          id: this.pessoa.id,
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
          .catch(error=>{
            this.errors = this.handleError(error)
          })
        }
    },
    consultarCep(cep) {
      if(cep && cep.length == 8) {
        this.disabledEndereco = true
        ViaCepService.buscarEndereco(cep).then(response => {
          Object.assign(this.pessoa, {
            endereco: response.data.logradouro,
            complemento: response.data.complemento,
            bairro: response.data.bairro,
            municipio: response.data.localidade,
            uf: response.data.uf
          })
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

.trocar-btn {
  background-color: #878a8d;
  color: white;
  border: none;
  padding: 3px 8px;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 25px;
}
</style>