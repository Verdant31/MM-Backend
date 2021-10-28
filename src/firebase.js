const firebase = require('firebase');


const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};
firebase.initializeApp(firebaseConfig);

module.exports.AddProduct = async (images, type, price, size, bathrooms, rooms, suites, slots, street, district, cep, city) => {
  const productRef = firebase.database();
  await productRef.ref('imóveis').push({
    fotosDoTerreno: images,
    tipo: type,
    preco: price,
    tamanho: size,
    banheiros: bathrooms,
    quartos: rooms,
    suites: suites,
    vagas: slots,
    rua: street,
    bairro: district,
    cep: cep,
    cidade: city
  })
}

return module.exports

