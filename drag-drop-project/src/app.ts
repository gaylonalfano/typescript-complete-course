class ProjectInput {
  // Add class property/variables so they don't throw property not exist error
  // We can use HTMLTemplateElement because we added "dom" in tsconfig libs
  templateElement: HTMLTemplateElement;
  // Where we want to render our project input form
  hostElement: HTMLDivElement;
  // Add property for the importedNode element within form
  element: HTMLFormElement;

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
    // Use our private attach() method to render our form
    this.attach();
  }

  // Now use importedNode to render content. Creating a private method
  // to help with this.
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

// Create a new instance of this class and see it render on the page
const prjInput = new ProjectInput();

