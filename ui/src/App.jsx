import React, { useState } from 'react';
import './globals.css';
import Todos from './Todos';
import CreateTodo from './CreateTodo';

// TODO: Change this when deploy to Railway
const API_URL = 'http://localhost:8000'; // Local backend for testing
// const API_URL = ''; // Use this after deployment

export default function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Function called after creating a new todo
    function refreshTodos() {
        setRefreshTrigger((prev) => prev + 1);
    }

    return (
        <>
            <header>
                <h1>TODO List</h1>
            </header>
            <main>
                {/* Pass API_URL and refreshTrigger to Todos */}
                <Todos API_URL={API_URL} refreshTrigger={refreshTrigger} />

                {/* Pass API_URL and onTodoCreated callback to CreateTodo */}
                <CreateTodo API_URL={API_URL} onTodoCreated={refreshTodos} />
            </main>
        </>
    );
}
