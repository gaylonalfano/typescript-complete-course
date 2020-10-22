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

  // ADD TODOS
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

  // DELETE TODOS
  // TODO: Need to handle deleting todos, updating state, and rerendering our list of todos
  const todoDeleteHandler = (todoId: string) => {
    // Call our update state function setTodos() to remove the todo
    setTodos((prevTodos) => {
      // Return updated todos array using .filter
      return prevTodos.filter((todo) => todo.id !== todoId);
      // TODO After above, need to make sure todoDeleteHandler can be called
      // from within TodoList component by passing it via a prop
    });
  };

  return (
    <div className="App">
      <NewTodo
        onAddTodo={todoAddHandler}
        handleChange={(event) => event.target}
      />
      {/* call todoDeleteHandler within component by using a prop */}
      <TodoList items={todos} onDeleteTodo={todoDeleteHandler} />
    </div>
  );
};

export default App;
