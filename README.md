# 📖 API Diário Pessoal

Uma API REST desenvolvida para gerenciamento de anotações pessoais, permitindo que usuários criem, consultem, atualizem e removam entradas de um diário de forma segura através de autenticação com JWT.

## ✨ Funcionalidades

* Cadastro de usuários
* Login com autenticação JWT
* CRUD completo de anotações
* Associação entre usuários e suas anotações
* Filtros de busca
* Paginação de resultados
* Banco de dados PostgreSQL

## 🛠 Tecnologias

* Node.js
* Express.js
* PostgreSQL
* JWT (JSON Web Token)
* bcrypt
* dotenv
* pg

## 📂 Estrutura do projeto

```text
src/
├── controllers/
├── middleware/
├── repository/
├── routes/
├── services/
├── database.js
└── app.js

server.js
```

## 🚀 Como executar

### 1. Clone o repositório

```bash
git clone https://github.com/debonadebora-commits/API-diario-pessoal.git
cd API-diario-pessoal
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env`:

```env
PORT=3000
DB_URL=sua_connection_string
JWT_SECRET=sua_chave_secreta
```

### 4. Configure o banco de dados

Execute os scripts SQL para criação das tabelas do projeto.

### 5. Inicie a aplicação

```bash
npm start
```

Servidor disponível em:

```text
http://localhost:3000
```

## 📡 Endpoints

### Usuários

| Método | Endpoint    | Descrição           |
| ------ | ----------- | ------------------- |
| POST   | `/cadastrar`| Cadastro de usuário |
| POST   | `/login`    | Login               |

### Anotações

| Método | Endpoint         |
| ------ | ---------------- |
| GET    | `/anotacoes`     |
| GET    | `/anotacoes/:id` |
| POST   | `/anotacoes`     |
| PATCH  | `/anotacoes/:id` |
| DELETE | `/anotacoes/:id` |

> As rotas de anotações exigem autenticação via JWT.

## 🔒 Autenticação

Envie o token JWT no cabeçalho das requisições:

```http
Authorization: Bearer SEU_TOKEN
```

## 🌐 Deploy

API hospedada utilizando:

* Render (API)
* Neon (PostgreSQL)

## 📚 Objetivo

Este projeto foi desenvolvido como parte dos estudos de desenvolvimento backend, com foco em:

* Arquitetura de APIs REST
* Modelagem de banco de dados
* Autenticação
* Organização de código
* Deploy em produção

## 👩‍💻 Autora

Débora

GitHub:
https://github.com/debonadebora-commits
