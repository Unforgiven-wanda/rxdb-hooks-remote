const {
  createRxDatabase,
  addRxPlugin,
  addPouchPlugin,
  getRxStoragePouch,
} = require('rxdb');

addPouchPlugin(require('pouchdb-adapter-memory'));
addPouchPlugin(require('pouchdb-adapter-http'));

let _getDatabase; // cached

const heroSchema = {
  title: 'hero schema',
  description: 'describes a simple hero',
  version: 0,
  type: 'object',
  primaryKey: 'name',
  properties: {
    name: {
      type: 'string',
    },
    color: {
      type: 'string',
    },
  },
  required: ['color'],
};

async function createDatabase() {
  const db = await createRxDatabase({
    name: 'maindb',
    multiInstance: true,
    storage: getRxStoragePouch('memory'),
    pouchSettings: {
      prefix: './data/',
    },
  });

  db.addCollections({
    heroes: {
      schema: heroSchema,
    },
  });

  return db;
}

function getDatabase() {
  if (!_getDatabase) _getDatabase = createDatabase();
  return _getDatabase;
}

module.exports = {
  getDatabase,
};
