const bodyParser = require('body-parser')
const express = require('express')
const app = express()

const MongoClient = require('mongodb').MongoClient;


const uri = "mongodb+srv://bd_user:victor123@smartphones-ikzno.gcp.mongodb.net/test?retryWrites=true&w=majority"

MongoClient.connect(uri, (err,client) => {
    if (err) return console.log(err)
    db = client.db('smartphones')

    app.listen(8500, function(){
        console.log('Server running on port 8500')
    })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index.ejs')
});

app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

app.get('/show', (req,res) => {
    db.collection('data').find().toArray((err, results) => {
        if(err) return console.log(err)
        res.render('show.ejs', {data: results})
    })
})

app.post('/show', (req,res) => {
    db.collection('data').save(req.body, (err,result) => {
        if (err) return console.log(err)
        console.log('salvo no banco de dados')
        res.redirect('/show')
    })
})

app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id
    var ObjectId = require('mongodb').ObjectID;

    db.collection('data').find(ObjectId(id)).toArray((err, results) => {
        if(err) return res.send(err)
        res.render('edit.ejs', {data:results})
    })
})
.post((req,res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname
    var ObjectId = require('mongodb').ObjectID;

    db.collection('data').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname
        }
    },
    (err, result)=>{
        if(err) return res.send(err)
        res.redirect('/show')
        console.log("Atualizado no Banco de dados") 
    })
})
app.route('/delete/:id')
.get((req,res) =>{
    var id = req.params.id
    var ObjectId = require('mongodb').ObjectId;

    db.collection('data').deleteOne({_id: ObjectId(id)}, (err,result) =>{
        if(err) return res.send(500,err)
        console.log('Deletando do Banco de dados')
        res.redirect('/show')
    })
})