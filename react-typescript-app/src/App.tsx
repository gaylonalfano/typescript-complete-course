import React from "react";

import TodoList from "./components/TodoList";
import NewTodo from "./components/NewTodo";

const App: React.FC = () => {
  // Render a list of todos. Will turn into another component eventually
  // then pass into the main TodoList component using props
  const todos = [{ id: "t1", text: "Finish the course" }];

  // Create a handler that takes new todo from NewTodo component and adds
  // to todos list. Use state management. We want this function available inside
  // the NewTodo component, so we pass a pointer to this function within the component
  // via a new prop we create (onAddTodo). We create this prop within the NewTodo component
  const todoAddHandler = (text: string) => {
    console.log(text);
  };

  return (
    <div className="App">
      <NewTodo onAddTodo={todoAddHandler} />
      <TodoList items={todos} />
    </div>
  );
};

export default App;
