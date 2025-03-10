<template>
  <v-container fluid>
    <s-pagebar
      page-title="Emitir Documento"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            sm="12"
          >
            <v-autocomplete
              v-model="documento.tipo_documento"
              :items="tiposDocumento"
              label="Tipo de Documento"
              :error-messages="errors.tipo_documento"
            />
          </v-col>

          <v-col
            v-if="documento.tipo_documento === 'alvara'"
            cols="12"
            sm="12"
          >
            <v-switch
              v-model="documento.alvara_ativo"
              v-permission="['core.pode_bloquear_permissao']"
              label="Ajustar Data"
            />
          </v-col>

          <v-col
            v-if="documento.tipo_documento === 'alvara' && documento.alvara_ativo"
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="documento.data_alvara"
              v-mask="['##/##/####']"
              label="Data do Alvará"
            />
          </v-col>

          <v-col
            v-if="documento.tipo_documento=='oficios'"
            cols="12"
            sm="12"
          >
            <v-radio-group
              v-model="documento.tipo_veiculo"
              row
              :error-messages="errors.tipo_veiculo"
            >
              <v-radio
                label="Veículo Sem Placa"
                value="veiculo_novo"
              />
              <v-radio
                label="Veículo Existente"
                value="veiculo_existente"
              />
            </v-radio-group>
          </v-col>
          <v-col
            v-if="documento.tipo_documento!='declaracao_auxiliar' && documento.tipo_documento!='certidoes_diversas' && documento.tipo_documento!='liberacao_veiculo'"
            cols="12"
            sm="12"
          >
            <v-radio-group
              v-model="documento.categoria"
              row
              :error-messages="errors.categoria"
            >
              <v-radio
                label="Táxi"
                value="taxi"
              />
              <v-radio
                label="Escolar"
                value="escolar"
              />
              <v-radio
                label="Turismo"
                value="turismo"
              />
              <v-radio
                label="Fretamento"
                value="fretamento"
              />
            </v-radio-group>
          </v-col>
          <v-col
            v-if="documento.tipo_veiculo=='veiculo_existente' && documento.categoria=='turismo' || documento.tipo_veiculo=='veiculo_existente' && documento.categoria =='fretamento' || documento.tipo_veiculo=='veiculo_existente' && documento.categoria =='taxi' || documento.tipo_veiculo=='veiculo_existente' && documento.categoria=='escolar'"
            cols="12"
            sm="12"
          >
            <v-select
              v-model="documento.funcao"
              :items="funcoes"
              label="Função"
              :error-messages="errors.funcao"
              @change="filtrarPessoasPorFuncao"
            />
            <v-autocomplete
              v-if="documento.funcao"
              v-model="documento.pessoa"
              :items="pessoasRetornadas"
              item-text="nome"
              item-value="id"
              label="Pessoa"
              :error-messages="errors.pessoa"
            />
          </v-col>
          <v-col
            v-if="documento.tipo_veiculo=='veiculo_existente'"
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="documento.placa"
              label="Placa do Veículo"
              :error-messages="errors.placa"
              @input="transformToUppercase('placa')"
            />
          </v-col>
          <v-col
            v-if="documento.tipo_veiculo=='veiculo_novo'"
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="documento.numero_documento"
              label="CPF/CNPJ"
              :error-messages="errors.numero_documento"
              @input="consultarCondutor"
            />
            <v-text-field
              v-model="documento.nome"
              label="Nome"
              :error-messages="errors.nome"
              :loading="carregandoCondutor"
            />
            <v-text-field
              v-model="documento.cnh"
              label="CNH"
              :error-messages="errors.cnh"
              :loading="carregandoCondutor"
            />
            <v-text-field
              v-model="documento.chassi"
              label="Chassi do Veículo"
              :error-messages="errors.chassi"
            />
            <v-text-field
              v-if="documento.categoria=='taxi'"
              v-model="documento.taximetro"
              label="Taxímetro"
              :error-messages="errors.taximetro"
            />
            <v-text-field
              v-if="documento.categoria=='taxi'"
              v-model="documento.ponto"
              label="Ponto"
              :error-messages="errors.ponto"
            />
            <v-text-field
              v-if="documento.categoria=='escolar'"
              v-model="documento.tacografo"
              label="Tacógrafo"
              :error-messages="errors.tacografo"
            />
            <v-text-field
              v-if="documento.categoria=='escolar'"
              v-model="documento.inscricao_municipal"
              label="Inscrição Municipal"
              :error-messages="errors.inscricao_municipal"
            />
            <v-text-field
              v-if="documento.categoria=='turismo'"
              v-model="documento.registro_turismo"
              label="Registro Ministério Turismo"
              :error-messages="errors.registro_turismo"
            />
          </v-col>
          <v-col
            v-if="documento.tipo_documento!='declaracao_auxiliar' && documento.tipo_documento!='cracha' && documento.tipo_documento!='certidoes_diversas' && documento.tipo_documento!='oficios'"
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="documento.placa"
              label="Placa do Veículo"
              :error-messages="errors.placa"
              @input="transformToUppercase('placa')"
            />
          </v-col>
          <v-col
            v-if="documento.tipo_documento=='autorizacao_sem_sinalizacao'"
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="documento.dias"
              label="Dias"
              :error-messages="errors.dias"
            />
          </v-col>
          <v-col
            v-if="documento.tipo_documento=='autorizacao_trafego'"
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="documento.data_final"
              v-mask="['##/##/####']"
              label="Data Final"
              :error-messages="errors.data_final"
            />
            <v-text-field
              v-model="documento.motivo_da_autorizacao"
              label="Motivo da Autorização"
              :error-messages="errors.motivo_da_autorizacao"
            />
          </v-col>
          <v-col
            v-if="documento.tipo_documento=='certidao_sinalizacao'"
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="documento.empresa"
              label="Empresa"
              :error-messages="errors.empresa"
            />
            <v-text-field
              v-model="documento.telefone"
              label="Telefone"
              :error-messages="errors.telefone"
            />
            <v-text-field
              v-model="documento.contato"
              label="Contato"
              :error-messages="errors.contato"
            />
            <v-text-field
              v-model="documento.endereco"
              label="Endereço"
              :error-messages="errors.endereco"
            />
          </v-col>
          <v-col
            v-if="documento.tipo_documento=='certidoes_diversas'"
            cols="12"
            sm="12"
          >
            <v-row dense>
              <v-col
                cols="12"
                sm="12"
              >
                <v-autocomplete
                  v-model="documento.requerido"
                  :items="requeridos"
                  label="Requerido"
                  :error-messages="errors.requerido"
                />
              </v-col>
            </v-row>
            <v-row
              v-if="documento.requerido=='baixa_escolares'"
              dense
            >
              <v-col
                cols="12"
                sm="12"
                md="6"
              >
                <v-text-field
                  v-model="documento.numero_documento"
                  v-mask="['##############', '###########']"
                  label="CPF/CNPJ"
                  :error-messages="errors.numero_documento"
                />
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="6"
              >
                <v-text-field
                  v-model="documento.placa"
                  label="Placa"
                  :error-messages="errors.placa"
                />
              </v-col>
            </v-row>
            <v-row
              v-if="documento.requerido == 'cadastro_turismo' || documento.requerido == 'cadastro_auxiliar'|| documento.requerido == 'cadastro_escolares' || documento.requerido == 'transferencia_alvara'"
              dense
            >
              <v-col
                cols="12"
                sm="12"
                md="6"
              >
                <v-text-field
                  v-model="documento.numero_documento"
                  v-mask="['##############', '###########']"
                  label="CPF/CNPJ"
                  :error-messages="errors.numero_documento"
                />
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="6"
              >
                <v-text-fieldnumero_do
                  v-model="documento.numero_processo"
                  label="N° Processo"
                  :error-messages="errors.numero_processo"
                />
              </v-col>
            </v-row>
            <v-row
              v-if="documento.requerido=='tempo_servico'"
              dense
            >
              <v-col
                cols="12"
                sm="12"
                md="6"
              >
                <v-text-field
                  v-model="documento.numero_documento"
                  v-mask="['##############', '###########']"
                  label="CPF/CNPJ"
                  :error-messages="errors.numero_documento"
                />
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="6"
              >
                <v-text-field
                  v-model="documento.placa"
                  label="Placa"
                  :error-messages="errors.placa"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col
            v-if="documento.tipo_documento=='liberacao_veiculo'"
            cols="12"
            sm="12"
          >
            <v-row dense>
              <v-col
                cols="12"
                sm="12"
              >
                <v-text-field
                  v-model="documento.data_blitz"
                  v-mask="['##/##/####']"
                  label="Data da Blitz"
                  :error-messages="errors.data_blitz"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col
            v-if="documento.tipo_documento=='oficios'"
            cols="12"
            sm="12"
          >
            <v-autocomplete
              v-model="documento.orgao"
              :items="oficioOrgaos"
              label="Órgão de Destino"
              :error-messages="errors.orgao"
              @change="documento.requerido=[]"
            />
            <v-autocomplete
              v-if="documento.orgao=='BPTRAN'"
              v-model="documento.requerido"
              :items="requeridoBptran"
              label="Requerido"
              multiple
              :error-messages="errors.requerido"
            />
            <v-autocomplete
              v-if="documento.orgao=='DETRAN'"
              v-model="documento.requerido"
              :items="requeridoDetran"
              label="Requerido"
              :error-messages="errors.requerido"
            />
            <v-text-field
              v-if="documento.orgao=='DETRAN'"
              v-model="documento.exercicio"
              v-mask="['####']"
              label="Exercicio"
              :error-messages="errors.exercicio"
            />
            <v-autocomplete
              v-if="documento.orgao=='INMETRO'"
              v-model="documento.requerido"
              :items="requeridoInmetro"
              label="Requerido"
              multiple
              :error-messages="errors.requerido"
            />
            <v-textarea
              v-model="documento.observacao"
              label="Observação"
              :error-messages="errors.observacao"
              filled
            />
          </v-col>
          <v-col
            v-if="documento.tipo_documento=='requerimento'"
            cols="12"
            sm="12"
          >
            <v-autocomplete
              v-model="documento.requerimento"
              :items="requerimentos"
              label="Requerido"
              multiple
              :error-messages="errors.requerimento"
            />
            <v-textarea
              v-model="documento.observacao"
              label="Observação"
              :error-messages="errors.observacao"
              filled
            />
          </v-col>
          <v-col
            v-if="documento.tipo_documento=='cracha'"
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="documento.numero_documento"
              label="CPF ou CNPJ"
              :error-messages="errors.numero_documento"
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
          :loading="loading"
          @click="salvar"
        >
          Gerar
        </v-btn>
      </v-card-actions>
      <!-- <prompt-dialog ref="prompt" /> -->
    </v-card>

    <v-dialog
      v-model="dialogConfirmacao"
      persistent
      width="1024"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Confirme os dados para envio do ofício</span>
        </v-card-title>
        <v-card-text>
          <v-row
            v-if="documento.tipo_veiculo=='veiculo_novo'"
            dense
          >
            <v-col
              cols="12"
              sm="12"
              md="2"
            >
              <v-text-field
                v-model="documento.numero_documento"
                label="CPF"
              />
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="6"
            >
              <v-text-field
                v-model="documento.nome"
                label="Nome"
              />
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="2"
            >
              <v-text-field
                v-model="documento.cnh"
                label="CNH"
              />
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="2"
            >
              <v-text-field
                v-model="documento.chassi"
                label="Chassi"
              />
            </v-col>
            <v-col
              cols="12"
              sm="12"
            >
              <v-text-field
                v-model="documento.requerido"
                label="Requerido"
              />
            </v-col>
          </v-row>
          <v-row
            v-if="documento.tipo_veiculo=='veiculo_existente'"
            dense
          >
            <v-col
              cols="12"
              sm="12"
              md="3"
            >
              <v-text-field
                v-model="documento.placa"
                label="Placa"
              />
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="9"
            >
              <v-text-field
                v-model="documento.requerido"
                label="Requerido"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            text
            class="body-2 font-weight-bold"
            @click="closeDialogConfirmacao"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            class="body-2 font-weight-bold"
            text
            @click="saveDialogConfirmacao"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
  
