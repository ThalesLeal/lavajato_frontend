<template>
  <v-container fluid>
    <s-pagebar
      page-title="Detalhes da Permissão"
      :breadcrumbs="breadcrumbs"
    >
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn
            color="blue-grey darken-4"
            dark
            fab
            small
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            link
            :to="`historico/${permissao.id}`"
          >
            <v-list-item-title>Visualizar Histórico</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </s-pagebar>
    <v-card
      flat
      class="mb-3"
    >
      <v-card-title>
        Número de Registro:
        <span v-if="!!permissao.numero">{{
          permissao.numero.toString().padStart(4, "0")
        }}</span>
        <v-chip class="ml-3">
          {{ permissao.status }}
        </v-chip>
      </v-card-title>
      <v-card-subtitle>
        Data de Cadastro: {{ permissao.data_cadastro }} - Categoria:
        <span class="text-capitalize">{{
          permissao.categoria
        }}</span>
      </v-card-subtitle>
      <v-btn
        v-permission="['core.pode_bloquear_permissao']"        
        class="ms-4 mt-n3" 
        dark
        color="blue-grey darken-4"
        @click="toggleBloqueio"
      >
        {{ permissao.bloqueado ? "Desbloquear" : "Bloquear" }}
      </v-btn>
      <v-card-text>
        <v-textarea
          v-model="permissao.observacao"
          label="Observações"
          filled
          class="mt-n2"
          rows="2"
          :readonly="permissao.bloqueado"
        />
      </v-card-text>
      <v-card-actions
        class="mt-n10"
      >
        <v-spacer />
        <v-btn
          outlined
          color="blue-grey darken-4"
          @click="$router.push('/permissao')"
        >
          Voltar
        </v-btn>
        <v-btn
          dark
          color="blue-grey darken-4"
          :disabled="permissao.bloqueado"
          @click="salvar"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card
      flat
      class="mb-3"
    >
      <v-tabs v-model="tab">
        <!-- Tabela Pessoas -->
        <v-tab>
          PESSOAS
        </v-tab>
        <v-tab-item>
          <v-card>
            <v-card-title>
              Pessoas
              <v-spacer />
              <v-btn 
                text 
                :disabled="permissao.bloqueado" 
                @click="incluirPessoa"
              >
                <v-icon class="mr-1">
                  add_circle
                </v-icon>
                Incluir pessoa
              </v-btn>
              <v-btn
                text
                :disabled="permissao.bloqueado"
                @click="incluirPessoaPrecadastro"
              >
                <v-icon class="mr-1">
                  add_circle
                </v-icon>
                Incluir pessoa pré-cadastro
              </v-btn>
            </v-card-title>
            <v-card-text>
              <pessoa-list
                v-if="permissaoCarregada"
                :permissao="permissao"
                :disabled-buttons="permissao.bloqueado"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- Tabela Veiculos -->
        <v-tab>
          VEÍCULOS
        </v-tab>
        <v-tab-item>
          <v-card>
            <v-card-title>
              Veículos
              <v-spacer />
              <v-btn
                text
                :disabled="permissao.bloqueado"
                @click="incluirVeiculo"
              >
                <v-icon class="mr-1">
                  add_circle
                </v-icon>
                Incluir veículo
              </v-btn>
              <v-btn
                text
                :disabled="permissao.bloqueado"
                @click="incluirVeiculoPrecadastro"
              >
                <v-icon class="mr-1">
                  add_circle
                </v-icon>
                Incluir veículo pré-cadastro
              </v-btn>
            </v-card-title>
            <v-card-text>
              <veiculo-list
                v-if="permissaoCarregada"
                :permissao="permissao"
                :disabled-buttons="permissao.bloqueado"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- Tabela Oficios -->
        <v-tab>
          OFÍCIOS
        </v-tab>
        <v-tab-item>
          <v-card>
            <v-card-title> Ofícios </v-card-title>
            <v-card-text>
              <OficioList
                v-if="permissaoCarregada"
                :permissao="permissao"
                :disabled-buttons="permissao.bloqueado"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- Tabela Boletos -->
        <v-tab>
          BOLETOS
        </v-tab>
        <v-tab-item>
          <v-card>
            <v-card-title> Boletos </v-card-title>
            <v-card-text>
              <BoletoList
                v-if="permissaoCarregada"
                :permissao="permissao"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- Tabela Vistorias -->
        <v-tab>
          VISTORIAS
        </v-tab>
        <v-tab-item>
          <v-card>
            <v-card-title> Vistorias </v-card-title>
            <v-card-text>
              <VistoriaListComponent
                v-if="permissaoCarregada"
                :permissao="permissao"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>
        
        <!-- Tabela Requerimentos-->
        <v-tab>
          REQUERIMENTOS
        </v-tab>
        <v-tab-item>
          <v-card>
            <v-card-title>
              Requerimentos
              <v-spacer />
              <v-btn
                text
                :disabled="permissao.bloqueado"
                @click="incluirRequerimento"
              >
                <v-icon class="mr-1">
                  add_circle
                </v-icon>
                Incluir requerimento
              </v-btn>
            </v-card-title>
            <v-card-text>
              <RequerimentoList
                v-if="permissaoCarregada"
                :permissao="permissao"
                :disabled-buttons="permissao.bloqueado"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- Tabela Historico-->
        <v-tab>
          HISTÓRICO
        </v-tab>
        <v-tab-item>
          <v-card>
            <v-card-title> Histórico </v-card-title>
            <v-card-text>
              <HistoricoList
                v-if="permissaoCarregada"
                :permissao="permissao"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
    <prompt-dialog ref="prompt" />
  </v-container>
