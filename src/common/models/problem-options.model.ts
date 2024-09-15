export interface IProblemOptions {
  includeBoj: boolean;
  includeProgrammers: boolean;
  includeProgrammersSql: boolean;
}

export class ProblemOptions implements IProblemOptions {
  constructor(
    public includeBoj: boolean,
    public includeProgrammers: boolean,
    public includeProgrammersSql: boolean
  ) {}
}
