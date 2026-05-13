import { updateTodo, deleteTodo } from "../adapters/todo-adapters";

function TodoItem({ todo, loadTodos }) {
  // in MatchDay this would update a user's prediction
  // (example: change Win/Draw/Loss or score guess)  const handleChange = async (e) => {
    const { error } = await updateTodo(todo.todo_id, {
      is_complete: e.target.checked,
    });
    if (error) return console.error(error);
    loadTodos();
  };
  // in MatchDay this would delete a prediction entry

  const handleDelete = async () => {
    const { error } = await deleteTodo(todo.todo_id);
    if (error) return console.error(error);
    loadTodos();
  };

  // this would delete a job application
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.is_complete}
        onChange={handleChange}
      />
      {/* shows todo title
          in MatchDay this would display:
          team names, fixture, or prediction result */}

      <span className={todo.is_complete ? "completed" : ""}>{todo.title}</span>

       {/* deletes the item
          in MatchDay this removes a user's prediction */}
          
      <button className="delete-btn" onClick={handleDelete}>
        Delete
      </button>
    </li>
  );


export default TodoItem;
