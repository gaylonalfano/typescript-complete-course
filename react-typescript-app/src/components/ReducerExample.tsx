// From Ben Awad's tutorial https://youtu.be/Z5iWr6Srsj8?t=921
import React, { useReducer } from "react";

type Actions = { type: "add"; text: string } | { type: "remove"; idx: number };

// NOTE: For Ben's I'm using TodoI instead of Max's Todo since they differ
interface TodoI {
  text: string;
  complete: boolean;
}

type State = TodoI[];

const TodoReducer = (state: State, action: Actions) => {
  switch (action.type) {
    case "add":
      return [...state, { text: action.text, complete: false }];
    case "remove":
      return state.filter((_, i) => action.idx !== i);
    default:
      return state;
  }
};

const ReducerExample: React.FC = () => {
  const [todos, dispatch] = useReducer(TodoReducer, []);

  return (
    <div>
      {JSON.stringify(todos)}
      <button
        onClick={() => {
          dispatch({ type: "add", text: "..." });
          // Below are just other examples from Ben's. Only top dispatch was present
          /* dispatch({ type: "remove", idx: 5 }); */
          /* todos[0].text; */
        }}
      >
        +
      </button>
    </div>
  );
};
