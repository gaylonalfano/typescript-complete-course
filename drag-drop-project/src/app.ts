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
  private gatherUserInput(): [string, string, number] {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    // Now we can validate the inputs
    // Very basic check. We'll add a separate validate function later.
    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
    ) {
    }
  }

  // Add a submit handler function to extract and validate
  // Use our autobind decorator to attach .bind(this)
  @autobind
  private submitHandler(event: Event) {
    // Package up all the user inputs into an object?
    // First prevent submission from making an HTTP request
    event.preventDefault();
    // Gather user input and store
    console.log(this.titleInputElement.value);
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
const prjInput = new ProjectInput();
