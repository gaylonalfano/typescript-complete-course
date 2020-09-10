class ProjectList extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget {
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
  dragOverHandler(event: DragEvent) {
    // Tell JS to allow this <section> element to be dragged/dropped by preventing default
    event.preventDefault();
    // Check if this location is a valid drag/drop target location
    // and that the format of the data is 'text/plain' (not images, etc.)
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      // Add droppable CSS class to ul element for visual cue to user
      // Recall that this.element = <section> so we querySelector('ul') to get <ul>
      const listEl = this.element.querySelector("ul")!;
      // Use vanilla JS classList.add() method to add our CSS class
      // We'll end up with <ul class="droppable">
      listEl.classList.add("droppable");
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    // Extract the data from the event using dataTransfer!.getData('text/plain')
    /* console.log(event.dataTransfer!.getData('text/plain')); */
    const prjId = event.dataTransfer!.getData("text/plain");
    // Change the status of the project if it exists and we change the drop target
    // New project status depends on the list we drop this project on/in
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    // Remove droppable CSS class to ul element for visual cue to user
    // Recall that this.element = <section> so we querySelector('ul') to get <ul>
    const listEl = this.element.querySelector("ul")!;
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
        if (this.type === "active") {
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
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
      console.log(this.element.querySelector("ul")!.id); // active-projects-list
      console.log(this.element.id); // active-projects
      console.log(this.hostElement.id); // app
    }
  }
}
