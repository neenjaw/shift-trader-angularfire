import * as moment from 'moment';

export class ShiftDate {
  readonly date: string;
  readonly shiftDescriptor: string;

  constructor(private d: string, private t: string) {
    if ( !(moment(d, 'YYYY-MM-DD', true).isValid()) ) { throw new Error('Invalid date format. Format: \'YYYY-MM-DD\''); }
    if ( !((t === 'D') || (t === 'N')) ) { throw new Error('Invalid shift descriptor. Format: \'D\' or \'N\'') }

    this.date = d;
    this.shiftDescriptor = t;
  }

  public toString(): string {
    return `${this.date}-${this.shiftDescriptor}`;
  }
}
