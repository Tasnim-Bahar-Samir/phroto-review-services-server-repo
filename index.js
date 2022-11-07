const express =require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()

const port = process.env.PORT || 5000;

//middlewares
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.skbfv9j.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    const servicesCollection = client.db('photograpyDb').collection('services')
    
    try{
        app.get('/services', async(req,res)=>{
            const cursor = servicesCollection.find({})
            const result = await cursor.toArray()
            res.send({
                success:true,
                data: result
            })
        })
        app.get('/limitedServices', async(req,res)=>{
            const cursor = servicesCollection.find({})
            const result = await cursor.limit(3).toArray()
            res.send({
                success:true,
                data: result
            })
        })
        app.get('/services/:id', async(req,res)=>{
            const {id} = req.params;
            const query = {_id : ObjectId(id)}
            const result = await servicesCollection.findOne(query)
            res.send({
                success:true,
                data: result
            })
        })
        app.post('/services', async(req,res)=>{
            const {name,details} = req.body;
            const result = await servicesCollection.insertOne({name,details})
           if(result.insertedId){
            res.send({
                success:true,
                message: "Service Added Successfully"
            })
           }else{
            res.send({
                success:false,
                message:"Failed To Add"
            })
           }
        })
    }catch(e){
        console.log(e.message,e.name)
    }
}
run()

app.get('/',(req,res)=>{
    res.send("Server is running")
})



app.listen(port,()=>{
    try{
        client.connect(err => {
            const collection = client.db("test").collection("devices");
            console.log('Db Connected')
          });
          
    }catch(err){
        console.log(err)
    }
    console.log("Server is running on port", port)
})