module.exports.use = function(db) {
  const exports = {};

  exports.insert = function(categories) {
    return db('category').insert(categories)
  };

  exports.findById = function(id) {
    return db('category').where({ id: Number(id) });
  };

  exports.findByName = function(name) {
    return db('category').where({ name: name.toLowerCase() });
  };

  return exports;
}