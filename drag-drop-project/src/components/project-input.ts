import { Component } from "./base-component.js";
import { Validatable, validate } from "../util/validation.js";
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
