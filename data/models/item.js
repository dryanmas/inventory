module.exports.use = function(db) {
  const exports = {};

  exports.insert = function(items) {
    return db('item').insert(items)
  };

  exports.find = function() {
    return db('item');
  };

  exports.findById = function(id) {
    return db('item').where({ id: Number(id) });
  };

  exports.findByName = function(name) {
    return db('item').where({ name: name.toLowerCase() });
  };

  return exports;
}