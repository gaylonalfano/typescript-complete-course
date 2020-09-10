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
