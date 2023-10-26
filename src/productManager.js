import { promises as fs } from 'fs';

class IDGenerator {
    constructor() {
        this.counter = 0;
        this.usedIDs = new Set();
    }

    generateUniqueID() {
        let newID;
        do {
            newID = ++this.counter; 
        } while (this.usedIDs.has(newID)); 

        this.usedIDs.add(newID); 
        return newID;
    }
}

class Product {
    constructor (id, title, description, price, thumbnail, code, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor() {
        this.route = "products.json"
        this.products = [];
        this.idGenerator = new IDGenerator();
    }

    async reset() {
        this.products = [];
        await this.writeProducts();
    }

    async readProducts(){
        try {
            const content = await fs.readFile(this.route, "utf-8");
            const productsJson = JSON.parse(content); 
            this.products = productsJson
        } catch (error) {
            console.error("Error al leer el archivo JSON:", error);
        }
    };

    async writeProducts(){
        const productsJson = JSON.stringify(this.products, null, 2);
        await fs.writeFile(this.route, productsJson);
    };

    async addProduct(title, description, price, thumbnail, code, stock){
        await this.readProducts()
        const codeExists = this.products.some(product => product.code === code)
        if (codeExists){
            console.error("A product with this code already exists")
        }else if(!title || !description || !price || !thumbnail || !code || !stock){
            console.error("All fields are required")
        }else{
            const id = this.idGenerator.generateUniqueID();
            const product = new Product(id, title, description, price, thumbnail, code, stock);
            this.products.push(product);
            await this.writeProducts()
        }
    }

    async getProducts(){
        await this.readProducts();
        console.log(this.products);
        return this.products
    }

    async getProductById(id){
        await this.readProducts();
        const productFound = this.products.find(product => product.id === Number(id))
        if(productFound){
            console.log(productFound)
            await this.writeProducts();
            return productFound;
        }else{
            throw new Error("There isn't a product with that id")
        }
    }
    
    async deleteProduct(id){
        await this.readProducts();
        const index = this.products.findIndex(product => product.id === Number(id))
        if(index !== -1){
            const deletedProduct = this.products.splice(index, 1);
            await this.writeProducts();
            return deletedProduct;
        }else{
            throw new Error("Delete error: Product not found");
        }
        
    }

    async updateProduct(id, paramName, newValue){
        await this.readProducts();
        const index = this.products.findIndex(product => product.id === Number(id));
        if(index !== -1){
            this.products[index][paramName] = newValue;
            await this.writeProducts();
            return this.products[index];
        }else{
            throw new Error("Update error: Product not found");
        }
        
    }
}

    export const manager = new ProductManager();
    //testeo
    (async () => {

        await manager.reset();
        await manager.getProducts();
        await manager.addProduct("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
        await manager.getProducts();
        /*manager.addProduct("producto prueba", "este es un producto prueba", 200, "sin imagen", "abc123", 25);
        manager.addProduct("producto prueba", "este es un producto prueba", 200, "sin imagen", "abc124");
        await manager.getProductById(1);*/
        manager.addProduct("producto prueba b", "este es un producto prueba b", 300, "sin imagen", "abc125", 25);
        await manager.getProducts();
        /*await manager.getProductById(2);
        await manager.deleteProduct(1);
        await manager.getProducts();
        await manager.updateProduct(2, 'price', 30);
        await manager.getProducts();*/
    })();

    