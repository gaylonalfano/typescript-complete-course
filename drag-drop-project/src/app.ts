// Drag and Drop Interfaces
interface Draggable {
  // We're going to add listeners to the thing that is draggable
  // Therefore, we're going to add the handlers here for those event listeners
  // DragEvent is a built-in TS type
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  // Add event handlers to signal that we're dragging over a valid target
  dragOverHandler(event: DragEvent): void;
  // React to the actual drop that happens. Could update UI
  dropHandler(event: DragEvent): void;
  // Revert visual update if drag/drop is cancelled
  dragLeaveHandler(event: DragEvent): void;
}


// Project Type (Class actually so we can instantiate it)
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}


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

class ProjectState extends State<Project>{
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

// Create our global const ProjectState instance
// const projectState = new ProjectState();
const projectState = ProjectState.getInstance();

// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  // Track status by first setting to true
  let isValid = true;
  // Let's check if the validatableInput has required = true
  if (validatableInput.required) {
    /* isValid = isValid && validatableInput.value.toString().trim().length !== 0; */
    // Alternate TS 4.0 syntax:
    isValid &&= validatableInput.value.toString().trim().length !== 0;
  }
  // If value is a string then check minLength
  // Adding != null check in case minLength = 0 (falsey, so will skip)
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  // If value is a string then check maxLength
  // Adding != null check in case maxLength = 0 (falsey, so will skip)
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  // If value is a number then check min and max
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  // If value is a number then check min and max
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}

// Add an auto-bind Decorator to simplify .bind(this)
function autobind(
  /* target: any, */
  /* methodName: string, */
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
) {
  // methodName to which our autobind() is bound
  // descriptor is the PropertyDescriptor of methodName. Methods in the end are just
  // properties which hold functions.
  // First: let's get access to original method we're decorating
  const originalMethod = descriptor.value;
  // Second: Create adjusted descriptor
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      // Executed when we try to access the function
      // Set up the boundFunction by adding .bind(this) to originalMethod
      const boundFn = originalMethod.bind(this);
      // Now let's return this new boundFn
      return boundFn;
    },
  };
  // Third: Return the adjustedDescriptor in our decorator
  return adjustedDescriptor;
}

// Component Base Class. Mark abstract class so can't instantiate it directly
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  // Reaching out to our template id="project-list"
  templateElement: HTMLTemplateElement;
  hostElement: T;
  // Our concrete (section) element we're rendering (just like form in ProjectInput)
  element: U;

  // Add constructor() that specifies the IDs of the template to select,
  // the hostElement to render our Component, and for the new rendered element
  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    // Let's target/select the section as it's the firstElementChild to template
    this.element = importedNode.firstElementChild as U;
    // Set a dynamic id= if newElementId? is passed
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
    }

  // Insert our importedNode content (this.element) into the document via hostElement
  // Adding an insertAtStart parameter to specify location
  private attach(insertAtStart: boolean) {
    // Check the location argument to insert at either afterbegin or beforeend
    this.hostElement.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.element
    );
  }
  // Ensure that inheriting classes also add these two methods for more
  // concrete implementations. Also ensures that no conflicts occur so 
  // it's better they're called within inheriting classes since super()
  // would run this constructor first.
  protected abstract configure(): void;
  protected abstract renderContent(): void;
}


// Create a ProjectItem class that can be instantiated with each new project
// Responsible for rendering a single project item
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  // Store the actual project for this instance as a property
  private project: Project;

  // Add a Getter to fetch the number of people assigned to project and return the correct text
  get persons() {
    if (this.project.people === 1) {
      return '1 person';
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    // Pass the template id 
    super("single-project", hostId, false, project.id); 
    // Set the property to the Project that's passed when creating the instance
    this.project = project;

    this.configure();
    this.renderContent();
  }

  // Add our Draggable event handler methods since we implements Draggable
  // Use @autobind since this handler is used within addEventListener()
  // so 'this' refers to the class and not the target of the event
  @autobind
  dragStartHandler(event: DragEvent) {
    // Log the event when it occurs
    console.log(event);
  }

  /* @autobind */
  /* dragEndHandler(event: DragEvent) { */
  dragEndHandler(_: DragEvent) {
    console.log('DragEnd');
  }

  protected configure() {
    // Add event listener to our rendered element for our Draggable event handlers
    this.element.addEventListener("dragstart", this.dragStartHandler)
    this.element.addEventListener("dragend", this.dragEndHandler)
  };
  
  protected renderContent() {
    // Reach out to the elements and insert our project details
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  };
}



