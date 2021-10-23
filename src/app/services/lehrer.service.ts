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

 


  constructor() {
   this.wochenTagSelect="Montag";
   
    // this.stundenRaster.next(this.createEmptyStundenraster());
  }
}
