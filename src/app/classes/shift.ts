import { User } from './user';

export class Shift {
  readonly date: Date;
  readonly users: Array<User>;
}
