<template>
  <v-container fluid>
    <s-pagebar
      page-title="Permissões"
      :breadcrumbs="breadcrumbs"
    >
      <v-btn
        color="blue-grey darken-4"
        dark
        fab
        small
        @click="dialog=true"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </s-pagebar>
    <v-card flat>
      <v-card-text>
        <div class="d-flex align-center">
          <div style="max-width: 200px">
            <v-text-field
              v-model="filtro.numero"
              label="Número"
              class="mr-3"
              @keyup.enter="getPermissoes"
            />
          </div>
          <div style="max-width: 500px">
            <v-autocomplete
              v-model="filtro.categoria"
              label="Categoria"
              :items="categorias"
              class="mr-3"
              @keyup.enter="getPermissoes"
            />
          </div>
          <div style="max-width: 500px">
            <v-text-field
              v-model="filtro.numero_documento"
              v-mask="['XXX.XXX.XXX-XX', 'XX.XXX.XXX/XXXX-XX']"
              label="Nº Documento"
              :items="numero_documento"
              class="mr-3"
              @keyup.enter="getPermissoes"
            />
          </div>
          <div style="max-width: 500px">
            <v-text-field
              v-model="filtro.placa"
              label="Placa"
              :items="placa"
              class="mr-3"
              @input="transformToUppercase"
              @keyup.enter="getPermissoes"
            />
          </div>
          <v-btn
            color="blue-grey darken-4 mr-3"
            dark
            @click="getPermissoes"
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
          <template #[`item.numero`]="{ item }">
            <span v-if="!!item.numero">{{ item.numero.toString().padStart(4, '0') }}</span>
          </template>
          <template #[`item.categoria`]="{ item }">
            <span v-if="item.categoria=='taxi'">Táxi</span>
            <span v-if="item.categoria=='escolar'">Escolar</span>
            <span v-if="item.categoria=='turismo'">Turismo</span>
            <span v-if="item.categoria=='fretamento'">Fretamento</span>
          </template>
          <template #[`item.permissionario.numero_documento`]="{ item }">
            {{ item.permissionario && formatarDocumento(item.permissionario.numero_documento) }}
          </template>
          <template #[`item.placa`]="{ item }">
            <span v-if="!!item.placa" />
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip
              v-if="item.status=='disponivel'"
              color="grey"
              dark
            >
              {{ item.status }}
            </v-chip>
            <v-chip
              v-if="item.status=='ativa'"
              color="green"
              dark
            >
              {{ item.status }}
            </v-chip>
            <v-chip
              v-if="item.status=='bloqueada'"
              color="red"
              dark
            >
              {{ item.status }}
            </v-chip>
          </template>
          <template #[`item.action`]="{ item }">
            <v-toolbar-items>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    v-on="on"
                    @click="editarPermissao(item.id)"
                  >
                    <v-icon class="material-icons-outlined">
                      visibility
                    </v-icon>
                  </v-btn>
                </template>
                <span>Visualizar</span>
              </v-tooltip>
            </v-toolbar-items>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model="dialog"
      max-width="600"
    >
      <v-card>
        <v-card-title class="text-h5">
          Selecione a categoria para iniciar o cadastro:
        </v-card-title>

        <v-card-text>
          <v-autocomplete
            v-model="categoria"
            label="Categoria"
            :items="categorias"
            :error-messages="errors.categoria"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="grey darken-1"
            text
            @click="dialog = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="blue-grey darken-4"
            text
            @click="cadastrarPermissao"
          >
            Iniciar cadastro
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import SPagebar from '@/layout/SPagebar.vue'
export default {
  name: 'PermissaoList',
  components: { SPagebar },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Permissões',
        'to': '/permissao',
        'exact': true
      }
    ],
    categorias: [
      {text: 'Táxi', value: 'taxi'},
      {text: 'Escolar', value: 'escolar'},
      {text: 'Turismo', value: 'turismo'},
      {text: 'Fretamento', value: 'fretamento'},
    ],
    headers: [
      {text: 'Registro', value: 'numero'},
      {text: 'Categoria', value: 'categoria'},
      {text: 'Permissionário', value: 'permissionario.nome'},
      {text: 'CPF/CNPJ', value: 'permissionario.numero_documento'},
      {text: 'Status', value: 'status'},
      {text: 'Ações', value: 'action'},
    ],
    placa:{},
    categoria:{},
    numero_documento:{},
    numero:{},
    filtro: {
      numero: null,
      categoria: null,
      placa: null,
      numero_documento: null,
    },
    totalItems: 0,
    items: [],
    options: {},
    dialog: false,   
    errors: [],
    filtroAnterior: {
      numero: null,
      categoria: null,
      placa: null,
      numero_documento: null,
    },
  }),
  watch: {
    options: {
      handler() {
        this.getPermissoes()
      },
      deep: true
    },
  },
  methods: {
    async getPermissoes() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      
      let resetPage = false;
      let ordering = sortBy[0];
      if (sortDesc[0]) {
        ordering = `-${ordering}`;
      }

      if (
        this.filtro.categoria !== this.filtroAnterior.categoria ||
        this.filtro.numero_documento !== this.filtroAnterior.numero_documento ||
        this.filtro.placa !== this.filtroAnterior.placa ||
        this.filtro.numero !== this.filtroAnterior.numero
      ) {
        resetPage = true;
        this.options.page = 1;
        this.filtroAnterior = { ...this.filtro };
      }
      
      ordering = `${sortDesc && sortDesc[0] ? '-' : ''}${sortBy}`;
      
      const query = {
        page: resetPage ? 1 : page,
        page_size: itemsPerPage,
        ordering: ordering,
        categoria: this.filtro.categoria,
        numero: this.filtro.numero,
        placa: this.filtro.placa,
        numero_documento: this.filtro.numero_documento
      }
      
      const response = await this.$api.list({
        resource: this.$endpoints.PERMISSAO,
        query: query
      })
      this.items = response.data.results
      this.totalItems = response.data.count
    },
    cadastrarPermissao(){
      const response = this.$api.create({
        resource: this.$endpoints.PERMISSAO,
        data: {
          categoria: this.categoria,
        }
      })
      response.then(res=>{
        this.editarPermissao(res.data.id)
        this.dialog = false
      })
      .catch(error=>{
        this.errors = this.handleError(error)
      })
    },
    editarPermissao(id) {
      this.$router.push(`/permissao/${id}`)
    },
    limparFiltros() {
      this.filtro = {
        numero: null,
        categoria: null,
        placa: null,
        numero_documento: null,
      }
      this.getPermissoes()
    },
    transformToUppercase() {
      this.filtro.placa = this.filtro.placa.toUpperCase();
    },
    formatarDocumento(documento) {
      if (!documento) return null;
      documento = documento.replace(/[^\d]/g, '');
      if (documento.length == 11) {
        return documento.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
      } else {
        return documento.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
      }
    }
  }
}
</script>