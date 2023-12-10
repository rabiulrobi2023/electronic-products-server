const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bta6ici.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();
    
        const productCollection = client.db('assignment-10').collection('products')
        const cartCollection = client.db('assignment-10').collection('cart')

        app.post("/products", async (req, res) => {
            const newproducts = req.body;
            const result = await productCollection.insertOne(newproducts)
            res.send(result)
        })

        app.get("/products", async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get("/products/:brand", async (req, res) => {
            const brand = req.params.brand;
            const query = { brand: brand }
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get("/single-product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            console.log(result)
            res.send(result)
        })

        // ===========Update Product===========
        app.put("/products/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatePorductData = req.body;
            const product = {
                $set: {
                    name: updatePorductData.name,
                    brand: updatePorductData.brand,
                    category: updatePorductData.category,
                    price: updatePorductData.price,
                    rating: updatePorductData.rating,
                    image: updatePorductData.image,
                    description: updatePorductData.description
                },
            }
            const result = await productCollection.updateOne(filter, product, options)
            res.send(result)

        })


        // =================================cart========================
        app.post("/cart", async (req, res) => {
            const newCart = req.body;
            const result = await cartCollection.insertOne(newCart)
            res.send(result)
        })

        app.get("/cart", async (req, res) => {
            const cursor = cartCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete("/cart/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
            res.send(result)
        })




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {

        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server Is Running")
})

app.listen(port, () => {
    console.log(`Server is running on port:${port}`)

})

