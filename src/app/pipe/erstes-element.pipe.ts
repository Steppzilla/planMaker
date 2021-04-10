import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'erstesElement'
})
export class ErstesElementPipe implements PipeTransform {
  private prevValue:number;

  transform(value: Date): string {    
    console.log(this.prevValue);
    if(value.getMonth()==this.prevValue){
      return "";
    }else{
      this.prevValue=value.getMonth();
      return value.getMonth().toString();
    }   
  }

}
