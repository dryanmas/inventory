const express = require('express');
const cors = require('cors');
const Promise = require('bluebird');

const db = require('./data/db.js');

const server = express();
const PORT = 3131;

server.use(express.json());
server.use(cors());

server.post('/api/location', (req, res) => {
  const locations = req.body;
  //to do: error check body
  db.location.insert(locations).then( info => {
    console.log(info);
    res.status(201).json({ inserted: info.rowCount});
  }).catch( err => {
    console.log('failed to insert locations', err);
    res.status(500).json({ message: "failed to insert locations"});
  });
});

server.post('/api/category', (req, res) => {
  const categories = req.body;
  //to do: error check body
  db.category.insert(categories).then( info => {
    console.log(info);
    res.status(201).json({ inserted: info.rowCount});
  }).catch( err => {
    console.log('failed to insert categories', err);
    res.status(500).json({ message: "failed to insert categories"});
  });
});

server.post('/api/item', async (req, res) => {
  const items = req.body;

  try {
    const itemsFormatted = await Promise.map(items, async (item) => {
      const itemFormatted = {
        name: item.name,
        unit: item.unit,
        unit_price: item.unit_price,
        red: item.red,
        orange: item.orange,
        par: item.par,
        category_id: null,
        source: item.source, 
      };

      const category = await db.category.findByName(item.category_name);
      
      if (!category.length) {
        throw new Error(`Invalid Category: ${item.category}`);
      } 

      itemFormatted.category_id = category[0].id;
      return itemFormatted;
    });
    console.log('items?', itemsFormatted);
    const info = await db.item.insert(itemsFormatted);
    res.status(201).json({ inserted: info.rowCount})

  } catch (err) {
    console.log('failed to insert items', err);
    res.status(500).json({ message: "failed to insert items"});
  }
});

server.post('/api/item_location', async (req, res) => {
  const itemLocationsByName = req.body;
  
  try {
    const items = await db.item.find();
    const locations = await db.location.find();
    const itemsByName = byName(items);
    const locationsByName = byName(locations);

    const itemLocationsById = itemLocationsByName.map(function(itemLocation) {
      const item = itemsByName[itemLocation.item_name]
      const location = locationsByName[itemLocation.location_name];

      if (!item) {
        throw new Error(`Invalid item name: ${itemLocation.item_name}`);
      }

      if (!location) {
        throw new Error(`Invalid location name: ${itemLocation.location_name}`);
      }

      return {
        item_id: item.id,
        location_id: location.id
      };
    });

    const info = await db.itemLocation.insert(itemLocationsById);
    res.status(201).json({ inserted: info.rowCount});

  } catch (err) {
    console.log('failed to insert item locations', err);
    res.status(500).json({ message: "failed to insert item locations"});
  }

  function byName(entries) {
    const storage = {};
    entries.forEach(entry => {
      storage[entry.name] = entry;
    });
    return storage;
  }
});

server.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});