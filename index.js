const express = require ('express');
const app = express();
const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const DATABASE_NAME = 'testDB';


app.get('/', (req,res)=>{
    getFromDataBase( async (dbo, params) => {
        let collection = await dbo.collection('users');
        let result = await collection.find().toArray();;
        let returningString= "";
        for(let value of result){
            console.log(value);
            returningString += value.name + " ";
        }
        await res.send(returningString);
    });
})

app.get('/addSomething', (req,res) => {
    console.log(req.query);
    if(req.query && req.query.name){
        getFromDataBase(async (dbo, params) => {
            let collection = await dbo.collection('users');
            await collection.insertOne({name: `${params}`});
            await res.send('success');
        }, req.query.name)
    } else {
        res.send('no parameters');
    }
})

app.listen(3000, () => {
    console.log('server is Running');
});

getFromDataBase = async (callback, params) => {
    try {
        const client = await mongo.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        console.log("mongo data base connected");
        const dbo = await client.db(DATABASE_NAME);
        let returningVariable =  await callback(dbo, params);
        await dbo.close;
      } catch (err) {
        console.error(err)
      }
}
