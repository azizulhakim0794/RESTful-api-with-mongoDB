const express = require('express');
const { MongoClient } = require('mongodb');
const {ObjectId} = require('mongodb')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const router = express.Router()
const app = express();
app.use(bodyParser.json())
app.use(cors());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hsgbd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const AllProductCollection = client.db("your-database-name").collection("your-database-collection-name");
  router.get("",(req,res,next)=>{
    AllProductCollection.find({})
      .toArray((err, documents) => {
        res.status(200).send(documents)
        console.log(documents)
      })
  })
  router.get("/userOrderProducts",(req,res,next)=>{ 
    const email = req.headers.email
    AllProductCollection.find({email:email})
    .toArray((err, documents) => {
      res.status(200).send(documents)
    })
  })
    router.post('',(req, res ,next) =>{ 
      const name = req.body.name
      const price = req.body.price
      const quantity = req.body.quantity
      AllProductCollection.insertOne({name:name,price:price,quantity:quantity})
        .then(result => {
          res.status(201).send(result.insertedCount > 0);
        })
      })

      router.delete("",(req,res,next)=>{
        const id = req.headers.id
        if(id){
          AllProductCollection.deleteOne({_id:ObjectId(id)})
        .then(result => {
          res.status(200).send(result.deletedCount>1)
        })
       
        }
        else{
          res.status(404).send("id is not found")
        }
      })
    router.patch("",(req,res,next)=>{
      let id = req.body.id
      AllProductCollection.updateOne({_id:ObjectId(id)})
      .then((err, documents) => {
        res.status(200).send(documents[0])
      })
    })
    
});
module.exports = router