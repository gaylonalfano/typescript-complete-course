// Render Props topic https://youtu.be/Z5iWr6Srsj8?t=1177
// NOTE: May have better methods of doing this but Ben uses
// render props still on occasion.
import React, { useState } from "react";

interface Props {
  children: (
    count: number,
    setCount: React.Dispatch<React.SetStateAction<number>>
  ) => JSX.Element | null;
}

// Alternative approach is to create a 'data' object
// Then you just destructure to get the inner properties (i.e., count, setCount)
/* interface Props { */
/*   children: (data: { */
/*     count: number; */
/*     setCount: React.Dispatch<React.SetStateAction<number>>; */
/*   }) => JSX.Element | null; */
/* } */

export const Counter: React.FC<Props> = (props) => {
  /* export const Counter: React.FC<Props> = ({children}) => { */
  // Just going to store a counter and then render Children
  const [count, setCount] = useState(0);

  // Turn this into a render prop. Going to first render a div,
  // then render some children. We'll then give the children the count
  // and allow the children to update the count as well.
  return <div>{props.children(count, setCount)}</div>;
};
