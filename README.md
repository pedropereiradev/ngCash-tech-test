# NG.Cash Teste técnico

Este projeto consiste em uma aplicação full-stack onde a pessoa usuária pode 
realizar transações entre outras pessoas da plataforma.
Além de visualizar as transações que está participando, também é possível filtra-las
de acordo com seu tipo (Cash-in ou Cash-Out) e/ou pelo dia da transação. Ao criar a conta
a pessoa "ganha" um saldo de 100 reais para utilizar nas transações.
## Stack utilizada

**Front-end:** React, Typescript, Axios, MaterialUI, react-calendar, 
react-hook-form, react-router-dom

**Back-end:** Node, Typescript, Sequelize, postgreSQL, Express, http-status-codes,
JWT, BcryptJS

**Testes:** Jest, React Testing Library, Mocha, Chai, Sinon, chai-http, nyc

**Ambiente:** Docker, EsLint, Cors
 

## Rodando localmente

Clone o projeto

```bash
  git clone git@github.com:pedropereiradev/ngCash-tech-test.git
```

Entre no diretório do projeto

```bash
  cd ngCash-tech-test
```

+ Utilizando Docker:
```bash
npm run compose:up
```

+ Rodando somente o servidor com Docker:

```bash
  docker run --name ngCash-db -e POSTGRES_PASSWORD=123456 
  -e POSTGRES_USER=root -p 3002:5432 -d postgres
```
```bash
  npm i
  cd app/backend && npm i && npm start 
  cd app/frontend && npm i && npm start
```

## Funcionalidades

- Login
- Criar conta
- Realizar transações entre pessoas usuárias
- Visualizar transações realizadas
- Filtrar transações por Cash-in ou Cash-out
- Filtrar transações por dia


