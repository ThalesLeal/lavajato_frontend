<template>
  <v-container fluid>
    <s-pagebar
      page-title="Consultar boleto"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-if="boleto.placa === ''"
              v-model="boleto.nosso_numero"
              v-mask="['XXXXXXXXXXXXXXXXXXXX']"
              label="Nosso Numero"
              :error-messages="errors.nosso_numero"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-if="boleto.nosso_numero === ''"
              v-model="boleto.placa"
              v-mask="['XXXXXXX']"
              label="Placa"
              :error-messages="errors.placa"
              :loading="carregando"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          outlined
          color="primary"
          @click="consultarBoleto"
        >
          Consultar
        </v-btn>
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
import SPagebar from '@/layout/SPagebar.vue'
import PromptDialog from '@/components/PromptDialog.vue'

export default {
  name: 'BoletoConsulta',
  components: { SPagebar, PromptDialog },
  data: () => ({
    carregando: false,
    breadcrumbs: [
      {
        'text': 'Consultar boleto',
        'disabled': true
      }
    ],
    boleto: {
      nosso_numero: '',
      placa: ''
    },
    errors: {},
  }),
  methods: {
    consultarBoleto() {
      this.carregando = true
      const response = this.$api.create({
          resource: this.$endpoints.CONSULTAR_BOLETO,
          data: this.boleto
      });
      response
        .then((res)=>{
          this.$toast.open({
              message: res.data.message,
              type: 'success',
          })
        })
        .catch((error) => {
          this.errors = this.handleError(error);
        })
        .finally(()=>{
          this.carregando = false;
        })
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