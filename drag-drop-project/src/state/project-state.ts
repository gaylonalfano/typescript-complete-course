import { Project, ProjectStatus } from "../models/project.js";

// Project State Management to listen for changes throughout app
type Listener<T> = (items: T[]) => void;

// Create a base State class to be shared so we can manage multiple states
// like users, projects, shopping cart, etc. Going to use generic types that
// can then be forwarded to our custom Listener<T> type.
class State<T> {
  // Add a protected listeners array to store our listeners (functions) when changes
  // protected allows deriving classes (ProjectState) to access listeners array
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    // Add this function to list of listeners
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
  // Add a private projects variable to store all our projects
  private projects: Project[] = [];
  // Add a private property and set its type to this class itself
  // Make it Static so it can be called on constructor directly
  private static instance: ProjectState;

  // Add private constructor to guarantee it's a Singleton class
  private constructor() {
    // Call super() now that we're inheriting from State base class
    super();
  }

  // Add a getInstance Static method so we can call directly on constructor
  // without having to first create an instance (then it'd be an instance method)
  static getInstance() {
    // Check that our private instance has a value
    // Otherwise create a new instance
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  // Create an instance method to add projects to this list when button is clicked
  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    // Now let's add this newProject to our projects Array
    this.projects.push(newProject);
    this.updateListeners();
  }

  // Create a moveProject() method to switch project.ProjectStatus
  // User can drag an active project back to active list, fyi
  // Need to know which project to move and which box is the new box
  // so that we can change the ProjectStatus accordingly
  moveProject(projectId: string, newStatus: ProjectStatus) {
    // Find the matching project in my Array of projects in ProjectState
    const project = this.projects.find((prj) => prj.id === projectId);
    // Check if projectId exists and then and then change/swap its status.
    // Also check if project status is different than newStatus, otherwise
    // we don't need to update and re-render anything.
    if (project && project.status !== newStatus) {
      // Change the project object in our projects Array with the new status
      // Afterwards just need to let all listeners know that we have a state change
      // and they should re-render. Again, ONLY if status actually changed!
      project.status = newStatus;
      // Let listeners know we've had a state change by passing in projects Array
      // and then they need to re-render
      this.updateListeners();
    }
  }

  // Go through all listeners and let them know that there has been a change in
  // state by passing in updated projects array and to re-render.
  private updateListeners() {
    // Loop through listeners function and pass in projects Array as argument
    for (const listenerFn of this.listeners) {
      // Execute each function with projects as argument
      // Make a copy of projects Array so we're not editing original location
      /* listenerFn(this.projects.slice()); */
      // Can use spread operator instead of slice() for same effect
      listenerFn([...this.projects]);
    }
  }
}

// This code only runs once even if imported into several other files
/* console.log("RUNNING..."); */

// Create our global const ProjectState instance
// const projectState = new ProjectState();
export const projectState = ProjectState.getInstance();
