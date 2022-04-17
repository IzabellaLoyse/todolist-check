import { useEffect, useState } from 'react';
import { BsBookmarkCheck, BsBookmarkCheckFill, BsTrash } from 'react-icons/bs';
import Styles from './todo.module.css';

const API = 'HTTP://localhost:5000';

export function Todo() {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isLoading = async () => {
      setLoading(true);
      const response = await fetch(`${API}/todos`)
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      setLoading(false);
      setTodos(response);
    };

    isLoading();
  }, []);

  const todo = {
    id: Math.floor(Math.random() * 100),
    title,
    description,
    time,
    done: false,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch(`${API}/todos`, {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setTodos((prevState) => [...prevState, todo]);

    setTitle('');
    setTime('');
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/todos/${id}`, {
      method: 'DELETE',
    });

    setTodos((prevState) => prevState.filter((todoItem) => todoItem.id !== id));
  };

  const handleEdit = async (todoList) => {
    const todoDone = todoList;
    todoDone.done = !todoList.done;

    const data = await fetch(`${API}/todos/${todoList.id}`, {
      method: 'PUT',
      body: JSON.stringify(todoList),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setTodos((prevState) =>
      prevState.map((t) => (t.id === data.id ? (t = data) : t)),
    );
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <section className={Styles.todoContainer}>
      <div className={Styles.todoHeader}>
        <h1>Todo List Check</h1>
      </div>

      <section className={Styles.todoForm}>
        <h2>Insira a sua tarefa</h2>

        <form onSubmit={handleSubmit}>
          <div className={Styles.formControl}>
            <label htmlFor="title" className={Styles.formLabel}>
              O que você vai fazer hoje ?
              <input
                type="text"
                id="title"
                name="title"
                value={title || ''}
                required
                placeholder="Título da tarefa"
                className={Styles.formInput}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
          </div>

          <div className={Styles.formControl}>
            <label htmlFor="description" className={Styles.formLabel}>
              Descrição
              <input
                type="text"
                id="description"
                name="description"
                value={description || ''}
                required
                placeholder="Descrição da tarefa"
                className={Styles.formInput}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
          </div>

          <div className={Styles.formControl}>
            <label htmlFor="time" className={Styles.formLabel}>
              Duração da Tarefa
              <input
                type="text"
                id="time"
                name="time"
                value={time || ''}
                required
                placeholder="Tempo estimado (em horas)"
                className={Styles.formInput}
                onChange={(event) => setTime(event.target.value)}
              />
            </label>
          </div>

          <input type="submit" value="Criar Tarefa" />
        </form>
      </section>

      <div className={Styles.todoList}>
        <h2>Lista de Tarefas</h2>
        {todos.length === 0 && (
          <p className={Styles.paragraph}>Nenhuma tarefa adicionada!</p>
        )}

        {todos.map((todoList) => (
          <div key={todoList.id} className={Styles.todoWrapper}>
            <h3 className={todoList.done ? Styles.todoDone : ''}>
              {todoList.title}
            </h3>
            <p>Descrição: {todoList.description}</p>
            <p>Duracão: {todoList.time}</p>

            <div className={Styles.actions}>
              <span
                onClick={() => handleEdit(todoList)}
                role="button"
                tabIndex="0"
                aria-hidden="true"
              >
                {!todoList.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>

              <BsTrash
                onClick={() => handleDelete(todoList.id)}
                role="button"
                tabIndex="0"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Todo;
