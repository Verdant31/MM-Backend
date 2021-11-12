require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const firebase = require('firebase');
const functions = require('./firebase');
const app = express();

const corsOptions = {
  origin: 'https://mm-dashboard-i4hrl92jq-verdant31.vercel.app',
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  credentials: true,
  optionSuccessStatus: 200,
  exposedHeaders: ['x-total-count']
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 3001);
app.use(cors(corsOptions))


//Adiciona um imóvel no banco de dados
app.post('/addimmobile', (req, res) => {
  const data = req.body
  functions.AddProduct(data.images, data.type, data.price, data.size, data.bathrooms, data.rooms, data.suites, data.slots, data.street, data.district, data.cep, data.city, data.isExclusive)
    .catch(function (err) {
      if (err) {
        console.log(err);
      }
    })
})

//Edita um produto no banco de dados
app.put('/updateimmobile', (req, res) => {
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

//Pega os dados de todos os impóveis cadastrados, separado por página
app.get('/getimmobiles', (req, res) => {
  const { page, limit = 10 } = req.query;
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = Number(page) * Number(limit);
  const dbRef = firebase.database();
  dbRef.ref().child("imóveis").get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const preData = Object.keys(snapshot.val()).map(key => {
          return {
            id: key,
            image: data[key].fotosDoTerreno,
            type: data[key].tipo,
            price: data[key].preco,
            size: data[key].tamanho,
            toilets: data[key].banheiros,
            rooms: data[key].quartos,
            suites: data[key].suites,
            slots: data[key].vagas
          }
        });

        const immobiles = preData.slice(startIndex, endIndex);
        return res.set('x-total-count', String(preData.length)).json(immobiles);
      } else {
        console.log("No data available")
      }
    }).catch(function (error) {
      console.log(error);
    })
})

app.get('/products', (req, res) => {
  const dbRef = firebase.database();
  dbRef.ref().child("imóveis").get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        res.send(data);
      } else {
        console.log("No data available")
      }
    }).catch(function (error) {
      console.log(error);
    })
})

app.delete('/deleteproduct/:id', (req, res) => {
  let id = req.params.id;
  const dbRef = firebase.database();
  dbRef.ref().child("imóveis").child(id).remove().catch(err => {
    res.send(err);
  })
})

app.get('/getimmobile/:id', (req, res) => {
  let id = req.params.id;
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
