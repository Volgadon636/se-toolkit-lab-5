import { useState } from 'react';
import Items from './Items';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'items' | 'dashboard'>('items');

  return (
    <div className="App">
      <header style={{
        backgroundColor: '#282c34',
        padding: '20px',
        color: 'white',
        marginBottom: '20px'
      }}>
        <h1>SE Toolkit Lab 5</h1>

        {/* Навигация */}
        <nav style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginTop: '10px'
        }}>
          <button
            onClick={() => setCurrentPage('items')}
            style={{
              padding: '10px 20px',
              backgroundColor: currentPage === 'items' ? '#61dafb' : '#ccc',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: currentPage === 'items' ? 'bold' : 'normal'
            }}
          >
            Items
          </button>
          <button
            onClick={() => setCurrentPage('dashboard')}
            style={{
              padding: '10px 20px',
              backgroundColor: currentPage === 'dashboard' ? '#61dafb' : '#ccc',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: currentPage === 'dashboard' ? 'bold' : 'normal'
            }}
          >
            Dashboard
          </button>
        </nav>
      </header>

      {/* Рендерим нужную страницу */}
      {currentPage === 'items' ? <Items /> : <Dashboard />}
    </div>
  );
}

export default App;