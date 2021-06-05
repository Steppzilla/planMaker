import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FerientermineService } from './ferientermine.service';

@Injectable({
  providedIn: 'root'
})
export class EpochenPlaeneService {
  esr_plan=new BehaviorSubject(null);
  esr_plan$=this.esr_plan.asObservable();

 
  constructor(public ferienTermServ: FerientermineService) {
    this.esr_plan.next(this.ferienTermServ.daysBetween());
    

   }
}
