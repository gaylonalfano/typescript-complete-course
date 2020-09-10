import { ProjectInput } from "./components/project-input.js";
import { ProjectList } from "./components/project-list.js";

// Create a new instance of this class and see it render on the page
new ProjectInput();
// Render our two lists. Currently two empty sections
new ProjectList("active");
new ProjectList("finished");
