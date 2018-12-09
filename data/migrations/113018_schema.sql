CREATE TABLE inventory (
  id serial PRIMARY KEY,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL
);

CREATE TABLE category (
  id serial PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE location (
  id serial PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE item (
  id serial PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  unit VARCHAR NOT NULL,
  unit_price FLOAT NOT NULL,
  red FLOAT NOT NULL,
  orange FLOAT NOT NULL,
  par FLOAT NOT NULL,
  category_id INT REFERENCES category(id) ON DELETE CASCADE NOT NULL,
  source VARCHAR
);

CREATE TABLE item_location (
  id serial PRIMARY KEY,
  item_id int REFERENCES item(id) ON DELETE CASCADE NOT NULL,
  location_id int REFERENCES location(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (item_id, location_id)
);

CREATE TABLE count (
  id serial PRIMARY KEY,
  quantity FLOAT NOT NULL, 
  type VARCHAR NOT NULL,
  inventory_id int REFERENCES inventory (id) ON DELETE CASCADE NOT NULL
);