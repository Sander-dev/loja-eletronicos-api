const express = require('express');
const app = express();
const productsRouter = require('./routes/products');
const swaggerSetup = require("./swagger");

app.use(express.json());

app.use('/api', productsRouter);

swaggerSetup(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
