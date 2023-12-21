//backend page prthon ati dite hobe.
const express = require('express');
//clind side r backend link ar jonno
const cors = require('cors');
//mondgobd sathe link ar jonno import korte hobe
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//bacnend data load hocche ki natai dekhbe.
const app = express();
//env dataload ar jono
require("dotenv").config();
//bacnend port
const port = process.env.PORT || 5000;

//middle were data bancend get koror jonno.
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.uruvxpx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const database = client.db("froutsDB");
        const ProductCollection = database.collection("products");
        const CartCollectuon = database.collection('cards');
        const OrdersCollectuon = database.collection('orders');
        const UsersCollection = database.collection('users');

        //start out Project-->

        app.get('/products', async(req, res) => {
            const couser = ProductCollection.find();
            const result = await couser.toArray()
            res.send(result)
        });

        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await ProductCollection.findOne(query);
            res.send(result)
        });
        app.get('/productscategory', async(req, res) => {

            const category = req.query.category;
            const price = req.query.price;

            const queryObj = {};
            if (category) {
                queryObj.category = category;
            }
            const couser = ProductCollection.find(queryObj);
            const result = await couser.toArray();

            res.send(result)
        });
        app.get('/products/category/:brand', async(req, res) => {
            const brand = req.params.brand;
            us
            const catehgory = {
                category: brand
            }
            const result = await ProductCollection.find(catehgory).toArray();
            res.send(result)
        })
        app.get('/cards', async(req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await CartCollectuon.find(query).toArray();
            res.send(result)
        })
        app.post('/cards', async(req, res) => {
            const item = req.body;
            const result = await CartCollectuon.insertOne(item);
            res.send(result)
        });
        app.delete('/cards/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await CartCollectuon.deleteOne(query);
            res.send(result)
        });
        app.get('/orders', async(req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await OrdersCollectuon.find(query).toArray();
            res.send(result)
        })
        app.post('/orders', async(req, res) => {
            const item = req.body;

            const orders = await OrdersCollectuon.insertOne(item);
            const query = {
                _id: {
                    $in: item.cardsid.map(id => new ObjectId(id))
                }
            }
            const cardsclear = await CartCollectuon.deleteMany(query);

            res.send({ orders, cardsclear })

        });
        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await UsersCollection.insertOne(user);
            res.send(result)

        });

        // app.post('/products', async(req, res) => {
        //     const productitem = req.body;
        //     const result = await ProductCollection.insertOne(productitem);
        //     res.send(result);
        // });
        // app.put('/products/:id', async(req, res) => {
        //     const id = req.params.id;
        //     const item = req.body;
        //     const filter = { _id: new ObjectId(id) }
        //     const options = { upsert: true };
        //     const updateitem = {
        //         $set: {
        //             name: item.name,
        //             Brand: item.Brand,
        //             Price: item.Price,
        //             photo: item.photo,
        //             rating: item.rating,
        //             description: item.description,
        //             categoryitem: item.categoryitem,
        //         }
        //     };
        //     const result = await ProductCollection.updateOne(filter, updateitem, options);
        //     res.send(result)

        // });
        // app.get('/cards/:email', async(req, res) => {
        //     const emailid = req.params.email;
        //     const query = { email: emailid };
        //     const course = ProductCollection.find(query);
        //     const result = await course.toArray();
        //     res.send(result)
        // });





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`
Example app listening on port ${port}
`)
})