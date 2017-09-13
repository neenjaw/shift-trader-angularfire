import { User } from './user';

export class TradeRecord {
  public askingUser: User;
  public offeringUser: User;
  public askedDate: Date;
  public offeredDate: Date;
}
