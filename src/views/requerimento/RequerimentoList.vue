<template>
  <v-card flat>
    <v-card-text>
      <div class="d-flex align-center">
        <div style="max-width: 500px">
          <v-text-field
            v-model="filtro.placa"
            label="Placa"
            class="mr-3"
            @input="transformToUppercase"
            @keyup.enter="getRequerimentos"
          />
        </div>
        <div style="max-width: 500px">
          <v-text-field
            v-model="filtro.numero"
            label="Requerimento"
            class="mr-3"
            @keyup.enter="getRequerimentos"
          />
        </div>
        <v-btn
          color="blue-grey darken-4 mr-3"
          dark
          @click="getRequerimentos"
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
        <template #[`item.data`]="{ item }">
          {{ formatDateTimeToDate(item.data) }}
        </template>
        <template #[`item.status`]="{ item }">
          {{ formatStatusName(item.status) }}
        </template>
        <template #[`item.processo_descricao`]="{ item }">
          <div
            v-for="(desc, index) in item.processo_descricao"
            :key="index"
          >
            - {{ desc }}
          </div>
        </template>
        <template #[`item.documento`]="{ item }">
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                :disabled="disabledButtons"
                v-on="on"
                @click="baixarArquivo(item.documento)"
              >
                <v-icon>file_download</v-icon>
              </v-btn>
            </template>
            <span>Baixar arquivo</span>
          </v-tooltip>
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
                  @click="openDialogStatus(item)"       
                >
                  <v-icon class="material-icons-outlined">
                    edit_note
                  </v-icon>
                </v-btn>
              </template>
              <span>Editar Status</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  icon
                  :disabled="disabledButtons"
                  v-on="on"
                  @click="editarRequerimento(item)"     
                >
                  <v-icon class="material-icons-outlined">
                    visibility
                  </v-icon>
                </v-btn>
              </template>
              <span>Editar Requerimento</span>
            </v-tooltip>
          </v-toolbar-items>
        </template>
      </v-data-table>
      <ConfirmDialog ref="confirm" />
      <v-dialog
        v-model="dialogStatus"
        persistent
        width="500"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Alterar Status do Requerimento</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                sm="12"
              >
                <v-autocomplete
                  v-model="requerimento.status"
                  :items="status"
                  item-text="text"
                  item-value="value"
                  label="Status"
                  :error-messages="errors.status"
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
              @click="fecharDialogStatus"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="primary"
              class="body-2 font-weight-bold"
              text
              @click="salvarDialogStatus"
            >
              Salvar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
import ConfirmDialog from '@/components/ConfirmDialog.vue'

export default {
    name: "RequerimentoList",
    components: { ConfirmDialog },
    props: {
        permissao: Object,
        disabledButtons: Boolean
    },
    data: () => ({
        headers: [
            { text: "Data", value: "data" },
            { text: "Número", value: "numero" },
            { text: "Descrição", value: "processo_descricao", sortable: false},
            { text: "Placa", value: "placa" },
            { text: "Status", value: "status", sortable: false },
            { text: "Documento", value: "documento", sortable: false },
            { text: "Ações", value: "action" },
        ],
        placa:{},
        filtro: {
          placa: null,
          numero: null,
        },
        totalItems: 0,
        items: [],
        options: {},
        filtroAnterior: {
          placa: null,
          numero: null,
        },
        dialogStatus: false,
        status: [
          {text: 'Em andamento', value: 'em_andamento'},
          {text: 'Cancelado', value: 'cancelado'},
          {text: 'Finalizado', value: 'finalizado'},
        ],
        requerimento: {},
        errors: {}
    }),
    watch: {
        options: {
            handler() {
                this.getRequerimentos();
            },
            deep: true
        },
    },
    methods: {
        async getRequerimentos() {
            const { sortBy, sortDesc, page, itemsPerPage } = this.options;

            let resetPage = false;
            let ordering = sortBy[0];
            if (sortDesc[0]) {
              ordering = `-${ordering}`;
            }

            if (
              this.filtro.placa !== this.filtroAnterior.placa ||
              this.filtro.numero !== this.filtroAnterior.numero
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
              expand: 'descricao',
              placa: this.filtro.placa,
              numero: this.filtro.numero,
          };

            const response = await this.$api.list({
                resource: this.$endpoints.PROCESSO,
                query: query
            });

            this.items = response.data.results;
            this.totalItems = response.data.count;
        },
        baixarArquivo(arquivo) {
          window.open(arquivo)
        },
        editarRequerimento(item) {
          this.$router.push(`/requerimento/${item.id}`)
        },
        async deletarRequerimento(veiculoId) {
            const res = await this.$refs.confirm.open("Confirmar exclusão", "Tem certeza que deseja excluir este registro ?");
            if (res) {
                const response = this.$api.destroy({
                    resource: this.$endpoints.PROCESSO,
                    id: veiculoId
                });
                response
                    .then(() => this.getRequerimentos())
                    .catch(err => {
                    this.$toast.open({
                        message: err,
                        type: "error",
                    });
                });
            }
        },

        openDialogStatus(requerimento) {
          this.requerimento = Object.assign({}, requerimento)
          this.dialogStatus = true
        },

        fecharDialogStatus() {
          this.dialogStatus = false
          this.requerimento = {}
          this.errors = {}
        },

        salvarDialogStatus() {
          const response = this.$api.update({
            resource: this.$endpoints.PROCESSO,
            id: this.requerimento.id,
            data: {
              id: this.requerimento.id,
              status: this.requerimento.status,
              permissao: this.requerimento.permissao,
              descricao: this.requerimento.descricao.id,
              numero: this.requerimento.numero
            }
          })
          response
            .then(()=>{
              this.$toast.open({
                  message: 'Registro salvo com sucesso',
                  type: 'success',
              })
              this.fecharDialogStatus()
              this.getRequerimentos()
            })
            .catch(error=>this.errors = this.handleError(error))
        },

        formatStatusName(status) {
          const statusMap = {
            em_andamento: 'Em andamento',
            cancelado: 'Cancelado',
            finalizado: 'Finalizado'
          };
          return statusMap[status] || 'Status desconhecido';
        },
        limparFiltros() {
          this.filtro = {
            placa: null,
            numero: null,
          }
          this.getRequerimentos()
        },
        transformToUppercase() {
          this.filtro.placa = this.filtro.placa.toUpperCase();
        },

    }
}
</script>
