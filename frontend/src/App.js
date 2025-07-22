import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './App.css';
import { API_ENDPOINTS } from './config/api';

const CATEGORIES = ['All', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [loading, setLoading] = useState(true);

  // Expense state
  const [expenses, setExpenses] = useState([]);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Other');
  const [expenseFilter, setExpenseFilter] = useState('All');
  const [expenseSearch, setExpenseSearch] = useState('');

  // Task state
  const [tasks, setTasks] = useState([]);
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskFilter, setTaskFilter] = useState('All');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesRes, tasksRes] = await Promise.all([
        axios.get(API_ENDPOINTS.expenses),
        axios.get(API_ENDPOINTS.tasks)
      ]);
      setExpenses(expensesRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Expense handlers
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseDesc || !expenseAmount) return;
    
    try {
      const newExpense = { 
        description: expenseDesc, 
        amount: parseFloat(expenseAmount),
        category: expenseCategory
      };
      const res = await axios.post(API_ENDPOINTS.expenses, newExpense);
      setExpenses([res.data, ...expenses]);
      setExpenseDesc('');
      setExpenseAmount('');
      setExpenseCategory('Other');
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`${API_ENDPOINTS.expenses}/${id}`);
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // Task handlers
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskDesc) return;
    
    try {
      const newTask = { 
        description: taskDesc,
        priority: taskPriority,
        dueDate: taskDueDate || null
      };
      const res = await axios.post(API_ENDPOINTS.tasks, newTask);
      setTasks([res.data, ...tasks]);
      setTaskDesc('');
      setTaskPriority('Medium');
      setTaskDueDate('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_ENDPOINTS.tasks}/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const res = await axios.put(`${API_ENDPOINTS.tasks}/${id}`);
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Filtered data
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchesCategory = expenseFilter === 'All' || exp.category === expenseFilter;
      const matchesSearch = exp.description && exp.description.toLowerCase().includes(expenseSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [expenses, expenseFilter, expenseSearch]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (taskFilter === 'All') return true;
      if (taskFilter === 'Completed') return task.completed;
      if (taskFilter === 'Pending') return !task.completed;
      return true;
    });
  }, [tasks, taskFilter]);

  // Statistics
  const expenseStats = useMemo(() => {
    const total = filteredExpenses.reduce((acc, exp) => acc + exp.amount, 0);
    const byCategory = CATEGORIES.slice(1).map(cat => ({
      category: cat,
      amount: expenses.filter(exp => exp.category === cat).reduce((acc, exp) => acc + exp.amount, 0)
    })).filter(item => item.amount > 0);
    
    return { total, byCategory, count: filteredExpenses.length };
  }, [filteredExpenses, expenses]);

  const taskStats = useMemo(() => {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.filter(task => !task.completed).length;
    const overdue = tasks.filter(task => 
      !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
    ).length;
    
    return { completed, pending, overdue, total: tasks.length };
  }, [tasks]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate, completed) => {
    return !completed && dueDate && new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="header">
        <h1>Personal Dashboard</h1>
        <p>Track your expenses and manage your tasks efficiently</p>
      </div>

      <div className="container">
        <div className="section">
          <h2>
            <span className="section-icon">💰</span>
            Expense Tracker
          </h2>
          
          <form className="form" onSubmit={handleAddExpense}>
            <div className="form-row">
              <input
                className="input"
                type="text"
                value={expenseDesc}
                onChange={(e) => setExpenseDesc(e.target.value)}
                placeholder="Expense description"
                required
              />
              <input
                className="input"
                type="number"
                step="0.01"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="Amount"
                required
              />
            </div>
            <div className="form-row">
              <select
                className="select"
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
              >
                {CATEGORIES.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button className="btn btn-primary" type="submit">
                ➕ Add Expense
              </button>
            </div>
          </form>

          <div className="filters">
            <input
              className="input search-input"
              type="text"
              value={expenseSearch}
              onChange={(e) => setExpenseSearch(e.target.value)}
              placeholder="🔍 Search expenses..."
            />
            <select
              className="select"
              value={expenseFilter}
              onChange={(e) => setExpenseFilter(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <ul className="list">
            {filteredExpenses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <p>No expenses found</p>
              </div>
            ) : (
              filteredExpenses.map((exp) => (
                <li key={exp._id} className="list-item">
                  <div className="item-content">
                    <div className="item-title">{exp.description}</div>
                    <div className="item-meta">
                      <span className="category-tag">{exp.category}</span>
                      <span>{formatDate(exp.date)}</span>
                      <strong>${exp.amount.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDeleteExpense(exp._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>

          <div className="stats">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{expenseStats.count}</div>
                <div className="stat-label">Expenses</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">${expenseStats.total.toFixed(2)}</div>
                <div className="stat-label">Total</div>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>
            <span className="section-icon">✅</span>
            Task Manager
          </h2>
          
          <form className="form" onSubmit={handleAddTask}>
            <input
              className="input"
              type="text"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="New task description"
              required
            />
            <div className="form-row">
              <select
                className="select"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
              >
                {PRIORITIES.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
              <input
                className="input"
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                placeholder="Due date"
              />
              <button className="btn btn-primary" type="submit">
                ➕ Add Task
              </button>
            </div>
          </form>

          <div className="filters">
            <select
              className="select"
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
            >
              <option value="All">All Tasks</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <ul className="list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <p>No tasks found</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <li key={task._id} className={`list-item ${task.completed ? 'completed' : ''}`}>
                  <div className="item-content">
                    <div className="item-title">{task.description}</div>
                    <div className="item-meta">
                      <span className={`priority-tag priority-${task.priority ? task.priority.toLowerCase() : 'medium'}`}>
                        {task.priority || 'Medium'}
                      </span>
                      {task.dueDate && (
                        <span style={{ color: isOverdue(task.dueDate, task.completed) ? 'var(--danger-color)' : 'inherit' }}>
                          📅 {formatDate(task.dueDate)}
                          {isOverdue(task.dueDate, task.completed) && ' ⚠️'}
                        </span>
                      )}
                      <span>{formatDate(task.date)}</span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn-icon btn-success"
                      onClick={() => handleToggleTask(task._id)}
                      title={task.completed ? 'Mark as pending' : 'Mark as completed'}
                    >
                      {task.completed ? '↩️' : '✅'}
                    </button>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDeleteTask(task._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>

          <div className="stats">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{taskStats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{taskStats.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{taskStats.overdue}</div>
                <div className="stat-label">Overdue</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;