import axios from 'axios'

const semob = axios.create({
  baseURL: process.env.VUE_APP_API_SEMOB,
  headers: {
    Authorization: process.env.VUE_APP_TOKEN,
  }
})

export const buscarVeiculo = async data => {
  return semob.post('veiculo/', data)
}

export const buscarVeiculoChassi = async data => {
  return semob.post('/veiculo/chassi/', data)
}

export const buscarCondutor = async cpf => {
  return semob.post('condutor/', {cpf: cpf})
}
