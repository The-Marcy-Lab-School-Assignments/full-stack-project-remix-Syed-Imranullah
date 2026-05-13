import { useState, useEffect } from "react";
import { fetchAllTodos } from "../adapters/todo-adapters";
import AddTodoForm from "./AddTodoForm";
import TodoList from "./TodoList";

function TodoPage({ currentUser, handleLogout }) {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This helper fetches todos on page load with useEffect
  // It is also used within the AddTodoForm and TodoList
  // to re-fetch the todos when a mutation action is performed
  // such as creating, deleting, or updating a todo.

  // main data fetching function
  // in MatchDay this would be "loadFixtures / loadPredictions / loadApplications"
  // depending on what page is being built
  const loadTodos = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllTodos();
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setTodos(data);
    }
    setIsLoading(false);
  };
  // runs once when page loads
  // in MatchDay this also helps "session rehydration style behavior"

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <section>
      <div id="user-controls">
        <span>
          Welcome, <strong>{currentUser.username}</strong>!
        </span>
        <button onClick={handleLogout}>Log Out</button>
      </div>

       {/* in MatchDay this becomes AddPredictionForm or AddApplicationForm
          instead of just entering a todo title, user would submit:
          - fixture (match)
          - prediction (win/draw/loss)
          - optional score guess */}

      <AddTodoForm loadTodos={loadTodos} />
      {isLoading && <p>Loading todos...</p>}
      {error && <p className="error">Something went wrong: {error}</p>}

       {/* in MatchDay this becomes PredictionList or ApplicationList
          it renders structured match predictions instead of simple todos */}

      <TodoList todos={todos} loadTodos={loadTodos} />
    </section>
  );
}

export default TodoPage;
