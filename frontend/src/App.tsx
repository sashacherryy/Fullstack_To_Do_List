import React, { useEffect, useState } from 'react';
import './App.css';
import { getTask, deleteTask, addingTasks, checkTask, softDeleteTask } from './axios';
import trashIcon from './img/R.png';
import cancelIcon from './img/close.png';
import { Button, TextField } from '@mui/material';

interface Task {
  id: number;
  title: string;
  isDone: boolean;
  isDelete?: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelTask, setCancelTask] = useState<number | null>(null);
  const [deletingTask, setDeletingTask] = useState<number | null>(null);
  const [checkingTask, setCheckingTask] = useState<number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const result: Task[] = await getTask();
      const updatedResult = result.map(task => ({
        ...task,
        isDelete: task.isDelete || false
      }));
      setTasks(updatedResult);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      setCancelTask(id);
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      handleError(err);
    } finally {
      setCancelTask(null);
    }
  };

  const handleCancelTask = async (id: number) => {
    try {
      setDeletingTask(id);
      await softDeleteTask(id);
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task =>
          task.id === id && task.isDone === false ? { ...task, isDelete: !task.isDelete } : task
        );
        return sortTasks(updatedTasks);
      });
    } catch (err) {
      handleError(err);
    } finally {
      setDeletingTask(null);
    }
  };

  const handleCheckTask = async (id: number) => {
    try {
      setCheckingTask(id);
      await checkTask(id);
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task =>
          task.id === id && task.isDelete === false ? { ...task, isDone: !task.isDone } : task
        );
        return sortTasks(updatedTasks);
      });
    } catch (err) {
      handleError(err);
    } finally {
      setCheckingTask(null);
    }
  };

  const handleAddingTask = async (title: string) => {
    try {
      await addingTasks(title);
      setTasks(prevTasks => [
        { id: Date.now(), title, isDone: false, isDelete: false },
        ...prevTasks
      ]);
      setNewTaskTitle('');
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err: any) => {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred');
    }
  };

  const sortTasks = (tasks: Task[]) => {
    return tasks.sort((a, b) => {
      if (a.isDelete && !b.isDelete) return 1;
      if (!a.isDelete && b.isDelete) return -1;
      if (a.isDone && !b.isDone) return 1;
      if (!a.isDone && b.isDone) return -1;
      return 0;
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className='split'></div>
        <div className='counter'>
          <div className="counterTask">All tasks: {tasks.length}</div>
          <div className="counterDoneTask">Done tasks: {tasks.filter(task => task.isDone).length}</div>
          <div className="counterDeletedTask">Deleted tasks: {tasks.filter(task => task.isDelete).length}</div>
        </div>
        <div className='split'></div>
        <h1>What's wanna do?</h1>
        <div className="send">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <div className="wrapper">
            <input type="text" placeholder="Enter your Task" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
            <button onClick={() => handleAddingTask(newTaskTitle)} >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" stroke-width="2" stroke="#064789" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 12l14 0"></path>
                <path d="M13 18l6 -6"></path>
                <path d="M13 6l6 6"></path>
              </svg>
            </button>
          </div>
          )}
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <ul className="listofItem">
            {tasks.map(task => {
              let taskStyle = {};
              if (task.isDone) {
                taskStyle = { color: '#69d43f' };
              } else if (task.isDelete) {
                taskStyle = { color: '#a42222' };
              } else {
                taskStyle = { color: '#000' };
              }
              return (
                <li key={task.id} className="item" style={taskStyle}>
                  {task.isDelete || task.isDone ? <s>{task.title}</s> : <span>{task.title}</span>}
                  <span className="icons">
                    <span className="icon-wrapper">
                      {checkingTask === task.id ? (
                        <input
                          name="cssCheckbox"
                          type="checkbox"
                          className="css-checkbox"
                          defaultChecked={task.isDone}
                          onClick={() => handleCheckTask(task.id)}
                        />
                      ) : (
                        <input
                          name="cssCheckbox"
                          type="checkbox"
                          className="css-checkbox"
                          defaultChecked={task.isDone}
                          onClick={() => handleCheckTask(task.id)}
                        />
                      )}
                    </span>
                    <span className="icon-wrapper">
                      {cancelTask === task.id ? (
                        <img
                          src={cancelIcon}
                          alt="Cancel"
                          className="cancel-icon"
                        />
                      ) : (
                        <img
                          src={cancelIcon}
                          alt="Cancel"
                          className="cancel-icon"
                          onClick={() => handleCancelTask(task.id)}
                        />
                      )}
                    </span>
                    <span className="icon-wrapper">
                      {deletingTask === task.id ? (
                        <img
                          src={trashIcon}
                          alt="Delete"
                          className="delete-icon"
                        />
                      ) : (
                        <img
                          src={trashIcon}
                          alt="Delete"
                          className="delete-icon"
                          onClick={() => handleDeleteTask(task.id)}
                        />
                      )}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </header>
    </div>
  );
};

export default App;
