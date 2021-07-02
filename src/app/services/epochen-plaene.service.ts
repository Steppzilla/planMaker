import {
  Injectable
} from '@angular/core';
import { element } from 'protractor';
import {
  BehaviorSubject
} from 'rxjs';
import {
  map
} from 'rxjs/operators';
import { Fach } from '../enums/fach.enum';
import {
  FerientermineService
} from './ferientermine.service';
import {
  KlassenplaeneService
} from './klassenplaene.service';

@Injectable({
  providedIn: 'root'
})
export class EpochenPlaeneService {
  esr_plan = new BehaviorSubject(null);
  esr_plan$ = this.esr_plan.asObservable();
  datum = new Date();
  planDatum = new Date(2021, 8, 14);

  aktuelleEpo$ = this.klassenplan.grundPlanfaecher$.pipe(
    map(

      z => {

        //Ich teile die Items auf, da ich sonst in epoche und schiene dasselbe Item bekomme mit aktueller lokik am ende

        let schItems=z.filter(ele=>ele.schiene>0&&ele.zuweisung.schiene.findIndex(eleh=>eleh.start<=this.planDatum&&eleh.ende>=this.planDatum)!==-1);
        let epoItems=z.filter(ele=>ele.epoche>0&&ele.zuweisung.epoche.findIndex(eleh=>eleh.start<=this.planDatum&&eleh.ende>=this.planDatum)!==-1);
        let rhyItems=z.filter(ele=>ele.rhythmus>0&&ele.zuweisung.rhythmus.findIndex(eleh=>eleh.start<=this.planDatum&&eleh.ende>=this.planDatum)!==-1);
    
    let obj = {
      neun: {
        rhy: [],
        sch: [],
        epo: []
      },
      zehn: {
        rhy: [],
        sch: [],
        epo: []
      },
      elf: {
        rhy: [],
        sch: [],
        epo: []
      },
      zwoelf: {
        rhy: [],
        sch: [],
        epo: []
      }
    }
 
    epoItems.forEach(element => {
      //ich muss hier aufpassen, weil beide zuweisungen noch mit drin sind, muss ich die falsche zuweisung erst herausnehmen,
      //die nicht aktuell ist, sonst erscheinen zusätzlcihe fächer im plan
       obj[this.zahlinKlasse(element.klasse)].epo.push({fach:element.fach, lehrerKuerz:element.lehrer[0].kuerzel});
    });
    rhyItems.forEach(element => {
      obj[this.zahlinKlasse(element.klasse)].rhy.push({fach:element.fach, lehrerKuerz:element.lehrer[0].kuerzel});
      
    });
    schItems.forEach(element => {
      obj[this.zahlinKlasse(element.klasse)].sch.push({fach:element.fach, lehrerKuerz:element.lehrer[0].kuerzel});
      
    });
    return obj;
  })
);

zahlinKlasse(za){
  // console.log(za);
   let zahl=parseInt(za);
   switch(zahl){
     case 9: return 'neun';
     case 10: return 'zehn';
     case 11: return 'elf';
     case 12: return 'zwoelf';
   }
 
 }


constructor(public ferienTermServ: FerientermineService, public klassenplan: KlassenplaeneService) {
  this.esr_plan.next(this.ferienTermServ.daysBetween());


}
}
