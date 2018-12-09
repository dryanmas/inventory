const db = require('../data/db.js');
const XLSX = require('xlsx');
const _ = require('lodash');

const execute = async function() {
  const report = XLSX.utils.book_new();
  const received = await buildReceived();
  const stock = await buildStock();

  report.SheetNames.push('Received');
  report.SheetNames.push('Stock');
  report.Sheets['Received'] = XLSX.utils.json_to_sheet(received);
  report.Sheets['Stock'] = XLSX.utils.json_to_sheet(stock);

  XLSX.writeFile(report, 'inventory.xlsx');
};

const buildStock = async function() {
  const itemLocations = await db.itemLocation.find();
  console.log(itemLocations);
  const locationList = getByLocation(itemLocations);
  const locations = Object.keys(locationList).sort();
  
  const entries = locations.map(location => {
    const locationEntries = locationList[location].map(item => {
      return {
        item: item.item_name,
        unit: item.unit,
        quantity: null,
      };
    });

    locationEntries.unshift({
      item: location.toUpperCase(),
      unit: null,
      quantity: null,
    });

    locationEntries.push({
      item: null,
      unit: null,
      quantity: null,
    });

    return locationEntries;
  });

  return _.flatten(entries);
};

function getByLocation(itemLocations) {
  const locationObj = {};

  itemLocations.forEach(entry => {
    const location = entry.name;
    locationObj[location] = locationObj[location] || [];
    locationObj[location].push(entry);
  });

  return locationObj;
};


const buildReceived = async function() {
  const itemList = await db.item.find();
  const sourceList = getBySource(itemList);
  const sources = Object.keys(sourceList).sort();

  const entries = sources.map(source => {
    const sourceEntries = sourceList[source].map(item => {
      return {
        item: item.name,
        unit: item.unit,
        quantity: null,
      };
    });

    sourceEntries.unshift({
      item: source.toUpperCase(),
      unit: null,
      quantity: null,
    });

    sourceEntries.push({
      item: null,
      unit: null,
      quantity: null,
    });

    return sourceEntries;
  });
  // console.log('entries');
  return _.flatten(entries);
}

function getBySource(items) {
  const sourceObj = {};

  items.forEach(item => {
    const source = item.source;
    sourceObj[source] = sourceObj[source] || [];
    sourceObj[source].push(item);
  });

  return sourceObj;
};


execute();


