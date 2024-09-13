const express = require('express');
const app = express();
const productsRouter = require('./routes/products');
const swaggerSetup = require("./swagger");

// Middleware para JSON
app.use(express.json());

// Rotas de Produtos
app.use('/api', productsRouter);

// Configuração do Swagger
swaggerSetup(app);

// Iniciar o Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
