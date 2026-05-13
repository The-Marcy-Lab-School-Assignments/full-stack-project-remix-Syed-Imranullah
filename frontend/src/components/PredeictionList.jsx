import TodoItem from './TodoItem';

// in MatchDay this becomes PredictionList
// it renders all predictions or fixtures for the user
function TodoList({ todos, loadTodos }) {
  return (
    <ul id="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.todo_id}
          // in MatchDay this data would represent:
          // fixture info + user prediction + points earned
          todo={todo}
           // reloads updated prediction data after mutations
          loadTodos={loadTodos}
        />
      ))}
    </ul>
  );
}

export default TodoList;