</template>

<script>
import SPagebar from "@/layout/SPagebar.vue";
import VeiculoList from "../veiculo/VeiculoList.vue";
import PessoaList from "../pessoa/PessoaList.vue";
import HistoricoList from "../historico/HistoricoList.vue";
import BoletoList from "../boleto/BoletoList.vue";
import RequerimentoList from "../requerimento/RequerimentoList.vue";
import OficioList from "../oficio/OficioList.vue";
import PromptDialog from "@/components/PromptDialog.vue";
import VistoriaListComponent from "../vistoria/VistoriaListComponent.vue";

export default {
  name: "PermissaoEdit",
  components: {
    SPagebar,
    VeiculoList,
    PessoaList,
    HistoricoList,
    BoletoList,
    RequerimentoList,
    PromptDialog,
    OficioList,
    VistoriaListComponent,
  },
  data: () => ({
    breadcrumbs: [
      {
        text: "Permissões",
        to: "/permissao",
        exact: true,
      },
      {
        text: "Detalhes",
        disabled: true,
      },
    ],
    permissao: {},
    permissaoCarregada: false,
    isAuthenticated: false,
    tab: 0,
    disabledButtons: false,
  }),
  created() {
    this.getPermissao(this.$route.params.id);
  },
  methods: {
    async getPermissao(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.PERMISSAO,
        id: id,
      });
      this.permissao = response.data;
      this.permissaoCarregada = true;
    },
    async salvar() {
      const res = await this.$refs.prompt.open(
        "Requerimento",
        "Informe o número do requerimento",
        "Número do requerimento"
      );
      if (res) {
        this.permissao.numero_requerimento = res;
        const response = this.$api.update({
          resource: this.$endpoints.PERMISSAO,
          id: this.permissao.id,
          data: {
            observacao: this.permissao.observacao,
          },
        });
        response.then(() => {
          this.$toast.open({
              message: 'Registro salvo com sucesso',
              type: 'success',
          })
        });
      }
    },

    incluirPessoa() {
      this.$router.push(
        `/pessoa/?permissao=${this.permissao.id}&categoria=${this.permissao.categoria}`
      );
    },

    incluirPessoaPrecadastro() {
      this.$router.push(
        `/pessoa/precadastro/?permissao=${this.permissao.id}&categoria=${this.permissao.categoria}`
      );
    },

    incluirRequerimento() {
      this.$router.push(
        `/requerimento/cadastrar/?permissao=${this.permissao.id}&categoria=${this.permissao.categoria}`
      );
    },

    incluirVeiculo() {
      this.$router.push(
        `/veiculo/?permissao=${this.permissao.id}&categoria=${this.permissao.categoria}`
      );
    },

    incluirVeiculoPrecadastro() {
      this.$router.push(
        `/veiculo/precadastro/?permissao=${this.permissao.id}&categoria=${this.permissao.categoria}`
      );
    },
    toggleBloqueio() {
      const newstatus = !this.permissao.bloqueado;
      
      const response = this.$api.update({
        resource: this.$endpoints.PERMISSAO,
        id: this.permissao.id,
        data: {
          bloqueado: newstatus,    
          id: this.permissao.id,
        },
      });
      response.then(()=> {
        this.getPermissao(this.permissao.id)
      }).catch ((error) => {
      console.error("Erro ao atualizar o status de bloqueio:", error);
      })
    }
  },
}
</script>
