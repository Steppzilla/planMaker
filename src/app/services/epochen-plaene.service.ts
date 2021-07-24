import {
  Injectable
} from '@angular/core';
import {
  BehaviorSubject
} from 'rxjs';
import {
  concatMap,
  map,
  take
} from 'rxjs/operators';
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

  planDatum = new BehaviorSubject(null);
  planDatum$= this.planDatum.asObservable();

  aktuelleEpo$ = this.planDatum$.pipe(
    concatMap(x=>{return this.klassenplan.grundPlanfaecher$.pipe(take(1))}),
    map(

      z => {

        //Ich teile die Items auf, da ich sonst in epoche und schiene dasselbe Item bekomme mit aktueller lokik am ende

        let schItems=z.filter(ele=>ele.schiene>0&&ele.zuweisung.schiene.findIndex(eleh=>eleh.start<=this.planDatum.getValue()&&eleh.ende>=this.planDatum.getValue())!==-1);
        let epoItems=z.filter(ele=>ele.epoche>0&&ele.zuweisung.epoche.findIndex(eleh=>eleh.start<=this.planDatum.getValue()&&eleh.ende>=this.planDatum.getValue())!==-1);
        let rhyItems=z.filter(ele=>ele.rhythmus>0&&ele.zuweisung.rhythmus.findIndex(eleh=>eleh.start<=this.planDatum.getValue()&&eleh.ende>=this.planDatum.getValue())!==-1);
    
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
  let datum=new Date();
  this.planDatum.next(datum);


}
}
