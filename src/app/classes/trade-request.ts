import { ShiftUser } from './shift-user';
import { TradeOffer } from './trade-offer';

export class TradeRequest {
  readonly date: Date;
  readonly user: ShiftUser;
  readonly offers: Array<TradeOffer>;
}
