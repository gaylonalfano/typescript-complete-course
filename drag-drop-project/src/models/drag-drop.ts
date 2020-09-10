// Drag and Drop Interfaces
export interface Draggable {
  // We're going to add listeners to the thing that is draggable
  // Therefore, we're going to add the handlers here for those event listeners
  // DragEvent is a built-in TS type
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

export interface DragTarget {
  // Add event handlers to signal that we're dragging over a valid target
  dragOverHandler(event: DragEvent): void;
  // React to the actual drop that happens. Could update UI
  dropHandler(event: DragEvent): void;
  // Revert visual update if drag/drop is cancelled
  dragLeaveHandler(event: DragEvent): void;
}
