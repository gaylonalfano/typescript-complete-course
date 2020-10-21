import React from "react";

interface TodoListProps {
  items: { id: string; text: string }[];
}

const TodoList: React.FC<TodoListProps> = (props) => {
  // Need to add props and specify their structure for TS
  return (
    <ul>
      {props.items.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
};

export default TodoList;
