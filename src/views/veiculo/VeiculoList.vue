<template>
  <v-card flat>
    <v-card-text>
      <div class="d-flex align-center">
        <div style="max-width: 500px">
          <v-text-field
            v-model="filtro.placa"
            label="Placa"
            :items="placa"
            class="mr-3"
            @input="transformToUppercase"
            @keyup.enter="getVeiculos"
          />
        </div>
        <v-btn
          color="blue-grey darken-4 mr-3"
          dark
          @click="getVeiculos"
        >
          <v-icon>search</v-icon>
          Pesquisar
        </v-btn>
        <v-btn
          outlined
          color="blue-grey darken-4"
          @click="limparFiltros"
        >
          Limpar filtros
        </v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="totalItems"
        :items-per-page="10"
        :footer-props="{
          'items-per-page-options': [10, 20, 30]
        }"
      >
        <template #[`item.pre_cadastro`]="{ item }">
          <v-chip
            v-if="item.pre_cadastro"
            color="red darken-2"
            dark
          >
            Pré-cadastro
          </v-chip>
          <v-chip
            v-else
            color="green darken-2"
            dark
          >
            Cadastro
          </v-chip>
        </template>
        <template #[`item.action`]="{ item }">
          <v-toolbar-items>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  icon
                  :disabled="disabledButtons"
                  v-on="on"
                  @click="editarVeiculo(item)"           
                >
                  <v-icon class="material-icons-outlined">
                    visibility
                  </v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  icon
                  :disabled="disabledButtons"
                  v-on="on"
                  @click="deletarVeiculo(item.id)"          
                >
                  <v-icon class="material-icons-outlined">
                    delete
                  </v-icon>
                </v-btn>
              </template>
              <span>Deletar</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  icon
                  :disabled="disabledButtons"
                  v-on="on"
                  @click="vistoriarVeiculo(item.id)"          
                >
                  <v-icon class="material-icons-outlined">
                    checklist
                  </v-icon>
                </v-btn>
              </template>
              <span>Vistoriar</span>
            </v-tooltip>
          </v-toolbar-items>
        </template>
      </v-data-table>
      <PromptDialog ref="prompt" />
    </v-card-text>
  </v-card>
</template>

<script>
import PromptDialog from '@/components/PromptDialog.vue'

export default {
    name: "VeiculoList",
    components: { PromptDialog },
    props: {
        permissao: Object,
        disabledButtons: Boolean
    },
    data: () => ({
        headers: [
            { text: "Placa", value: "placa" },
            { text: "Marca/Modelo", value: "desc_marca_modelo" },
            { text: "Ano Fabricação", value: "ano_fabricacao" },
            { text: "Alvará", value: "alvara" },
            { text: "Validade Alvará", value: "alvara_validade" },
            { text: "Pré-cadastro", value: "pre_cadastro" },
            { text: "Ações", value: "action" },
        ],
        totalItems: 0,
        items: [],
        options: {},
        placa:{},
        filtro: {
          placa: null,
        },
        filtroAnterior: {
          placa: null,
        },
    }),
    watch: {
        options: {
            handler() {
                this.getVeiculos();
            },
            deep: true
        },
    },
    methods: {
      async getVeiculos() { 
        const { sortBy, sortDesc, page, itemsPerPage } = this.options   
        let resetPage = false;
        let ordering = sortBy[0];
        if (sortDesc[0]) {
          ordering = `-${ordering}`;
        }

        if (
          this.filtro.placa !== this.filtroAnterior.placa
        ) {
          resetPage = true;
          this.options.page = 1;
          this.filtroAnterior = { ...this.filtro };
        }
        
        ordering = `${sortDesc && sortDesc[0] ? '-' : ''}${sortBy}`;
        
        const query = {
          permissao: this.permissao.id,
          page: resetPage ? 1 : page,
          page_size: itemsPerPage,
          ordering: ordering,
          placa: this.filtro.placa,
        }
        const response = await this.$api.list({
            resource: this.$endpoints.VEICULO,
            query: query
        });
        this.items = response.data.results;
        this.totalItems = response.data.count;
      },
      editarVeiculo(item) {
        if(item.pre_cadastro) {
          this.$router.push(`/veiculo/precadastro/${item.id}`)
        } else {
          this.$router.push(`/veiculo/${item.id}`)
        }
      },
      async deletarVeiculo(veiculoId) {
          const res = await this.$refs.prompt.open(
            'Requerimento',
            'Informe o número do requerimento',
            'Número do requerimento'
          )
          if (res) {
              const response = this.$api.destroy({
                  resource: this.$endpoints.VEICULO,
                  id: veiculoId,
                  data: {
                    numero_requerimento: res
                  }
              });
              response
                  .then(() => this.getVeiculos())
                  .catch(err => {
                  this.$toast.open({
                      message: err,
                      type: "error",
                  });
              });
          }
      },
      async vistoriarVeiculo(veiculoId) {
        const response = this.$api.create({
            resource: this.$endpoints.VISTORIA,
            data: {
              veiculo: veiculoId,
              parecer: 'pendente',
              usuario: this.user.user_id,
            }
        });
        response
            .then(() => {
                this.$toast.open({
                    message: 'Vistoria solicitada com sucesso',
                    type: "success",
                });
            })
            .catch(error => {
              this.handleError(error)
            });
      },
      limparFiltros() {
        this.filtro = {
          placa: null,
        }
        this.getVeiculos()
      },
      transformToUppercase() {
        this.filtro.placa = this.filtro.placa.toUpperCase();
      },
    }
}
</script>