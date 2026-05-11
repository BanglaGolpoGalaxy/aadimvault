const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'bazaar.db');
let db;

async function getDB() {
  // TODO: full implementation
}

function saveDB() {
  // TODO
}

module.exports = { getDB, saveDB };
