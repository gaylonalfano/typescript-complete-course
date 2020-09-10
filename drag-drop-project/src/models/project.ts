export enum ProjectStatus {
  Active,
  Finished,
}

// Project Type (Class actually so we can instantiate it)
export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
