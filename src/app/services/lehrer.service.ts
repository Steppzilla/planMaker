import {
  Injectable
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  //1 für vertretungsplan, 
   //2 für Nur Lehrer und Zuweisungen ändern
  //3 für Stundenplan änderungen Gesamtplan
  //4 für ESR Plan ändern


  // 5 totaler Admin, lehrer, Zuweisungen und Pläne ändern


  constructor() {
   this.wochenTagSelect="Montag";
   
    // this.stundenRaster.next(this.createEmptyStundenraster());
  }
}
