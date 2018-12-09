module.exports.use = function(db) {
  const exports = {};

  exports.insert = function(locations) {
    return db('location').insert(locations)
  };

  exports.find = function() {
    return db('location');
  };

  exports.findById = function(id) {
    return db('location').where({ id: Number(id) });
  };

  exports.findByName = function(name) {
    return db('location').where({ name: name.toLowerCase() });
  };

  return exports;
}