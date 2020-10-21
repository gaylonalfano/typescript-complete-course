import React from "react";

import "./TodoList.css";

interface TodoListProps {
  items: { id: string; text: string }[];
  onDeleteTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = (props) => {
  // Need to add props and specify their structure for TS
  // Update: Add delete button on the <li> that calls todoDeleteHandler via
  // our onDeleteTodo prop. We don't call onDeleteTodo() directly onClick.
  // Instead, we use .bind(value_for_this, first_param_of_onDeleteTodo i.e., todo.id)
  // TODO Need to research this approach more.
  return (
    <ul>
      {props.items.map((todo) => (
        <li key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={props.onDeleteTodo.bind(null, todo.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
