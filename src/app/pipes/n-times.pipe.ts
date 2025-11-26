import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appNTimes',
})
export class NTimesPipe implements PipeTransform {
  public transform(n: number): string {
    return [].constructor(n);
  }
}
