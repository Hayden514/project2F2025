import React, { useState } from 'react';
import './globals.css';
import Todos from './Todos';
import CreateTodo from './CreateTodo';

const API_URL = 'http://localhost:8000';

export default function App() {
  // This state triggers Todos to reload whenever it changes
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Callback passed to CreateTodo to refresh Todos after adding
  function refreshTodos() {
    setRefreshTrigger(prev => prev + 1);
  }

  return (
    <>
      <header>
        <h1>TODO List</h1>
      </header>
      <main>
        {/* Pass refreshTrigger to Todos so it reloads when new todos are added */}
        <Todos API_URL={API_URL} refreshTrigger={refreshTrigger} />

        {/* Pass callback to CreateTodo */}
        <CreateTodo API_URL={API_URL} onTodoCreated={refreshTodos} />
      </main>
    </>
  );
}
