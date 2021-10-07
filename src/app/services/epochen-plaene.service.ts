import {
  Injectable
} from '@angular/core';
import {
  addDays,
  eachDayOfInterval
} from 'date-fns';
import {
  BehaviorSubject
} from 'rxjs';
import {
  concatMap,
  map,
  take
} from 'rxjs/operators';
import {
  TagesObjekt
} from '../interfaces/tages-objekt';
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
  esr_plan$ = this.esr_plan.asObservable(); //leere Tagesbehälter mit Fahrten, Prüfungen und Ferien.
  datum = new Date();

  planDatum = new BehaviorSubject(null);
  planDatum$ = this.planDatum.asObservable();

  ferienListe;

  aktuelleEpo$ = this.planDatum$.pipe(
    concatMap(x => {
      return this.klassenplan.grundPlanfaecher$.pipe(take(1))
    }),
    map(
      z => {
        if (this.planDatum.getValue().getDay() == 0) {
          this.planDatum.next(addDays(this.planDatum.getValue(), 1));
        } else if (this.planDatum.getValue().getDay() == 6) {
          this.planDatum.next(addDays(this.planDatum.getValue(), 2));
        }

       // console.log(z);
        let schItems = [];
        let epoItems = [];
        let rhyItems = [];
        z.forEach(ele => {
           //  console.log(ele.schiene);
            if (ele.schiene > 0) {
           //   console.log(ele);
              if (ele.zuweisung.schiene.findIndex(eleh => eleh.start <= this.planDatum.getValue() && eleh.ende >= this.planDatum.getValue()) !== -1) {
                schItems.push(ele)
              };
            }
            if (ele.epoche > 0) {
              if (ele.zuweisung.epoche.findIndex(eleh => eleh.start <= this.planDatum.getValue() && eleh.ende >= this.planDatum.getValue()) !== -1) {
                epoItems.push(ele)
              };
            };

            if (ele.rhythmus > 0) {
              if (ele.zuweisung.rhythmus.findIndex(eleh => eleh.start <= this.planDatum.getValue() && eleh.ende >= this.planDatum.getValue()) !== -1) {
                rhyItems.push(ele)
              };


          }
        });

      //Ich teile die Items auf, da ich sonst in epoche und schiene dasselbe Item bekomme mit aktueller lokik am ende

      //  let schItems = z.filter(ele => ele.schiene > 0 );
      //  let epoItems = z.filter(ele => ele.epoche > 0 && ele.zuweisung.epoche.findIndex(eleh => eleh.start <= this.planDatum.getValue() && eleh.ende >= this.planDatum.getValue()) !== -1);
      // let rhyItems = z.filter(ele => ele.rhythmus > 0 && ele.zuweisung.rhythmus.findIndex(eleh => eleh.start <= this.planDatum.getValue() && eleh.ende >= this.planDatum.getValue()) !== -1);
     // console.log(schItems); console.log(epoItems); console.log(rhyItems);
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
        obj[this.zahlinKlasse(element.klasse)].epo.push({
          fach: element.fach,
          lehrerKuerz: element.lehrer[0].kuerzel
        });
      }); rhyItems.forEach(element => {
        obj[this.zahlinKlasse(element.klasse)].rhy.push({
          fach: element.fach,
          lehrerKuerz: element.lehrer[0].kuerzel
        });
      }); schItems.forEach(element => {
        obj[this.zahlinKlasse(element.klasse)].sch.push({
          fach: element.fach,
          lehrerKuerz: element.lehrer[0].kuerzel
        });
      });// console.log(obj);
      return obj;
    })
);

zahlinKlasse(za) {
  // console.log(za);
  let zahl = parseInt(za);
  switch (zahl) {
    case 1:
      return 'eins';
      case 2:
      return 'zwei';
      case 3:
      return 'drei';
      case 4:
      return 'vier';
      case 5:
      return 'fuenf';
      case 6:
      return 'sechs';
      case 7:
      return 'sieben';
      case 8:
      return 'acht';
    case 9:
      return 'neun';
    case 10:
      return 'zehn';
    case 11:
      return 'elf';
    case 12:
      return 'zwoelf';
      case 13:
        return "dreizehn";
  }
}

constructor(public ferienTermServ: FerientermineService, public klassenplan: KlassenplaeneService) {

  this.klassenplan.ferienListe$.subscribe(data => this.ferienListe = data);

  let blankoPlan: Array < Array < TagesObjekt >>= [
    [],
    [],
    [],
    []
  ];
  let tagesObj: TagesObjekt = {
    tag: new Date(),
    notiz: "",
    unterricht: [],
    fahrten: [],
    pruefungen: [],
    ferien: [] //pruefungen, ferien
  };
  blankoPlan.forEach(absch => {
    absch.push(tagesObj);
    absch.push(tagesObj);
  });

  this.esr_plan.next(blankoPlan);
  let datum = new Date();
 this.planDatum.next(addDays(datum,0));



}
}
