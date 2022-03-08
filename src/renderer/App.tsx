import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'rxdb-hooks';
import { useRxCollection, useRxQuery } from 'rxdb-hooks';

import icon from '../../assets/icon.svg';
import './App.css';

const Database = require('@electron/remote').require('./exposeDB');

const Hello = () => {
  const collection = useRxCollection('heroes');
  const query = React.useMemo(() => {
    if (!collection) {
      return null;
    }

    return collection.find();
  }, [collection]);

  const { result, isFetching } = useRxQuery(query);
  // You'll see here it fails silently, isFetching is forever stuck on True
  console.log('collection', collection);
  console.log('result', result);
  console.log('isFetching', isFetching);

  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <h1>Results from rxdb-hooks: {result?.length}</h1>
      <div className="Hello">
        <button
          type="button"
          onClick={() => {
            const _db = Database.getDatabase();
            const query = _db.heroes.find();
            query.$.subscribe((results) => {
              console.log('got results: ' + results.length);
            });
          }}
        >
          Subscribe normally
        </button>
        <button
          type="button"
          onClick={() => {
            const _db = Database.getDatabase();
            _db.heroes.insert({
              name: Math.random().toString(),
              color: 'despair',
            });
          }}
        >
          Add a doc
        </button>
      </div>
    </div>
  );
};

const DBProvider = ({ children }) => {
  const [db, setDb] = React.useState();

  React.useEffect(() => {
    const initDB = async () => {
      const _db = Database.getDatabase();
      console.log('initDB ~ _db', _db);
      setDb(_db);
    };
    initDB();
  }, []);

  return <Provider db={db}>{children}</Provider>;
};

export default function App() {
  return (
    <DBProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Hello />} />
        </Routes>
      </Router>
    </DBProvider>
  );
}
