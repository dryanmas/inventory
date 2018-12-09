const Promise = require("bluebird");

module.exports.use = function(db) {
  const exports = {};

  exports.insert = function(itemLocations) {
    return db('item_location').insert(itemLocations);
  }

  exports.insertByItem = function(item, locations) {
    const itemLocations = locations.map(location => { 
      return {
        item_id: item.id,
        location_id: location.id
      }; 
    });

    return exports.insert(itemLocations);
  };

  exports.find = function() {
    return db.select('*').from('item_location')
    .leftJoin('item', 'item_location.item_id', 'item.id')
    .select('item.name AS item_name')
    .leftJoin('location', 'item_location.location_id', 'location.id');
  }

  // select(knex.ref('Id').as('UserId'))

  exports.findByItem = function(item) {
    return db('item_location').where({
      item_id: item.id
    });
  };

  exports.findByLocation = function(location) {
    return db('item_location').where({
      location_id: location.id
    });
  };

  return exports;
}