const axios = require('axios');
const data = require('../seeds/raw_data.js');

const instance = axios.create({baseURL: 'http://localhost:3131'})

instance.post('/api/item_location', data.itemLocations)
.then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
})