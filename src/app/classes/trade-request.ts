import { User } from './user';
import { TradeOffer } from './trade-offer';

export class TradeRequest {
  public date: Date;
  public user: User;
  public offers: Array<TradeOffer>;
}
