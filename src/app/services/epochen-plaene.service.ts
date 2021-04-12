import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FerientermineService } from './ferientermine.service';

@Injectable({
  providedIn: 'root'
})
export class EpochenPlaeneService {
  epoche8=new BehaviorSubject(null);
  epoche8$=this.epoche8.asObservable();

  epoche9=new BehaviorSubject(null);
  epoche9$=this.epoche9.asObservable();

  epoche10=new BehaviorSubject(null);
  epoche10$=this.epoche10.asObservable();

  epoche11=new BehaviorSubject(null);
  epoche11$=this.epoche11.asObservable();

  epoche12=new BehaviorSubject(null);
  epoche12$=this.epoche12.asObservable();

  schiene9=new BehaviorSubject(null);
  schiene9$=this.schiene9.asObservable();

  schiene10=new BehaviorSubject(null);
  schiene10$=this.schiene10.asObservable();

  schiene11=new BehaviorSubject(null);
  schiene11$=this.schiene11.asObservable();

  schiene12=new BehaviorSubject(null);
  schiene12$=this.schiene12.asObservable();


  rhythmus9=new BehaviorSubject(null);
  rhythmus9$=this.rhythmus9.asObservable();

  rhythmus10=new BehaviorSubject(null);
  rhythmus10$=this.rhythmus10.asObservable();

  rhythmus11=new BehaviorSubject(null);
  rhythmus11$=this.rhythmus11.asObservable();
  
  rhythmus12=new BehaviorSubject(null);
  rhythmus12$=this.rhythmus12.asObservable();

  constructor(public ferienTermServ: FerientermineService) {
    this.epoche8.next(this.ferienTermServ.daysBetween());
    this.epoche9.next(this.ferienTermServ.daysBetween());
    this.epoche10.next(this.ferienTermServ.daysBetween());
    this.epoche11.next(this.ferienTermServ.daysBetween());
    this.epoche12.next(this.ferienTermServ.daysBetween());
    this.schiene9.next(this.ferienTermServ.daysBetween());
    this.schiene10.next(this.ferienTermServ.daysBetween());
    this.schiene11.next(this.ferienTermServ.daysBetween());
    this.schiene12.next(this.ferienTermServ.daysBetween());

    this.rhythmus9.next(this.ferienTermServ.daysBetween());
    this.rhythmus10.next(this.ferienTermServ.daysBetween());
    this.rhythmus11.next(this.ferienTermServ.daysBetween());
    this.rhythmus12.next(this.ferienTermServ.daysBetween());

   }
}
