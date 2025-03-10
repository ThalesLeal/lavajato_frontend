<template>
  <v-container fluid>
    <s-pagebar
      page-title="Cadastrar Vistoria"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-title>Identificação</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="permissao.numero"
              label="Registro"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="permissao.categoria"
              label="Categoria"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="permissao.permissionario.nome"
              label="Permissionário"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="veiculo.desc_marca_modelo"
              label="Marca/Modelo"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="veiculo.placa"
              label="Placa"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="veiculo.chassi"
              label="Chassi"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="veiculo.ano_fabricacao"
              label="Ano de Fabricação"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-text-field
              v-model="veiculo.desc_cor"
              label="Cor"
              disabled
            />
          </v-col>
          <v-col
            v-if="veiculo.categoria=='taxi'"
            cols="12"
            md="4"
            sm="12"
          >
            <v-text-field
              v-model="veiculo.taximetro"
              label="Taxímetro"
              disabled
            />
          </v-col>
          <v-col
            v-if="veiculo.categoria!='taxi' && veiculo.desc_carroceria!='BUGGY'"
            cols="12"
            sm="12"
            md="4"
          >
            <v-text-field
              v-model="veiculo.tacografo"
              label="Tacógrafo"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-autocomplete
              v-if="veiculo.categoria=='taxi'"
              v-model="permissao.permissionario.ponto"
              :items="pontos"
              label="Ponto"
              item-value="id"
              disabled
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
            <v-textarea
              v-model="permissao.observacao"
              label="Observação"
              filled
              disabled
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card
      flat
      class="my-3"
    >
      <v-card-title>Defeitos</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            sm="12"
          >
            <v-autocomplete
              v-model="defeito.item_vistoria"
              label="Defeito"
              :items="itensVistoria"
              item-text="descricao"
              item-value="id"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-textarea
              v-model="defeito.observacao"
              label="Detalhes do Defeito"
              filled
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            class="d-flex justify-end"
          >
            <v-btn
              color="primary"
              @click="incluirDefeito"
            >
              Incluir defeito na lista
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-data-table
              :headers="headersItensDefeito"
              :items="itensDefeito"
              disable-pagination
              hide-default-footer
            >
              <template #[`item.action`]="{ item }">
                <v-toolbar-items>
                  <v-btn
                    icon
                    @click="excluirDefeito(item)"
                  >
                    <v-icon class="material-icons-outlined">
                      delete
                    </v-icon>
                  </v-btn>
                </v-toolbar-items>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card
      flat
      class="my-3"
    >
      <v-card-title>Vistoria</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            sm="12"
          >
            <v-autocomplete
              v-model="vistoria.parecer"
              :items="status"
              item-text="text"
              item-value="value"
              label="Parecer"
            />
          </v-col>
          <v-col
            v-if="vistoria.parecer=='aprovado_com_ressalva'"
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="vistoria.data_retorno"
              v-mask="['##/##/####']"
              label="Data de Retorno"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-textarea
              v-model="vistoria.observacao"
              label="Observação"
              filled
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
    <ConfirmDialog ref="confirm" />
  </v-container>
</template>

<script>
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import SPagebar from '@/layout/SPagebar.vue'

export default {
  name: 'VistoriaCreate',
  components: { SPagebar, ConfirmDialog },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Vistoria',
        'to': '/vistoria',
        'exact': true
      },
      {
        'text': 'Cadastrar Vistoria',
        'disabled': true
      },
    ],
    itensDefeito: [],
    vistoria: {},
    veiculo: {},
    permissao: {
      permissionario: {}
    },
    status: [
      {text: 'Aprovado', value: 'aprovado'},
      {text: 'Aprovado com ressalva', value: 'aprovado_com_ressalva'},
      {text: 'Reprovado', value: 'reprovado'}
    ],
    headersItensDefeito: [
      {text: 'Defeito', value: 'item_vistoria.descricao', sortable: false},
      {text: 'Detalhes do Defeito', value: 'observacao', sortable: false},
      {text: 'Ações', value: 'action', sortable: false},
    ],
    itensVistoria: [],
    errors: {},
    pontos: [],
    defeito: {}
  }),
  created() {
    this.getPontos()
    this.getItensVistoria()
    this.getVistoria(this.$route.params.id)
  },
  methods: {
    async getPontos() {
      const response = await this.$api.list({
        resource: this.$endpoints.PONTO
      })
      this.pontos = response.data.results
    },
    async getItensVistoria() {
      const response = await this.$api.list({
        resource: this.$endpoints.VISTORIA_ITEM
      })
      this.itensVistoria = response.data.results
    },
    async getVistoria(vistoriaId) {
      const response = await this.$api.get({
        resource: this.$endpoints.VISTORIA,
        id: vistoriaId
      })
      this.vistoria = response.data
      this.getVeiculo(this.vistoria.veiculo)
    },
    async getVeiculo(veiculoId) {
      const response = await this.$api.get({
        resource: this.$endpoints.VEICULO,
        id: veiculoId
      })
      this.veiculo = response.data
      this.getPermissao(this.veiculo.permissao)
    },
    async getPermissao(permissaoId) {
      const response = await this.$api.get({
        resource: this.$endpoints.PERMISSAO,
        id: permissaoId
      })
      this.permissao = response.data
    },
    salvar() {
      this.vistoria.itens_defeito = this.itensDefeito.map(item=>item.id)
      const response = this.$api.update({
        resource: this.$endpoints.VISTORIA,
        id: this.vistoria.id,
        data: this.vistoria
      })
      response
        .then(()=>{
          this.$toast.open({
              message: 'Vistoria salva com sucesso',
              type: 'success',
          })
          this.$router.push('/vistoria')
        })
        .catch(error=>{
          this.errors = this.handleError(error)
        })
    },
    limparDefeito() {
      this.defeito = {}
    },
    incluirDefeito() {
      const response = this.$api.create({
        resource: this.$endpoints.VISTORIA_DEFEITO,
        data: this.defeito
      })
      response
        .then((res)=>{
          this.$toast.open({
              message: 'Defeito incluído com sucesso',
              type: 'success',
          })
          this.inserirDefeitoLista(res.data.id)
          this.limparDefeito()
        })
        .catch(error=>{
          this.errors = this.handleError(error)
        })
    },
    async inserirDefeitoLista(id){
      const response = await this.$api.get({
        resource: this.$endpoints.VISTORIA_DEFEITO,
        id: id,
        query: {
          expand: 'item_vistoria'
        }
      })
      this.itensDefeito.push(response.data)
    },
    async excluirDefeito(item) {
        const res = await this.$refs.confirm.open(
          'Confirmar exclusão',
          'Tem certeza que deseja excluir este registro ?'
        )
        if (res) {
          const response = this.$api.destroy({
            resource: this.$endpoints.VISTORIA_DEFEITO,
            id: item.id
          })
          response.then(()=>{
            const index = this.itensDefeito.indexOf(item)
            this.itensDefeito.splice(index, 1)
          })
        }
    },
  }
}
</script>