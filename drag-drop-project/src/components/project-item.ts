// Create a ProjectItem class that can be instantiated with each new project
// Responsible for rendering a single project item
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  // Store the actual project for this instance as a property
  private project: Project;

  // Add a Getter to fetch the number of people assigned to project and return the correct text
  get persons() {
    if (this.project.people === 1) {
      return "1 person";
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
    /* // Log the event when it occurs */
    /* console.log(event); */
    // Access the event's dataTransfer property and set/pass some data
    event.dataTransfer!.setData("text/plain", this.project.id);
    // Let's tell the browser our intentions to move an element from A to B
    event.dataTransfer!.effectAllowed = "move";
  }

  /* @autobind */
  /* dragEndHandler(event: DragEvent) { */
  dragEndHandler(_: DragEvent) {
    console.log("DragEnd");
  }

  protected configure() {
    // Add event listener to our rendered element for our Draggable event handlers
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  protected renderContent() {
    // Reach out to the elements and insert our project details
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
