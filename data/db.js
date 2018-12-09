const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'dryanmas',
    password : '',
    database : 'inventory'
  }
});

const category = require('./models/category');
const count = require('./models/count');
const inventory = require('./models/inventory');
const itemLocation = require('./models/item_location');
const item = require('./models/item');
const location = require('./models/location');

module.exports = {
  category: category.use(db),
  count: count.use(db),
  inventory: inventory.use(db),
  itemLocation: itemLocation.use(db),
  item: item.use(db),
  location: location.use(db),
};