import React, { useRef } from "react";

import "./NewTodo.css";

// Add a new Function-Type prop
interface NewTodoProps {
  onAddTodo: (todoText: string) => void;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/* type NewTodoProps = { */
/*   onAddTodo: (todoText: string) => void; */
/* }; */

// Could build class-based components or functional-based
const NewTodo: React.FC<NewTodoProps> = (props) => {
  // Use useRef hook to extract user input
  // We use the ref to assign to a DOM element, then interact with DOM element
  // inside our code (i.e., inside the todoSubmitHandler)
  // TS: Need to pass a type to this generic useRef() (HTMLInputElement)
  // Need to provide default initialValue to useRef(null), since the very first
  // time it runs, our form will be empty. Once it renders the first time, the
  // connection will be established and our ref will work.
  const textInputRef = useRef<HTMLInputElement>(null);

  // Need to forward the user input to main App
  const todoSubmitHandler = (event: React.FormEvent) => {
    // Prevent from sending a HTTP request to server serving this app
    // Instead want to handle request using only JS
    event.preventDefault();

    // Extract what the user enters (two methods):
    // 1. Manage state here using two-way binding
    // 2. Use a ref (reference) to extract when form submitted
    // **We're going with 2 since we'll see state management in App component
    // Can now interact with our textInputRef variable
    // Add ! because this handler is only called when form is submitted
    const enteredText = textInputRef.current!.value;
    /* console.log(enteredText); */
    // TODO The above works so now we need to forward it (new todo item) to our main App component
    // by adding a handler inside App that appends this new todo to todos array
    // Update: Added a function-type prop onAddTodo to our props. Time to use it.
    props.onAddTodo(enteredText);
  };

  return (
    <form onSubmit={todoSubmitHandler}>
      <div className="form-control">
        <label htmlFor="todo-text">Todo Text</label>
        <input
          type="text"
          id="todo-text"
          ref={textInputRef}
          // onChange={handleChange}
        />
      </div>
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default NewTodo;
