import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'b'
})
export class BPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
