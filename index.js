const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;


app.use(cors({
    origin: ['https://task-management-94ca8.web.app', 'https://task-management-94ca8.firebaseapp.com'],
    // origin: ['http://localhost:5173', 'http://localhost:5174'],

}))
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
        const database = client.db("TaskDB");
        const TaskCollection = database.collection("task");


        // start out Project-- >
        app.get('/task', async(req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await TaskCollection.find(query).toArray();
            res.send(result)
        });
        app.get('/task/:id', async(req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            }
            const result = await TaskCollection.find(query).toArray();
            res.send(result)
        });
        app.post('/addtask', async(req, res) => {
            const item = req.body;
            const result = await TaskCollection.insertOne(item);
            res.send(result)
        });
        app.patch("/task/:id", async(req, res) => {
            const id = req.params.id;
            const data = req.body;

            const filter = { _id: new ObjectId(id) }

            const updateitem = {
                $set: {
                    title: data.title,
                    dec: data.dec,
                    date: data.date,
                    priority: data.priority,
                    email: data.email
                }
            };
            const result = await TaskCollection.updateOne(filter, updateitem);
            return res.send(result)
        });
        app.delete('/task/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await TaskCollection.deleteOne(query);
            res.send(result)
        });

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