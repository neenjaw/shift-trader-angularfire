import { User } from './user';
import { TradeOffer } from './trade-offer';

export class TradeRequest {
  readonly date: Date;
  readonly user: User;
  readonly offers: Array<TradeOffer>;
}
