// Project Type (Class actually so we can instantiate it)
enum ProjectStatus { Active, Finished }

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
type Listener = (items: Project[]) => void;

class ProjectState {
  // Add a private listeners array to store our listeners (functions) when changes
  private listeners: Listener[] = [];
  // Add a private projects variable to store all our projects
  private projects: Project[] = [];
  // Add a private property and set its type to this class itself
  // Make it Static so it can be called on constructor directly
  private static instance: ProjectState;


  // Add private constructor to guarantee it's a Singleton class
  private constructor() {}

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

  addListener(listenerFn: Listener) {
    // Add this function to list of listeners
    this.listeners.push(listenerFn);
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

class ProjectList {
  // Reaching out to our template id="project-list"
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  // Our concrete (section) element we're rendering (just like form in ProjectInput)
  element: HTMLElement;
  // Add a new property that will store the list of projects passed to projectState.addListener();
  assignedProjects: Project[];

  // Add a private 'type' to auto add this property to our instance
  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    // Set assignedProjects to empty Array
    this.assignedProjects = [];

    // Time to make a copy of the template node. We'll insert it in the doc later
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    // Let's target/select the section as it's the firstElementChild to template
    this.element = importedNode.firstElementChild as HTMLElement;
    // Set a dynamic id= that's either 'active' or 'finished'
    // For this we added 'type' parameter to constructor()
    this.element.id = `${this.type}-projects`;

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
        // Else, return ProjectStatus.Finished projects
        return project.status === ProjectStatus.Finished;
      })

      // Update/overwrite assignedProjects with updated projects 
      this.assignedProjects = relevantProjects;

      // Now let's render these latest projects
      this.renderProjects();
    })

    // Attach/render all of this using private attach() method, which uses insertAdjacentElement
    this.attach();
    this.renderContent();
  }

  // Render the latest/updated list of projects
  private renderProjects() {
    // Reach out to the ul elements since they have unique listId values
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    // To prevent re-rendering/duplicating projects that are already rendered, let's clear the contents first
    listEl.innerHTML = "";
    // Now let's loop through all the projects (assignedProjects) and render them
    for (const prjItem of this.assignedProjects) {
      // Add our project as a list item
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  // Render content in the h2 and ul elements
  private renderContent() {
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

  // Insert our importedNode content (this.element) into the document via app div
  private attach() {
    // Render/attach to the DOM. We're using 'beforeend' to add just before the
    // closing tag of the hostElement (i.e., just before </div>)
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

class ProjectInput {
  // Add class property/variables so they don't throw property not exist error
  // We can use HTMLTemplateElement because we added "dom" in tsconfig libs
  templateElement: HTMLTemplateElement;
  // Where we want to render our project input form
  hostElement: HTMLDivElement;
  // Add property for the importedNode element within form
  element: HTMLFormElement;
  // Add user input fields within the form
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLTextAreaElement;
  peopleInputElement: HTMLInputElement;

  // Add a constructor to get access to template and div for render
  // This is the the def __init__(self) equivalent in Python
  constructor() {
    // Add two properties on the fly
    // We need to add these as class variables and set their types
    // Otherwise we get a 'Property does not exist' error
    // Can also use type casting to tell TS the type we're going to get
    /* this.templateElement = <HTMLTemplateElement>( */
    /*   document.getElementById("project-input")! */
    /* ); */
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    // Now that we have access to these elements, let's import the content
    // inside our template tag and render to the DOM (via our div)
    // We could do this outside of the constructor but the idea is that a
    // new instance of this class will immediately render a form that belongs
    // to this new class instance. We'll use document.importNode() for this.
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    // Set the form element id to be 'user-input' for CSS
    this.element.id = "user-input";

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

    // Use our private attach() method to render our form
    this.attach();
  }

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

  // Add a method to addEventListener to our form input and submit
  private configure() {
    // Attach a listener to our form element
    this.element.addEventListener("submit", this.submitHandler);
  }

  // Now use importedNode to render content. Creating a private method
  // to help with this.
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

// Create a new instance of this class and see it render on the page
const projectInput = new ProjectInput();
// Render our two lists. Currently two empty sections
const activeProjectsList = new ProjectList("active");
const finishedProjectsList = new ProjectList("finished");
