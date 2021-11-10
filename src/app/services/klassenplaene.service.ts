import {
  Injectable
} from '@angular/core';
import {
  differenceInBusinessDays
} from 'date-fns';
import {
  BehaviorSubject,
  Observable
} from 'rxjs';
import {
  map,
  filter
} from 'rxjs/operators';
import {
  Fach
} from '../enums/fach.enum';
import {
  Lehrjahr
} from '../enums/lehrjahr.enum';
import {
  Raum
} from '../enums/raum.enum';
import {
  Elementt
} from '../interfaces/elementt';
import { Ferientermin } from '../interfaces/ferientermin';
import {
  Lehrer
} from '../interfaces/lehrer';
import { Pruefungstermin } from '../interfaces/pruefungstermin';
import { Termin } from '../interfaces/termin';
import {
  KlassenFaecherService
} from './klassen-faecher.service';
import {
  LehrerService
} from './lehrer.service';

@Injectable({
  providedIn: 'root'
})
export class KlassenplaeneService {
  grundPlanfaecher = new BehaviorSubject < Array < Elementt >> (null);
  grundPlanfaecher$ = this.grundPlanfaecher.asObservable();

  lehrerListe= new BehaviorSubject<Array<Lehrer>>(null);
  lehrerListe$=this.lehrerListe.asObservable();

  
  terminListe= new BehaviorSubject<Array<Termin>>(null);
  terminListe$=this.terminListe.asObservable();

  pruefungsListe= new BehaviorSubject<Array<Pruefungstermin>>(null);
  pruefungsListe$=this.pruefungsListe.asObservable();

  ferienListe= new BehaviorSubject<Array<Ferientermin>>(null);
  ferienListe$=this.ferienListe.asObservable();

  
  klassenArray$: Observable < {
      [key: string]: Elementt[]
    } >=
    this.grundPlanfaecher$.pipe(
      filter(r => r !== null),
      map(x => {
        let obj: {
          [key: string]: Elementt[]
        } = {};
        x.forEach((ele: Elementt) => {
          if (obj[ele.klasse] === undefined) {
            obj[ele.klasse] = [];
          }
          obj[ele.klasse].push(ele);
        });
        return obj;
      })
    );

  

  esrPlaan$=
    this.grundPlanfaecher$.pipe(
      filter(r => r !== null),
      map(x => {
        let obj = {
          rhythmus: {
            neun: [],
            zehn: [],
            elf: [],
            zwoelf: []
          },
          epoche: {
            neun: [],
            zehn: [],
            elf: [],
            zwoelf: []
          },
          schiene: {
            neun: [],
            zehn: [],
            elf: [],
            zwoelf: []
          }
        };
        x.forEach(ele => {
          ["rhythmus", "schiene", "epoche"].forEach(esrR => {
            if (ele[esrR] > 0) {
              obj[esrR][this.zahlInWort(parseInt(ele.klasse))].push(ele);
            }
          });
        });

        return obj;
      }));

  zahlInWort(str: number) {
    switch (str) {
      case 9:
        return "neun";
      case 10:
        return "zehn";
      case 11:
        return "elf";
      case 12:
        return "zwoelf";
    }
  }


