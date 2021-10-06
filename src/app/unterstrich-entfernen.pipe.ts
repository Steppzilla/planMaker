import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unterstrichEntfernen'
})
export class UnterstrichEntfernenPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    //let ar=value.split("_");
    //let newstring="";
    //ar.forEach(el=>{
    //  newstring=newstring+" " + el;
   // });

    return value.replace(/_/g," ");
  }

}
