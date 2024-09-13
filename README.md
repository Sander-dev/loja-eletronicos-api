# API de Estoque de Loja de Eletrônicos

Esta é uma API para gerenciar o estoque de uma loja de eletrônicos, construída com Node.js, Express e PouchDB.

## Instruções de Instalação

1. Clone o repositório:

git clone https://github.com/Sander-dev/loja-eletronicos-api.git

2. Instale as dependências:

npm install

3. Execute o servidor:

npm start

## Rotas da API

- **POST /api/products**: Adicionar um novo produto ao estoque.
- **GET /api/products**: Retornar uma lista de todos os produtos no estoque.
- **GET /api/products/:id**: Retornar um produto específico pelo seu ID.
- **PUT /api/products/:id**: Atualizar as informações de um produto existente com base no seu ID.
- **DELETE /api/products/:id**: Remover um produto do estoque com base no seu ID.

- Filtragem por categoria ou faixa de preço na rota GET `/products`.
- Paginação nos resultados da rota GET `/products`.