  berechnung(element) {
    let grundplanf = this.grundPlanfaecher.getValue();
    grundplanf = grundplanf.filter(function (el) {
      return el != null;
    });
    let schieneElem = grundplanf.find(ele => ele.fach == Fach.schiene && ele.klasse == element.klasse);
    let huElem = grundplanf.find(ele => ele.fach == Fach.hauptunterricht && ele.klasse == element.klasse);
    let rhythmElem = grundplanf.find(ele => ele.fach == Fach.rhythmisch && ele.klasse == element.klasse);
    let jahresStundenWert = 30;

 

    let epochenSoll = element.epoche; //soll Epoche
    let schieneSoll = element.schiene; //soll Schiene
    let rhythmusSoll = element.rhythmus; //Soll rhythmus
    let uebstundenSoll = element.uebstunde; //soll Uebstunde

    // let uebstundeIST = element.zuweisung.uebstunde.length;
    let rhythmusIST = 0; //logisch errechnete Stunden Wochen mal anzahl der Wochenstunden vom rhythmus

    element.zuweisung.rhythmus.forEach(startEnde => {
      let start = startEnde.start; //Date
      let ende = startEnde.ende;
      let wochen = (differenceInBusinessDays(ende, start) + 1) / 5;
      rhythmusIST = rhythmusIST + (wochen * rhythmElem.wochenstunden) / jahresStundenWert;
    });

    let epocheIST = 0;
    element.zuweisung.epoche.forEach(startEnde => {
      let start = startEnde.start; //Date
      let ende = startEnde.ende;
      let wochen = (differenceInBusinessDays(ende, start) + 1) / 5;
      epocheIST = epocheIST + wochen * huElem.wochenstunden / jahresStundenWert;
    });

    let schieneIST = 0;

    element.zuweisung.schiene.forEach(startEnde => {
      let start = startEnde.start; //Date
      let ende = startEnde.ende;
      let wochen = (differenceInBusinessDays(ende, start) + 1) / 5;
      schieneIST = schieneIST + wochen * schieneElem.wochenstunden / jahresStundenWert;
    });

    // let uebDiff = uebstundenSoll - uebstundeIST;
    let rhythmDiff = rhythmusSoll - rhythmusIST;
    let epochenDiff = epochenSoll - epocheIST;
    let schieneDiff = schieneSoll - schieneIST;
    //uebstunden herausfinden wo doppelte Fächer drin sind / Teilungen (halbe klassen)

    let inhaltZelle = [];
    let teilung = 0;
    // let elementspeicher:Elementt;
    let gleicheElemente = 0;
    let uebstundeIST = 0;

    element.zuweisung.uebstunde.forEach((zuwEle, z) => {
      gleicheElemente = 0;
      grundplanf.forEach(ele => {
        if (ele && ele.zuweisung && ele.zuweisung.uebstunde) {
          ele.zuweisung.uebstunde.forEach(woStd => {
            if (woStd.wochentag == zuwEle.wochentag && woStd.stunde == zuwEle.stunde && ele.klasse == element.klasse) {
              if (inhaltZelle[z] == null) {
                inhaltZelle[z] = [];
              }
              inhaltZelle[z].push(ele);
              if (ele.fach == element.fach) {
                gleicheElemente++;
              }
            }
          });
        }
      });
      // bei einzelner zuweisung des elements:
      teilung = inhaltZelle[z].length;
      uebstundeIST = uebstundeIST + (gleicheElemente / teilung);
    });
    //für epoche, schiene, rhythmus auch?

    if (element.uebstunde > 0 && element.fach == Fach.deutsch) {
      //    console.log("Uebstunde: Soll/IST: " + uebstundenSoll + " / " +uebstundeIST + "klasse : " + element.klasse) + "."; //gesamtstunden ist verrechnet, uebstundeIst noch al
    }
    //13. klasse deutsch: zwei Lherer, daher 2 verschiedene Elemten, daher wieder zurückrechnen:
    if (element.klasse == Lehrjahr.dreizehn && element.fach == Fach.deutsch) {
      uebstundeIST = uebstundeIST * 2;
    }
    return Math.round(uebstundeIST*10)/10;
  }

  grundPlanerstellen() { //einmal im Konstruktor ausgeführt
    let gesamtArrayF: Array < Elementt >= [];
    this.klassenFaecher.zuweisungen.forEach(([fachh, lehrjahre, nummer]: [Fach, Array < Lehrjahr > , number]) => {
      lehrjahre.forEach(lehrjahr => {
        let ele: Elementt = {
          fach: fachh,
          klasse: lehrjahr,
          wochenstunden: nummer,
          raum: Raum.null,
          lehrer: [],
          uebstunde: nummer,
          rhythmus: 0,
          schiene: 0,
          epoche: 0,
          zuweisung: {
            uebstunde: [],
            rhythmus: [],
            epoche: [],
            schiene: []
          }
        };
        gesamtArrayF.push(ele);
      });
    });
    this.grundPlanfaecher.next(gesamtArrayF);
  }

