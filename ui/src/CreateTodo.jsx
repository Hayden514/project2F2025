import React, { useState } from 'react';

export default function CreateTodo({ API_URL, onTodoCreated }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Submit a new todo to the backend
    async function handleSubmit(e) {
        e.preventDefault();

        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, completed: false }),
        });

        if (response.ok && onTodoCreated) {
            onTodoCreated(); // Notify App to refresh Todos
            setTitle(''); // Clear input
            setDescription('');
        }
    }

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Create TODO</button>
            <div className="side-note">
                The todo list will automatically update after creating a new
                todo.
            </div>
        </form>
    );
}
