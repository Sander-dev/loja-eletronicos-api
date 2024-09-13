const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Cria um novo produto
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stockQuantity
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID do produto
 *               name:
 *                 type: string
 *                 description: Nome do produto
 *               price:
 *                 type: number
 *                 description: Preço do produto
 *               stockQuantity:
 *                 type: number
 *                 description: Quantidade em estoque
 *               description:
 *                 type: string
 *                 description: Descrição do produto
 *               category:
 *                 type: string
 *                 description: Categoria do produto
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: Data de criação do produto
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Requisição inválida
 */
router.post('/products', async (req, res) => {
  const { id, name, price, stockQuantity, description, category, createdAt } = req.body;
  
  if (!name || price === undefined || stockQuantity === undefined) {
    return res.status(400).json({ error: 'Nome, preço e quantidade em estoque são obrigatórios.' });
  }
  if (price < 0) {
    return res.status(400).json({ error: 'O preço não pode ser negativo.' });
  }
  
  const product = { _id: id, name, price, stockQuantity, description, category, createdAt: createdAt || new Date().toISOString() };

  try {
    const response = await db.put(product);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o produto.' });
  }
});

// Lista todos os produtos
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Categoria do produto
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Preço mínimo do produto
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Preço máximo do produto
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de itens por página
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/products', async (req, res) => {
    const { category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
  
    try {
      const allDocs = await db.allDocs({ include_docs: true });
      let products = allDocs.rows.map(row => row.doc);
  
      // Filtragem
      if (category) {
        products = products.filter(product => product.category === category);
      }
  
      // Filtragem
      if (minPrice) {
        products = products.filter(product => product.price >= parseFloat(minPrice));
      }
  
      if (maxPrice) {
        products = products.filter(product => product.price <= parseFloat(maxPrice));
      }
  
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const endIndex = startIndex + parseInt(limit);
      const paginatedProducts = products.slice(startIndex, endIndex);
  
      res.status(200).json({
        total: products.length,
        page: parseInt(page),
        limit: parseInt(limit),
        data: paginatedProducts
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
  });
  
// Leitura de Produto por ID
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retorna um produto específico pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const product = await db.get(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: 'Produto não encontrado.' });
  }
});

// Atualização de Produto
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto existente pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do produto
 *               price:
 *                 type: number
 *                 description: Preço do produto
 *               stockQuantity:
 *                 type: integer
 *                 description: Quantidade em estoque
 *               description:
 *                 type: string
 *                 description: Descrição do produto
 *               category:
 *                 type: string
 *                 description: Categoria do produto
 *             required:
 *               - name
 *               - price
 *               - stockQuantity
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Requisição inválida
 *       404:
 *         description: Produto não encontrado
 */

router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, stockQuantity, description, category } = req.body;
  
  try {
    const product = await db.get(id);
    
    if (!name || price === undefined || stockQuantity === undefined) {
      return res.status(400).json({ error: 'Nome, preço e quantidade em estoque são obrigatórios.' });
    }
    if (price < 0) {
      return res.status(400).json({ error: 'O preço não pode ser negativo.' });
    }

    const updatedProduct = { ...product, name, price, stockQuantity, description, category };
    const response = await db.put(updatedProduct);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ error: 'Produto não encontrado.' });
  }
});

// Remoção de Produto
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove um produto pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const product = await db.get(id);
    const response = await db.remove(product);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ error: 'Produto não encontrado.' });
  }
});

module.exports = router;
