import React, { useState } from "react";

import TodoList from "./components/TodoList";
import NewTodo from "./components/NewTodo";
import Todo from "./todo.model";

const App: React.FC = () => {
  // Render a list of todos. Will turn into another component eventually
  // then pass into the main TodoList component using props
  // Update: Rather than using a hardcoded array, we're going to manage state
  // by initializing state with useState([]) hook. useState returns an Array with
  // two elements: 1. state snapshot of current render cycle. 2. Function to update
  // the state and rerender the component. Can use Array destructuring.
  // NOTE: Need to specify a type for the array we pass to useState<Todo[]>([])
  const [todos, setTodos] = useState<Todo[]>([]);

  // Create a handler that takes new todo from NewTodo component and adds
  // to todos list. Use state management. We want this function available inside
  // the NewTodo component, so we pass a pointer to this function within the component
  // via a new prop we create (onAddTodo). We create this prop within the NewTodo component
  const todoAddHandler = (text: string) => {
    const newTodo: Todo = {
      id: Math.random().toString(),
      text: text,
    };

    // UPDATE STATE
    // 1. One way to update state using spread operator:
    /* setTodos([...todos, newTodo]); */

    // 2. The problem is React schedules state updates so ...todos may not be latest state
    // when this update is performed. Therefore, better is to pass a fn that gets previous
    // todos state first then update. TODO Need to research useState() more because React
    // intuitively knows about this inner callback prevTodos.
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  return (
    <div className="App">
      <NewTodo onAddTodo={todoAddHandler} />
      <TodoList items={todos} />
    </div>
  );
};

export default App;
