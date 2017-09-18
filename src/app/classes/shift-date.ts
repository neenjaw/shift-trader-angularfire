import * as moment from 'moment';

export class ShiftDate {
  readonly date: string;
  readonly shiftDescriptor: string;

  /**
   * [constructor description]
   * @param  {string}    privated [description]
   * @param  {string = null} privated [description]
   * @return {[type]}             [description]
   */
  constructor(private d: string, private t: string = null) {
    //allow one string to be passed to the constructor
    if (t === null) {
      let x: string[] = d.split('-');
      if (x.length === 4) {
        d = `${x[0]}-${x[1]}-${x[2]}`;
        t = x[3];
      } else {
        throw new Error('Invalid date format. Format: \'YYYY-MM-DD-[D/N]\'');
      }
    }

    //check format
    if ( !(moment(d, 'YYYY-MM-DD', true).isValid()) ) { throw new Error('Invalid date format. Format: \'YYYY-MM-DD\''); }
    if ( !((t === 'D') || (t === 'N')) ) { throw new Error('Invalid shift descriptor. Format: \'D\' or \'N\'') }

    //assign readonly vars
    this.date = d;
    this.shiftDescriptor = t;
  }

  /**
   * Returns string format of object
   * @return {string} [description]
   */
  public toString(): string {
    return `${this.date}-${this.shiftDescriptor}`;
  }
}