  elementHinzufuegen(fach: Fach, klasse: Lehrjahr) {
    let ele: Elementt = this.neuesElement(fach, klasse);
   // console.log(this.grundPlanfaecher.value);
    this.grundPlanfaecher.next(this.grundPlanfaecher.getValue().concat(ele)); //concat ist zum hinzufügen
  }

  neuesElement(fach: Fach, klasse: Lehrjahr) {
    let ele: Elementt = {
      fach: fach,
      klasse: klasse,
      wochenstunden: 0,
      raum: Raum.null,
      lehrer: [],
      uebstunde: 0,
      rhythmus: 0,
      schiene: 0,
      epoche: 0,
      zuweisung: {
        uebstunde: [],
        rhythmus: [],
        epoche: [],
        schiene: []
      }
    };
    return ele;
  }

  elementHinzufuegenmitLehrer(fach: Fach, klasse: Lehrjahr, lehrer: Lehrer) {
    let ele: Elementt = this.neuesElementmitLehrer(fach, klasse, lehrer);
   // console.log(this.grundPlanfaecher.value);
    this.grundPlanfaecher.next(this.grundPlanfaecher.getValue().concat(ele));
    console.log(this.grundPlanfaecher.getValue());
  }

  neuesElementmitLehrer(fach: Fach, klasse: Lehrjahr, lehrer: Lehrer) {
    let ele: Elementt = {
      fach: fach,
      klasse: klasse,
      wochenstunden: 0,
      raum: Raum.null,
      lehrer: [lehrer],
      uebstunde: 0,
      rhythmus: 0,
      schiene: 0,
      epoche: 0,
      zuweisung: {
        uebstunde: [],
        rhythmus: [],
        epoche: [],
        schiene: []
      }
    };
    return ele;
  }

  elementeZuruecksetzen(fach: Fach, klas: Lehrjahr) {
    let neuesARray = this.grundPlanfaecher.getValue();
    neuesARray = neuesARray.filter(function (el) {
      return el != null;
    });
    let counter = 0;
    neuesARray.forEach((elem, e) => {
      if (elem.fach == fach && elem.klasse == klas) {
        elem.lehrer = [];
        counter++;
      }
      if ((counter > 1) && (elem.fach == fach) && (elem.klasse == klas)) {
        //  this.elementZurücksetzen(elem);
        delete neuesARray[e];
        console.log("zurückgesetzt");
      }
    });
    this.grundPlanfaecher.next(neuesARray);
  }

  elementLoeschen(fach: Fach, klasse: Lehrjahr) {
    let neuesArray = this.grundPlanfaecher.getValue();
    neuesArray = neuesArray.filter(function (el) {
      return el != null;
    });
    neuesArray.forEach((el, index) => {
      if (el.fach == fach && el.klasse == klasse) {
        delete neuesArray[index];
      }
    });
    neuesArray = neuesArray.filter(function (el) {
      return el != null;
    });
    this.grundPlanfaecher.next(neuesArray);
  }

  zahlinWorte(num: number) {
    switch (num) {
      case 0:
        return "null";
      case 1:
        return "eins";
      case 2:
        return "zwei";
      case 3:
        return "drei";
      case 4:
        return "vier";
      case 5:
        return "fuenf";
      case 6:
        return "sechs";
      case 7:
        return "sieben";
      case 8:
        return "acht";
      case 9:
        return "neun";
      case 10:
        return "zehn";
      case 11:
        return "elf";
      case 12:
        return "zwoelf";
      case 13:
        return "dreizehn";
    }
  }

  constructor(public klassenFaecher: KlassenFaecherService, public lehrerServ: LehrerService) {
    this.grundPlanerstellen();

  }
}
