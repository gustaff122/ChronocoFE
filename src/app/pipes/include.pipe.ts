import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appInclude',
})
export class IncludePipe implements PipeTransform {
  public transform(array: any[], value: any): boolean {
    return array.includes(value);
  }
}
