import { createTodo } from "../adapters/todo-adapters";

// in MatchDay this becomes AddPredictionForm
// users would submit predictions for upcoming matches
function AddTodoForm({ loadTodos }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    // instead of "title"
    // MatchDay would use fields like:
    // fixture_id
    // prediction (Home Win / Draw / Away Win)
    const title = form.elements.title.value;
    if (!title) return;

    const { error } = await createTodo(title);
    if (error) return console.error(error);
    // reloads predictions after submitting

    await loadTodos();
    form.reset();
  };

  return (
    <form id="add-todo-form" onSubmit={handleSubmit}>
       {/* in MatchDay this form would probably include:
          dropdown for fixture
          prediction buttons
          optional score prediction */}
      <label htmlFor="title-input">New Todo:</label>
      <input
        type="text"
        name="title"
        id="title-input"
        placeholder="What needs to be done?"
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddTodoForm;
