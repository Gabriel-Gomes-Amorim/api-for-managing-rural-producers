# Gerenciamento de Produtores Rurais 🌱

Este projeto é uma API para gerenciar o cadastro de produtores rurais e suas propriedades. Ele foi desenvolvido utilizando **NestJS**, **PostgreSQL**, **Docker** e **Prisma**, seguindo as melhores práticas de **Clean Architecture**, código limpo e modularidade, garantindo escalabilidade e fácil manutenção.

## 🚀 Tecnologias Utilizadas

- **NestJS** - Framework Node.js para construção de APIs escaláveis
- **PostgreSQL** - Banco de dados relacional
- **Prisma ORM** - Gerenciamento e modelagem do banco de dados
- **Docker** - Containerização para facilitar o deploy e ambiente de desenvolvimento
- **Jest** - Testes unitários com repositórios mockados

## 📌 Funcionalidades

A API permite gerenciar produtores rurais e suas propriedades, garantindo a integridade dos dados e fornecendo métricas para análise.

✅ **Módulos Implementados:**

- **Producers** - Cadastro e gerenciamento de produtores rurais
- **Farms** - Cadastro e gerenciamento de propriedades rurais
- **Harvests** - Registro de safras por fazenda
- **Plantations** - Culturas plantadas vinculadas às safras
- **Dashboard** - O módulo Dashboard exibe informações chave sobre as fazendas cadastradas:  
  total de fazendas, total de hectares, distribuição de fazendas por estado, cultura plantada e uso do solo.

✅ **Regras de Negócio:**

- Validação de **CPF/CNPJ**
- Garantia de que a **área agricultável + vegetação não ultrapasse a área total da fazenda**
- Um produtor pode ter **múltiplas fazendas**
- Uma fazenda pode ter **várias culturas plantadas por safra**

<!-- ✅ **Dashboard:**

- Total de fazendas cadastradas
- Total de hectares registrados
- Gráficos de pizza:
  - **Distribuição de fazendas por estado**
  - **Distribuição de culturas plantadas**
  - **Uso do solo (área agricultável x vegetação)** -->

## 🛠️ Como rodar o projeto

```bash
# Copie o arquivo .env.example para .env
cp .env.example .env

# Suba o banco de dados no Docker
docker compose up -d

# Execute as migrations do Prisma
npx prisma migrate dev  # Para desenvolvimento
# ou
npx prisma migrate deploy  # Para produção

# Inicie a aplicação em modo de desenvolvimento
npm run start:dev

# Para rodar em produção
npm run start:prod
```

## 📑 Documentação da API (Swagger)

A API utiliza o **Swagger** para documentação interativa. Você pode acessar a documentação gerada automaticamente a partir da URL:

http://localhost:${porta-da-api-configurada}/api

Ao acessar essa URL, você poderá explorar todos os endpoints da API, visualizar exemplos de requisições e respostas, e até realizar testes diretamente pela interface do Swagger.

Certifique-se de substituir `${porta-da-api-configurada}` pela porta que você configurou no seu projeto.
