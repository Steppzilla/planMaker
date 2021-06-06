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
import {
  Lehrer
} from '../interfaces/lehrer';
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

  berechnung(element) {
    console.log("Methode Start");
    console.log(element.lehrer[0]);
    let grundplanf = this.grundPlanfaecher.getValue();
    let schieneElem = grundplanf.find(ele => ele.fach == Fach.schiene&&ele.klasse==element.klasse);
    let huElem = grundplanf.find(ele => ele.fach == Fach.hauptunterricht&&ele.klasse==element.klasse);
    let rhythmElem = grundplanf.find(ele => ele.fach == Fach.rhythmisch&&ele.klasse==element.klasse);
    let jahresStundenWert = 30;

    grundplanf = grundplanf.filter(function (el) {
      return el != null;
    });

   // grundplanf.forEach(element => {

      //Wochenstunden für Schiene/Rhythmus und Epoche herauslesen (in Stundenplan zu überprüfen ob es tatsächlich ist):

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
      let uebstundeIST=0;

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
        if (element.uebstunde > 0&&element.fach==Fach.deutsch) {
        console.log("teilung und gleiche elemente:")
        console.log(teilung);
        console.log(gleicheElemente);
        }

        uebstundeIST= uebstundeIST+(gleicheElemente/teilung);
         

      });

      //für epoche, schiene, rhythmus auch?

     // console.log(inhaltZelle);
      

      if (element.uebstunde > 0&&element.fach==Fach.deutsch) {
        console.log("Uebstunde: Soll/IST: " + uebstundenSoll + " / " +uebstundeIST + "klasse : " + element.klasse) + "."; //gesamtstunden ist verrechnet, uebstundeIst noch alt
    //  console.log(uebstundeIST);
      }
      // console.log("rhytmus: Soll/IST: " + rhythmusSoll * jahresStundenWert / rhythmElem.wochenstunden + " / " + rhythmusIST * jahresStundenWert / rhythmElem.wochenstunden) + ".";
      // console.log("epoche: Soll/IST: " + epochenSoll * jahresStundenWert / huElem.wochenstunden + " / " + epocheIST * jahresStundenWert / huElem.wochenstunden) + ".";

      //console.log("schiene: Soll/IST: " + schieneSoll*jahresStundenWert/5 + " / "  + schieneIST*jahresStundenWert/5) + ".";
      // console.log("------");
      // console.log("Erwartete Gesamtstunden  ");
      // console.log(soll);

      //13. klasse deutsch: zwei Lherer, daher 2 verschiedene Elemten, daher wieder zurückrechnen:
      if(element.klasse==Lehrjahr.dreizehn&&element.fach==Fach.deutsch){
        uebstundeIST=uebstundeIST*2;
      }
 
      return uebstundeIST;
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
        gesamtArrayF.push(ele);
      });
    });
    this.grundPlanfaecher.next(gesamtArrayF);
  }

  elementHinzufuegen(fach: Fach, klasse: Lehrjahr) {
    let ele: Elementt = this.neuesElement(fach, klasse);
    console.log(this.grundPlanfaecher.value);
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
    console.log(this.grundPlanfaecher.value);
    this.grundPlanfaecher.next(this.grundPlanfaecher.getValue().concat(ele));
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
