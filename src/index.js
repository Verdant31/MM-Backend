require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const firebase = require('firebase');
const functions = require('./firebase');
const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
  exposedHeaders: ['x-total-count']
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 3001);
app.use(cors(corsOptions))

app.post('/addimmobile', (req, res) => {
  console.log(req.body);
  const data = req.body
  functions.AddProduct(data.images, data.type, data.price, data.size, data.bathrooms, data.rooms, data.suites, data.slots, data.street, data.district, data.cep, data.city)
    .catch(function (err) {
      if (err) {
        console.log(err);
      }
    })
})

app.put('/updateproduct', (req, res) => {
  const data = req.body;

  const dbRef = firebase.database();
  dbRef.ref('imóveis/' + data.id).update({
    fotosDoTerreno: data.images,
    tipo: data.type,
    preco: data.price,
    tamanho: data.size,
    banheiros: data.bathrooms,
    quartos: data.rooms,
    suites: data.suites,
    vagas: data.slots,
    rua: data.street,
    bairro: data.district,
    cep: data.cep,
    cidade: data.city
  })
})

app.get('/getproducts', (req, res) => {
  const { page = 1, per_page = 5 } = req.query;

  const pageStart = (Number(page) - 1) * Number(per_page) + 1;
  const pageEnd = pageStart + Number(per_page);

  const dbRef = firebase.database();
  dbRef.ref().child("imóveis").get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const preData = Object.keys(snapshot.val()).map((key) => snapshot.val()[key]).slice(pageStart, pageEnd)
        const data = preData.slice(pageStart, pageEnd);
        return res.set('x-total-count', String(data.length)).json(data);
      } else {
        console.log("No data available")
      }
    }).catch(function (error) {
      console.log(error);
    })
})

app.delete('/deleteproduct/:id', (req, res) => {
  console.log(req.params.id);
  let id = req.params.id;
  const dbRef = firebase.database();
  dbRef.ref().child("imóveis").child(id).remove().catch(err => {
    res.send(err);
  })
})

app.get('/getimmobile/:id', (req, res) => {
  let id = req.params.id;
  console.log(id)
  const dbRef = firebase.database();
  dbRef.ref().child("imóveis").child(id).get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        res.send(snapshot.val());
      } else {
        console.log("No data available")
      }
    }).catch(function (error) {
      console.log(error);
    })
})
