export class MaxCheckInsError extends Error {
  constructor() {
    super("You already checked in today");
  }
}
