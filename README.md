# Projeto Lavajato Frontend

Este projeto é o front-end do sistema Lavajato, desenvolvido em Vue.js. Ele se comunica com o back-end para gerenciar os agendamentos de lavagem e utiliza componentes do Vuetify para a interface, além de outros plugins para máscaras, notificações e muito mais.

---

## Pré-requisitos

- **Node.js** (versão LTS recomendada, ex.: v16 ou superior)  
- **npm** ou **yarn**  
- **Git**

---

## Estrutura do Projeto

A estrutura do projeto (exemplo):

```
lavamajato-frontend2.0/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── assets/                  # Arquivos estáticos (imagens, fontes, etc.)
│   ├── common/
│   │   └── endpoints.js         # Endpoints para comunicação com o back-end
│   ├── components/              # Componentes Vue reutilizáveis (ex.: PromptDialog.vue)
│   ├── layout/                  # Componentes de layout (ex.: SAppbar.vue, SToolbar.vue)
│   ├── router/                  # Configuração do Vue Router
│   ├── store/                   # Gerenciamento de estado (Vuex)
│   ├── views/                   # Páginas do sistema (ex.: Login.vue, LavagemCreate.vue, AgendamentoList.vue)
│   └── main.js                  # Ponto de entrada da aplicação
├── package.json
└── README.md
```

---

## Passo a Passo para Configuração do Front-End

### Passo 1: Clone o Repositório

Abra o terminal e execute:

```bash
git clone https://github.com/SEU_USUARIO/lavajato-frontend2.0.git
cd lavamajato-frontend2.0
```

### Passo 2: Instale as Dependências

Instale as dependências do projeto com o npm (ou yarn):

```bash
npm install
```

> **Observação:**  
> A pasta **node_modules/** não deve ser versionada. Ela será gerada automaticamente a partir do **package.json**.

### Passo 3: Configurar Variáveis de Ambiente (Opcional)

Se o seu projeto utilizar variáveis de ambiente (por exemplo, para definir a URL do back-end), crie um arquivo `.env` na raiz do projeto. Um exemplo:

```env
VUE_APP_API_BASE_URL=http://localhost:8000
```

> **Observação:**  
> Variáveis definidas com o prefixo `VUE_APP_` são disponibilizadas no código do Vue.

### Passo 4: Execute o Servidor de Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run serve
```

O projeto será compilado e, se não houver erros, você poderá acessá-lo em [http://localhost:8080/](http://localhost:8080/).


Verifique se a URL base do back-end está definida corretamente no serviço genérico (HttpGeneric) para que as requisições sejam enviadas para o back-end.

---

## Observações Adicionais

- **Compilação e Hot Reload:**  
  O Vue CLI fornece hot reload para facilitar o desenvolvimento. Qualquer alteração nos arquivos será refletida automaticamente no navegador.

- **Testes e Lint:**  
  Você pode rodar testes unitários (se configurados) e verificar a formatação do código com os comandos definidos no package.json.

- **Documentação:**  
  Consulte a [documentação do Vue.js](https://vuejs.org/) e [Vuetify](https://vuetifyjs.com/) para mais detalhes sobre o desenvolvimento da interface.

---
