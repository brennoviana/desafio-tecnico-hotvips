# HotVips - Sistema de Comentários

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![AdonisJS](https://img.shields.io/badge/AdonisJS-6.x-purple.svg)](https://adonisjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-UNLICENSED-red.svg)]()

Sistema de comentários robusto e escalável desenvolvido com AdonisJS, TypeScript e PostgreSQL. Suporta comentários hierárquicos, moderação e soft delete.

## 🚀 Características

- **API RESTful** completa para gerenciamento de comentários
- **Comentários hierárquicos** com suporte a respostas (parent/child)
- **Sistema de moderação** com status de aprovação
- **Soft delete** para preservação de dados
- **Validação robusta** de entrada de dados
- **Arquitetura em camadas** (Controller → Service → Repository)
- **Docker** para desenvolvimento e produção
- **Collection Postman** incluída para testes

## 📋 Índice

- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [Docker](#docker)
- [Collection Postman](#collection-postman)

## 💻 Requisitos

- **Node.js** 22+
- **PostgreSQL** 12+
- **Docker** (opcional, mas recomendado)
- **npm**

## 🔧 Instalação

### Opção 1: Com Docker (Recomendado)

```bash
# Clone o repositório
git clone <repository-url>
cd desafio-tecnico-hotvips

# Configure as variáveis de ambiente
cp .env.docker.example .env

# Execute com Docker Compose
docker-compose up -d

# A aplicação estará disponível em http://localhost:3333
```

### Opção 2: Instalação Local

```bash
# Clone o repositório
git clone <repository-url>
cd desafio-tecnico-hotvips

# Configure as variáveis de ambiente
cp .env.local.example .env

# Instale as dependências
npm install

# Configure o banco de dados PostgreSQL
# Certifique-se de que o PostgreSQL está rodando na porta 5432

# Execute as migrações
node ace migration:run

# Inicie o servidor de desenvolvimento
npm run dev
```

### Banco de Dados

O projeto utiliza PostgreSQL com a seguinte estrutura de tabela:

```sql
CREATE TABLE comments (
  commentId SERIAL PRIMARY KEY,
  postId INTEGER NOT NULL,
  authorId INTEGER NOT NULL,
  text VARCHAR(1024) NOT NULL,
  parentId INTEGER REFERENCES comments(commentId),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false
);
```

## 🎯 Uso

### Iniciando o Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start

# Com Docker
docker-compose up
```

O servidor estará disponível em `http://localhost:3333`

### Arquitetura em Camadas

1. **Controller**: Gerencia requisições HTTP e respostas
2. **Service**: Contém a lógica de negócio
3. **Repository**: Abstrai o acesso ao banco de dados
4. **Model**: Representa entidades do banco de dados
5. **Validator**: Valida dados de entrada

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes unitários
npm run test:unit

# Executar testes funcionais
npm run test:functional

# Executar com cobertura
npm run test:coverage
```

## 🐳 Docker

### Desenvolvimento com Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs da aplicação
docker-compose logs -f app

# Parar serviços
docker-compose down

# Rebuild da aplicação
docker-compose up --build app
```

## 📮 Collection Postman

O projeto inclui uma collection completa do Postman (`HotVips.postman_collection.json`) com todos os endpoints configurados.

### Importando a Collection

1. Abra o Postman
2. Clique em "Import"
3. Selecione o arquivo `HotVips.postman_collection.json`
4. A collection "HotVips" será criada com todos os endpoints

### Endpoints na Collection

- ✅ **Create comment** - Criar novo comentário
- ✅ **Get comments** - Listar comentários de um post
- ✅ **Get comments Pending** - Listar comentários pendentes
- ✅ **Edit comment** - Editar texto do comentário
- ✅ **Approve or reject comment** - Moderar comentário
- ✅ **Delete comment** - Deletar comentário (soft delete)

### Configuração de Variáveis

A collection está configurada para usar:
- **Base URL**: `http://localhost:3333/api/v1`
- **Variáveis de exemplo**: `postId`, `commentId`

## 🔄 Fluxo de Moderação

1. **Criação**: Comentários são criados com status `pending` por padrão
2. **Moderação**: Aprovar (`approved`) ou rejeitar (`rejected`)
3. **Visualização**: Apenas comentários aprovados são exibidos publicamente
4. **Pendentes**: Endpoint específico para listar comentários aguardando moderação


## 🔒 Segurança

- **Validação rigorosa** de todos os inputs
- **Soft delete** para preservação de dados
- **Sanitização** de strings
- **Validação de relacionamentos** (parent/child)