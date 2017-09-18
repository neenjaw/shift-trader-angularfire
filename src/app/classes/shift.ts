import { ShiftUser } from './shift-user';

export class Shift {
  readonly date: Date;
  readonly users: Array<ShiftUser>;
}
