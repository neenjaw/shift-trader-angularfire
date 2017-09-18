import { ShiftDate } from './shift-date'

export class ShiftUser {
  readonly uid: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly shifts: Array<ShiftDate>;
}
