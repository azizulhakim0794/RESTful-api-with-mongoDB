//All imports
const express = require('express');
const { MongoClient } = require('mongodb');
const {ObjectId} = require('mongodb')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
//middleware
const router = express.Router()
const app = express();
app.use(bodyParser.json())
app.use(cors());
// paste your url
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hsgbd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const cartProductCollection = client.db("your-database-name").collection("your-database-collection-name");

    router.get("",(req,res,next)=>{
      cartProductCollection.find({})
        .toArray((err, documents) => {
          res.status(200).send(documents)
          console.log(documents)
        })
    })
    //all router set here
    router.get("/userOrderProducts",(req,res,next)=>{ 
      const email = req.headers.email
      cartProductCollection.find({email:email})
      .toArray((err, documents) => {
        res.status(200).send(documents)
      })
    })
      router.post('',(req, res ,next) =>{ 
        const name = req.body.name
        const price = req.body.price
        const quantity = req.body.quantity
        cartProductCollection.insertOne({name:name,price:price,quantity:quantity})
          .then(result => {
            res.status(201).send(result.insertedCount > 0);
          })
        })
  
        router.delete("",(req,res,next)=>{
          const id = req.headers.id
          if(id){
            cartProductCollection.deleteOne({_id:ObjectId(id)})
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
        cartProductCollection.updateOne({_id:ObjectId(id)})
        .then((err, documents) => {
          res.status(200).send(documents[0])
        })
      })
    
});
//export as a router
module.exports = router