class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  // Add a new property that will store the list of projects passed to projectState.addListener();
  assignedProjects: Project[];

  // Add a private 'type' to auto add this property to our instance
  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    // Set assignedProjects to empty Array
    this.assignedProjects = [];

    // Call configure() which adds our listener function to
    this.configure();
    // No longer need to call attach() as it happens in base Component
    this.renderContent();
  }

  // Add our DragTarget interface event handler functions
  @autobind
  dragOverHandler(_: DragEvent) {
    // Add droppable CSS class to ul element for visual cue to user
    // Recall that this.element = <section> so we querySelector('ul') to get <ul>
    const listEl = this.element.querySelector('ul')!;
    // Use vanilla JS classList.add() method to add our CSS class
    // We'll end up with <ul class="droppable">
    listEl.classList.add("droppable");
  }

  dropHandler(_: DragEvent) {

  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    // Remove droppable CSS class to ul element for visual cue to user
    // Recall that this.element = <section> so we querySelector('ul') to get <ul>
    const listEl = this.element.querySelector('ul')!;
    // Use vanilla JS classList.remove() method to remove our CSS class
    // We'll end up with a simple no-class <ul>
    listEl.classList.remove("droppable");
  }



  // It's convention to move public methods up top before private
  // Create a configure() method that does all the addListener() bit
  // Can't make it private since it's abstract/public in Component
  // However, can use protected abstract which allows it to be accessed
  // within deriving classes.
  protected configure() {
    // Add event listeners to this.element (<section>) to help trigger our drag/drop handlers
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    // Set up a new listener function using our new ProjectState addListener() method
    // Have to pass a function to addListener()
    projectState.addListener((projects: Project[]) => {
      // Gets a list of projects as argument so now we can work with it
      // Filter our projects before we store and render our projects using status
      const relevantProjects = projects.filter((project) => {
        // Check the type value. If type is 'active' then return ProjectStatus.Active only 
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active; 
        }
        return project.status === ProjectStatus.Finished;
      });

      // Update/overwrite assignedProjects with updated projects
      this.assignedProjects = relevantProjects;

      // Now let's render these latest projects
      this.renderProjects();
    });
  }

  // Render content in the h2 and ul elements
  // Gotta remove private since renderContent() is public in Component
  // No such thing as private abstract methods.
  // However, can use protected abstract which allows it to be accessed
  // within deriving classes.
  protected renderContent() {
    // Add an id to the <ul> element so we can select it later
    const listId = `${this.type}-projects-list`;
    // Now let's select the actual <ul> element within our section
    // and set its id value
    this.element.querySelector("ul")!.id = listId;

    // Add h2 heading content for this section
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  // Render the latest/updated list of projects
  private renderProjects() {
    // Reach out to the ul elements since they have unique listId values
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    // To prevent re-rendering/duplicating projects that are already rendered, let's clear the contents first
    listEl.innerHTML = "";
    // Now let's loop through all the projects (assignedProjects) and render them
    for (const prjItem of this.assignedProjects) {
      // Instantiate a new ProjectItem() instance and pass in hostId (this.element.id of ProjectList)
      // this.element refers to the 'section' element with active/finihed-projects id
      // We actually need the 'ul' id instead so we use querySelector('ul')!.id instead
      new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
      console.log(this.element.querySelector('ul')!.id); // active-projects-list
      console.log(this.element.id); // active-projects
      console.log(this.hostElement.id); // app
    }
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  // Add user input fields within the form
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLTextAreaElement;
  peopleInputElement: HTMLInputElement;

  // Add a constructor to get access to template and div for render
  // This is the the def __init__(self) equivalent in Python
  constructor() {
    super("project-input", "app", true, "user-input");
    // Access user input fields within the form
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLTextAreaElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;
    // Add a submit event listener and handler to our form
    this.configure();
  }

  // Add a method to addEventListener to our form input and submit
  protected configure() {
    // Attach a listener to our form element
    this.element.addEventListener("submit", this.submitHandler);
  }

  // Add a renderContent() method since it's required from Component class
  protected renderContent() {}

  // Gather user input data the returns a tuple [title, description, people]
  // Use Union for function return type to add void type for alert
  private gatherUserInput(): [string, string, number] | void {
    // Any value prop is type string so need to convert to number
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    // Let's create Validatable interface objects to pass to validate
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validatable = {
      // Need to convert to type number
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    // Now we can validate the inputs
    // Very basic check. We'll add a separate validate function later.
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again!");
      return;
    } else {
      // Any value prop is type string so need to convert to number
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  /* private clearInputs() { */
  /*   // There's a built-in form.reset() method as well. */
  /*   this.titleInputElement.value = ""; */
  /*   this.descriptionInputElement.value = ""; */
  /*   this.peopleInputElement.value = ""; */
  /* } */

  // Add a submit handler function to extract and validate
  // Use our autobind decorator to attach .bind(this)
  @autobind
  private submitHandler(event: Event) {
    // Package up all the user inputs into an object?
    // First prevent submission from making an HTTP request
    event.preventDefault();
    // Gather user input and store
    const userInput = this.gatherUserInput();
    // Check the type of userInput to see if it's an Array
    // No 'tuple' type in vanilla JS but it's just an Array
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      /* console.log(title, desc, people); */
      // Add the new project to our projectState singleton object
      projectState.addProject(title, desc, people);
      // Clear form inputs using .reset()
      this.element.reset();
    }
  }
}

// Create a new instance of this class and see it render on the page
const projectInput = new ProjectInput();
// Render our two lists. Currently two empty sections
const activeProjectsList = new ProjectList("active");
const finishedProjectsList = new ProjectList("finished");
