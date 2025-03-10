import http from '@/services/config'

export const emitirSegundaVia = nossoNumero => {
  return http.post('api/boleto/segunda_via/', {"nosso_numero":nossoNumero}, {
    responseType: 'blob'
  })
}