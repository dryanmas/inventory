const XLSX = require('xlsx');

const db = require('../data/db.js');
const report = XLSX.readFile("./inventory.xlsx");

const execute = async function() {
  const parLookup = await getPars();
  const stock = XLSX.utils.sheet_to_json(report.Sheets.Stock);
  const stockCombined = {};
  stock.forEach(entry => {
    const item = entry.item;
    if (entry.quantity) {
      if (stockCombined[item]) {
        stockCombined[item].quantity += entry.quantity
      } else {
        stockCombined[item] = { 
          unit: entry.unit,
          quantity: entry.quantity
        };
      }
    }
  });

  const allItems = Object.keys(stockCombined);
  const reportEntries = allItems.map(item => {
    const entry = {
      item: item,
      unit: stockCombined[item].unit,
      quantity: stockCombined[item].quantity,
      par: null,
      source: null
    };

    if (parLookup[item]) {
      entry.par = parLookup[item].par,
      entry.source = parLookup[item].source      
    }

    return entry;
  }).sort((x,y) => {
    return x.source < y.source;
  });

  const newReport = XLSX.utils.book_new();
  newReport.SheetNames.push('Report');
  newReport.Sheets['Report'] = XLSX.utils.json_to_sheet(reportEntries);
  XLSX.writeFile(newReport, 'inventory_report.xlsx');
}

const getPars = async function() {
  const itemList = await db.item.find();
  const parLookup = {};
  
  itemList.forEach(item => {
    parLookup[item.name] = {
      par: item.par,
      source: item.source
    };
  });

  return parLookup;
};

execute();

