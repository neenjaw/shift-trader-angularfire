import { User } from './user';

export class TradeRecord {
  readonly askingUser: User;
  readonly offeringUser: User;
  readonly askedDate: Date;
  readonly offeredDate: Date;
}
