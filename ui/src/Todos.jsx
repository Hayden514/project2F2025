import React, { useState, useEffect } from 'react';

export default function Todos({ API_URL, refreshTrigger }) {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at'); // Which field to sort by
  const [sortDir, setSortDir] = useState('asc'); // Sort direction
  const [checkedIds, setCheckedIds] = useState([]); // IDs of todos selected for batch actions
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'pending'


  // Fetch todos from backend, apply search filter and sorting
  async function loadTodos() {
    let res = await fetch(`${API_URL}/todos`);
    let data = await res.json();

    // Filter by search term in title or description
    if (search.trim() !== '') {
      data = data.filter(
        t =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Filter by completion status
    if (filterStatus === 'completed') {
        data = data.filter(t => t.completed);
    } else if (filterStatus === 'pending') {
        data = data.filter(t => !t.completed);
    }


    // Sort the todos based on selected field and direction
    data.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Convert date strings to Date objects for comparison
      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    setTodos(data);
  }

  // Run loadTodos whenever the refreshTrigger or filters change
  useEffect(() => {
    loadTodos();
  }, [refreshTrigger, search, sortBy, sortDir]);

  // Delete a single todo by ID
  async function deleteOne(id) {
    await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
    loadTodos();
  }

  // Delete multiple selected todos
  async function deleteSelected() {
    await Promise.all(
      checkedIds.map(id => fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' }))
    );
    setCheckedIds([]);
    loadTodos();
  }

  // Toggle checkbox selection for a todo
  function toggleCheck(id) {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter(x => x !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  }

  // Simple stats: total todos, done, in progress
  const total = todos.length;
  const done = todos.filter(t => t.completed).length;
  const inProgress = total - done;

  return (
    <div className="todos-container">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search todos..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '4px' }}
      />
        {/* Filter by status */}
        <div style={{ marginBottom: '10px' }}>
            <label>Filter: </label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
             <option value="all">All</option>
             <option value="completed">Completed</option>
             <option value="pending">Pending</option>
            </select>
            </div>
            
      {/* Sort controls */}
      <div style={{ marginBottom: '10px' }}>
        <label>Sort by: </label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="created_at">Created At</option>
          <option value="title">Title</option>
        </select>
        <button onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>
          {sortDir === 'asc' ? 'Asc' : 'Desc'}
        </button>
      </div>

      {/* Stats display */}
      <div style={{ marginBottom: '10px' }}>
        <strong>Stats:</strong> Total: {total}, Done: {done}, In Progress: {inProgress}
      </div>

      {/* Batch delete button */}
      {checkedIds.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <button onClick={deleteSelected}>Delete Selected ({checkedIds.length})</button>
        </div>
      )}

      {/* Todo list */}
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: '6px' }}>
            <input
              type="checkbox"
              checked={checkedIds.includes(todo.id)}
              onChange={() => toggleCheck(todo.id)}
            />{' '}
            <span>{todo.completed ? ' Done' : 'Pending....'}</span> - {todo.title}
            <br />
            <small>{todo.description}</small>
            <br />
            <button onClick={() => deleteOne(todo.id)} style={{ marginTop: '2px' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
