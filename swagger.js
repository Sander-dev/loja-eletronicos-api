const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Estoque de Loja de Eletrônicos",
      version: "1.0.0",
      description: "Documentação da API para gerenciar o estoque de uma loja de eletrônicos",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID do produto",
            },
            name: {
              type: "string",
              description: "Nome do produto",
            },
            price: {
              type: "number",
              description: "Preço do produto",
            },
            stockQuantity: {
              type: "number",
              description: "Quantidade em estoque",
            },
            description: {
              type: "string",
              description: "Descrição do produto",
            },
            category: {
              type: "string",
              description: "Categoria do produto",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação do produto",
            },
          },
          required: ["name", "price", "stockQuantity"],
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