<script>
import SPagebar from '@/layout/SPagebar.vue'
import * as documentoService from '@/services/documento.service'
import * as SemobService from '@/services/semob.service'
// import PromptDialog from '@/components/PromptDialog.vue'

export default {
  name: 'DocumentoList',
  components: { SPagebar },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Documentos',
        'to': '/documento',
        'exact': true
      },
    ],
    pessoasRetornadas: [],
    pessoa: null,
    dialogConfirmacao: false,
    carregandoCondutor: false,
    documento: {},
    errors: {},
    funcoes: [
      {text: 'Permissionário', value: 'permissionario'},
      {text: 'Auxiliar', value: 'auxiliar'},
      {text: 'Acompanhante', value: 'acompanhante'},
      {text: 'Cooperado', value: 'cooperado'},
      {text: 'Condutor', value: 'condutor'},
      {text: 'Arrendador', value: 'arrendador'},
    ],
    tiposDocumento: [
      {text: "Alvará", value: "alvara"},
      {text: "Autorização sem sinalização", value: "autorizacao_sem_sinalizacao"},
      {text: "Certidão de IOF", value: "certidao_iof"},
      {text: "Certidão de ICMS", value: "certidao_icms"},
      {text: "Certidão de IPI", value: "certidao_ipi"},
      {text: "Certidão de Sinalização", value: "certidao_sinalizacao"},
      {text: "Certidões Diversas", value: "certidoes_diversas"},
      {text: "Crachá", value: "cracha"},
      {text: "Declaração de Auxiliar", value: "declaracao_auxiliar"},
      {text: "Liberação de veículo", value: "liberacao_veiculo"},
      {text: "Nada Consta", value: "nada_consta"},
      {text: "Ofícios", value: "oficios"},
      // {text: "Requerimento", value: "requerimento"},
      {text: "Termo de Permissão", value: "termo_permissao"},
      {text: "Unicidade veicular", value: "unicidade_veicular"},
      {text: "Autorização de tráfego", value: "autorizacao_trafego"}
    ],
    requeridos: [
      {text: 'Baixa de Escolares', value: 'baixa_escolares'}, 
      {text: 'Cadastro de Escolares', value: 'cadastro_escolares'},
      {text: 'Cadastro de Turismo', value: 'cadastro_turismo'},
      {text: 'Cadastro motorista auxiliar', value: 'cadastro_auxiliar'},
      {text: 'Tempo de serviço', value: 'tempo_servico'},
      {text: 'Transferência de alvará', value: 'transferencia_alvara'},
    ],
    oficioOrgaos: [
      "BPTRAN",
      "DETRAN",
      "INMETRO",
    ],
    requeridoDetran: [
      "Mudança de categoria de particular para aluguel",
      "Mudança de categoria de aluguel para particular",
      "Primeiro licenciamento na categoria de aluguel",
      "Renovação da licença",
      "Transferência de propriedade",
      "Transferência de domicílio",
      "Transferência de Propriedade com mudança de Categoria Particular para Aluguel",
      "Transferência de Propriedade com mudança de Categoria Aluguel para Particular",
    ],
    requeridoInmetro: [
      "Aferição do taxímetro",
      "Instalação e verificação do taxímetro",
      "Retirada com substituição do taxímetro",
      "Retirada do taxímetro",
      "Transferência de propriedade do taxímetro",
      "Aferição do tacógrafo",
      "Instalação e verificação do tacógrafo",
      "Retirada com substituição do tacógrafo",
      "Retirada do tacógrafo",
      "Transferência de propriedade do tacógrafo",
      "Transferência de domicílio",
    ],
    requeridoBptran: [
      "Liberação de veículo",
    ],
    requerimentos: [
      "CADASTRO DE MOTORISTA AUXILIAR",
      "BAIXA DE VEICULO",
      "RENOVACAO DO ALVARA",
      "RENOVACAO DO CRACHA",
      "RENOVAÇÃO DE CRACHÁ DO AUXILIAR",
      "RETIRADA DO TAXIMETRO",
      "SOLICITACOES DE CERTIDOES DE ICMS",
      "SOLICITACOES DE CERTIDOES DE IOF",
      "SOLICITACOES DE CERTIDOES DE IPI",
      "SUBSTITUICAO DE VEICULO",
      "SUBSTITUICAO DO TAXIMETRO",
      "TRANSFERENCIA DE ALVARA",
      "TRANSFERENCIA DE ALVARA COM SUBSTITUICAO DE VEICULO",
      "TROCA DE PERMISSIONÁRIO (MOTORISTA AUXILIAR)",
      "TROCA DE PONTO",
    ],
    loading: false,
  }),
  methods: {
    consultarCondutor(cpf) {
      if(cpf && cpf.length >= 11) {
        this.carregandoCondutor = true
        SemobService.buscarCondutor(cpf)
        .then(response => {
          Object.assign(this.documento, {
            nome: response.data.nome_condutor,
            cnh: response.data.num_registro,
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
    salvar() {
        this.loading = true
        if(this.documento.tipo_documento=='oficios' && this.documento.orgao=='DETRAN') {
          this.dialogConfirmacao = true
        } else {
          this.enviarRequisicao()
        }
    },
      // async salvar() {
      //   this.loading = true

      //   const res = await this.$refs.prompt.open(
      //   'Requerimento',
      //   'Informe o número do requerimento',
      //   'Número do requerimento'
      //   )

      //   if (res){
      //     let numero_requerimento = res
      //     let placa = this.documento.placa
      //     let numero_documento = this.documento.numero_documento

      //     const response = this.$api.list({
      //       resource: `${this.$endpoints.PROCESSO}/validar-numero`,
      //       query: {
      //         numero_requerimento, 
      //         placa, 
      //         numero_documento,
      //       },
      //     })
      //     response
      //       .then(()=>{
      //         if(this.documento.tipo_documento=='oficios' && this.documento.orgao=='DETRAN') {
      //           this.dialogConfirmacao = true
      //         } else {
      //           this.enviarRequisicao()
      //         }
      //       })
      //       .catch(error=>{
      //         this.errors = this.handleError(error)
      //       })
      //   }
      //   this.loading = false
      // },
    enviarRequisicao() {
      if (typeof this.documento.requerido === 'string') this.documento.requerido = this.documento.requerido.split();

      let request = documentoService.carregarArquivo({
        resource: this.$endpoints.DOCUMENTO,
        data: this.documento
      })
      request
        .then(response => {
          this.loading = false
          const downloadUrl = window.URL.createObjectURL(response.data)
          window.open(downloadUrl, '__blank')
        })
        .catch((error) => {
          this.handleBlobError(error)
          this.loading = false
        });
    },
    async filtrarPessoasPorFuncao() {
      try {
        const requestData = {
          funcao: this.documento.funcao,
          categoria: this.documento.categoria
        };

        const response = await this.$api.list({
          resource: this.$endpoints.PESSOA,
          query: requestData
        });

        if (response.data && Array.isArray(response.data.results)) {
          this.pessoasRetornadas = response.data.results;
        } else {
          this.pessoasRetornadas = [];
        }
      } catch (error) {
        this.handleBlobError(error);
        this.pessoasRetornadas = [];
      }
    },
    closeDialogConfirmacao() {
      this.loading = false
      this.dialogConfirmacao = false
    },
    saveDialogConfirmacao() {
      this.enviarRequisicao()
      this.dialogConfirmacao = false
    },
    transformToUppercase(field) {
      this.documento[field] = this.documento[field].toUpperCase();
    },
  }    
}
</script>