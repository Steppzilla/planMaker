import {
  Injectable
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LehrerService {

  gewaehlterPlan="gesamtplan";
  //wochenTagSelect=new BehaviorSubject(null);
  wochenTagSelect="Montag";
  lehrerSelected = new BehaviorSubject(null);
  lehrerSelected$ = this.lehrerSelected.asObservable();

 


  constructor() {
   
    // this.stundenRaster.next(this.createEmptyStundenraster());
  }
}
