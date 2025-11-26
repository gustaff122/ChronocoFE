import { Pipe, PipeTransform, TemplateRef } from '@angular/core';

@Pipe({
  name: 'tableGetCellTemplate',
  standalone: true
})
export class TableGetCellTemplatePipe implements PipeTransform {
  public transform(
    templateName: string = '',
    templates: TemplateRef<any>[],
    templatesNames: string[]
  ): TemplateRef<any> {
    const id: number = templatesNames.indexOf(templateName);
    return templates[id];
  }
}
