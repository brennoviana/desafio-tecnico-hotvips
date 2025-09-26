# HotVips - Sistema de Comentários

Sistema de comentários robusto e escalável desenvolvido com AdonisJS, TypeScript e PostgreSQL. Suporta comentários hierárquicos, moderação e soft delete.

## Características

- **API RESTful** completa para gerenciamento de comentários
- **Comentários hierárquicos** com suporte a respostas (parent/child)
- **Sistema de moderação** com status de aprovação
- **Soft delete** para preservação de dados
- **Validação robusta** de entrada de dados
- **Arquitetura em camadas** (Controller → Service → Repository)
- **Docker** para desenvolvimento e produção
- **Collection Postman** incluída para testes

## Requisitos

- **Node.js** 22+
- **PostgreSQL** 17+
- **Docker** (opcional, mas recomendado)
- **npm**

## Instalação

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

# A aplicação estará disponível em http://localhost:3333
```

## Testes

```bash
# Executar todos os testes
node ace test
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

## URL de Teste

Para testar a API diretamente, você pode usar a URL disponibilizada:

**URL de Teste:** http://34.55.170.193:3333/api/v1

## Collection Postman

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

## Decisões Técnicas

### Arquitetura
- **AdonisJS** como framework principal pela robustez e convenções claras
- **TypeScript** para tipagem estática e melhor manutenibilidade
- **PostgreSQL** para suporte nativo a relacionamentos hierárquicos
- **Arquitetura em camadas** (Controller → Service → Repository) para separação de responsabilidades com DIP

### Banco de Dados
- **Soft delete** para preservar histórico de comentários
- **Índices** em `postId` e `parentId` para otimizar consultas hierárquicas
- **Status de moderação** para controle de aprovação de comentários
- **Relacionamento self-referencing** para comentários aninhados

### Desenvolvimento
- **Docker** para ambiente consistente entre desenvolvimento e produção
- **Npm** como gerenciador de pacotes para performance
- **Testes funcionais** com Jest para garantir qualidade
- **Collection Postman** para documentação e testes da API