import express from 'express';
import { manager } from './productManager.js';

const app = express()

app.listen(8080, () => {
    console.log('conectado al puerto 8080!')
    })

app.get('/products/:id', async (req, res) => {
    const productId = parseInt(req.params['id'])
    const ProductFound = await manager.getProductById(productId)
    if (ProductFound) {
        res.json({ Product: ProductFound })
    } else {
        res.json({ error: `There isn't a product with id:  ${productId}` })
    }
})


app.get('/products', async (req, res) => {
    const perPage = parseInt(req.query.limit);
    if (perPage) {
        const products = await manager.getProducts()
        const perPageProducts = products.slice(0, perPage)
        res.json({
            Limit: perPage,
            Products : perPageProducts
        })
        } else {
        res.json({
            products: await manager.getProducts()
        })
        }
})

