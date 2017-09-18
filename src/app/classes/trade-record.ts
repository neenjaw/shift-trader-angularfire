import { ShiftUser } from './shift-user';

export class TradeRecord {
  readonly askingUser: ShiftUser;
  readonly offeringUser: ShiftUser;
  readonly askedDate: Date;
  readonly offeredDate: Date;
}
