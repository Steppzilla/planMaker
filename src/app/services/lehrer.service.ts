import {
  Injectable
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Lehrer } from '../interfaces/lehrer';

@Injectable({
  providedIn: 'root'
})
export class LehrerService {

  gewaehlterPlan:string;
  //wochenTagSelect=new BehaviorSubject(null);
  wochenTagSelect:string;
  lehrerSelected = new BehaviorSubject(null);
  lehrerSelected$ = this.lehrerSelected.asObservable();

 
  ausgewaehlterModus=0; 
  //0 für nur anscahuen, 
  //1 für edit, 
   


  constructor() {
   this.wochenTagSelect="Montag";
   let lehr:Lehrer={anrede:"Herr",kuerzel: "NN", name: "NN", faecher:[]};
   this.lehrerSelected.next(lehr);
   
    // this.stundenRaster.next(this.createEmptyStundenraster());
  }
}