## Referências

 - [React](https://reactjs.org/)
 - [Typescript](https://www.typescriptlang.org/)
 - [Axios](https://axios-http.com/)
 - [Material UI](https://mui.com/)
 - [react-calendar](https://github.com/wojtekmaj/react-calendar#readme)
 - [react-hook-form](https://react-hook-form.com/)
 - [react-router-dom](https://reactrouter.com/en/main)
 - [Sequelize](https://sequelize.org/)
 - [Express](https://expressjs.com/)
 - [http-status-codes](https://github.com/prettymuchbryce/http-status-codes)
 - [JWT](https://github.com/auth0/node-jsonwebtoken#readme)
 - [BCryptJS](https://github.com/dcodeIO/bcrypt.js#readme)
 - [Docker](https://docs.docker.com/)
 - [ESLint](https://eslint.org/)
 - [Jest](https://jestjs.io/pt-BR/)
 - [Chai](https://www.chaijs.com/)
 - [Sinon](https://sinonjs.org/)
 - [Mocha](https://mochajs.org/)


## Documentação da API

+ [**Login**](#login)
    + [Logar](#fazer-login)

+ [**User**](#usuario)
    + [Cadastrar](#fazer-cadastro)
    + [Listar todos](#retorna-todos-usuarios)
    + [Listar um](#retorna-um-usuario)

+ [**Account**](#contas)
    + [Pegar saldo p. usuária](#retorna-saldo-conta)

+ [**Transaction**](#transacao)
    + [Criar](#cria-transacao)
    + [Listar todos](#retorna-todas-transacoes)

### Login

#### Fazer login
```http
  POST /login
```

+ Request (application/json)
    + Body

            {
                "username": "Teste",
                "password": "Ng123456",
            }


+ Response 200 (application/json)
    + Body

            {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjo1LCJkaXNwbGF5TmFtZSI6InVzdWFyaW8gZGUgdGVzdGUiLCJlbWFpbCI6InRlc3RlQGVtYWlsLmNvbSIsImltYWdlIjoibnVsbCJ9LCJpYXQiOjE2MjAyNDQxODcsImV4cCI6MTYyMDY3NjE4N30.Roc4byj6mYakYqd9LTCozU1hd9k_Vw5IWKGL4hcCVG8"
            }

+ If request without all filled fields
+ Response 400 (application/json)
    + Body

            {
                "message": "Invalid username or password"
            }

+ If invalid email or passowrd
+ Response 400 (application/json)
    + Body

            {
                "message": "Invalid username or password"
            }


### Usuario
#### Fazer cadastro
```http
  POST /user
```

+ Request (application/json)
    + Body

            {
                "username": "Teste",
                "password": "Ng123456",
            }


+ Response 200 (application/json)
    + Body

            {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjo1LCJkaXNwbGF5TmFtZSI6InVzdWFyaW8gZGUgdGVzdGUiLCJlbWFpbCI6InRlc3RlQGVtYWlsLmNvbSIsImltYWdlIjoibnVsbCJ9LCJpYXQiOjE2MjAyNDQxODcsImV4cCI6MTYyMDY3NjE4N30.Roc4byj6mYakYqd9LTCozU1hd9k_Vw5IWKGL4hcCVG8"
            }

+ Se `username` menor que 3 caracteres
+ Response 400 (application/json)
    + Body

            {
                 "message": "Invalid username or password"
            }

+ Se `password` menor que 8 caracteres e/ou sem 1 letra maiúscula e/ou sem 1 número
+ Response 400 (application/json)
    + Body

            {
                 "message": "Invalid username or password"
            }

+ Se `username` já existe
+ Response 409 (application/json)
    + Body

            {
                 "message": "Username already exists"
            }

#### Retorna todos usuarios
```http
  GET /user/all
```
+ Request (application/json)
     + Headers

            {
                "authorization": "[Token]"
            }

+ Response 200 (application/json)
    + Body
  
            [
                {
                    "username": "Teste",
                    "accountId": "3fdc485c-4bcc-4352-8f2f-ff0cee897dca",
                },
                /* ... */
            ]

+ Se nao existir token ou estiver inválido
+ Response 401 (application/json)
     + Body

            {
                 "message": "Expired or invalid token"
            }

#### Retorna um usuario
```http
  GET /user
```

+ Request (application/json)
     + Headers

            {
                "authorization": "[Token]"
            }

+ Response 200 (application/json)
    + Body

           {
                "username": "Teste",
                "accountId": "3fdc485c-4bcc-4352-8f2f-ff0cee897dca",
            },


+ Se nao existir token ou estiver inválido
+ Response 401 (application/json)
     + Body

            {
                 "message": "Expired or invalid token"
            }

### Contas
#### Retorna saldo conta
```http
  GET /account/balance
```

+ Request (application/json)
     + Headers

            {
                "authorization": "[Token]"
            }

+ Response 200 (application/json)
    + Body

            {
                "id": "a41804eb-5992-4626-b764-bb405bd3f378",
                "balance": 100
            },
                
            

+ Se nao existir token ou estiver inválido
+ Response 401 (application/json)
     + Body

            {
                 "message": "Expired or invalid token"
            }

### Transacao
#### Cria transacao
```http
  POST /transaction
```

+ Request (application/json)
     + Headers

            {
                "authorization": "[Token]"
            }
    + Body

            {
                "originAccount": "a41804eb-5992-4626-b764-bb405bd3f378",
                "destinationAccount": "a41804eb-5992-4626-b764-bb405bd3f378",
                "value": 150
            }
+ Response 201 (application/json)
    

+ Se valor a ser transferido for maior que saldo da conta 
+ Response 400 (application/json)
    + Body

            {
                "message": "Credited value can not be greater than your balance"
            }

+ Se nao existir token ou estiver inválido
+ Response 401 (application/json)
     + Body

            {
                 "message": "Expired or invalid token"
            }

#### Retorna todas transacoes
```http
  GET /transaction?transactionType=''&date=''
```

| Query   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `transactionType` | `string` | Filtra por Cash-in ou Cash-out |
| `date` | `string` | Filtra por dia da transação |

+ Request (application/json)
     + Headers

            {
                "authorization": "[Token]"
            }

+ Response 200 (application/json)
    + Body

            [
                {
                    "id": "a41804eb-5992-4626-b764-bb405bd3f378",
                    "debitedAccountId": "a41804eb-5992-4626-b764-bb405bd3f378",
                    "CreditedAccountId": "a41804eb-5992-4626-b764-bb405bd3f378",
                    "value": 47,
                    "createdAt": "2022-11-21T00:00:00",
                    "transactionDate": "2022-11-21",
                },
                
                /* ... */
            ]

+ Se nao existir token ou estiver inválido
+ Response 401 (application/json)
     + Body

            {
                 "message": "Expired or invalid token"
            }
