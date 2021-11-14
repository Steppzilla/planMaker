import {
  Component,
  OnInit
} from '@angular/core';
import {
  addDays
} from 'date-fns';
import differenceInBusinessDays from 'date-fns/differenceInBusinessDays';
import {
  concatMap,
  map,
  take,
} from 'rxjs/operators';
import {
  Fach
} from 'src/app/enums/fach.enum';
import {
  Lehrjahr
} from 'src/app/enums/lehrjahr.enum';
import {
  Elementt
} from 'src/app/interfaces/elementt';
import {
  TagesObjekt
} from 'src/app/interfaces/tages-objekt';

import {
  EpochenPlaeneService
} from 'src/app/services/epochen-plaene.service';
import {
  FerientermineService
} from 'src/app/services/ferientermine.service';
import {
  KlassenplaeneService
} from 'src/app/services/klassenplaene.service';
import {
  LehrerService
} from 'src/app/services/lehrer.service';
import {
  LoginService
} from 'src/app/services/login.service';

@Component({
  selector: 'app-esr-plan',
  templateUrl: './esr-plan.component.html',
  styleUrls: ['./esr-plan.component.scss']
})
export class EsrPlanComponent implements OnInit {

  iix = Lehrjahr.acht;
  ix = Lehrjahr.neun;
  x = Lehrjahr.zehn;
  xi = Lehrjahr.elf;
  xii = Lehrjahr.zwoelf;

  termineEinblenden = false;



  grundPlanfaecher: Array < Elementt > ;
  esrPlan: Array < Array < TagesObjekt >> ;
  selectLehrer;

  absch = 0;
  gewaehlterPlan = "rhythmus";
  gewaehltesElement: Elementt;
  clickCount = 0;

  printAktiv = false;

  reiheFachStunden(zeilenArray, fach, stunden, esr, klasse) {
 
    //SONDERPLAN für WAHLFAC HUND CHOR NOCH MACHEN!!!?? Wenn fach ghleich ist zb??
    let fachAuswahl = zeilenArray.filter(el => el.fach == fach && el.zuweisung[esr].length > 0 ); //Elemente mit dem Fach rausfiltern /Reduktion
    
    let andereFaecher = zeilenArray.filter(el => el.fach !== fach);
    let abzug = 0;
    if(fachAuswahl.length>1){
      abzug=1;

      if (fach === Fach.wahlpflicht) {
        abzug = 2;
      }
  
    }
    //gleichzeitige elemente suchen... und Anzahl ermitteln, um zu wissen, ob gedrittelt oder geteilt wird... (ausser Wahlpflicht oder klassenübergreifendes, Chor aktuell noch)
    fachAuswahl.forEach(elem => {
      elem.zuweisung[esr].forEach(unterricht => {

        let teilcount = 1; //das fach selbst zählt ja mit beim Teilen am ende dur den counter
        let teilzeit = 0;
        //Verinefacht: nur am startzeitpunkt wird geprüft ob fächer gleichzeitig sind, die sind hoffentlich immer auch parallel geschaltet und nicht verschoben...?
        //alle anderen fächer durchprüfen ob gleiche startzeit:
        andereFaecher.forEach(anderes => {
          anderes.zuweisung[esr].forEach(unti2 => {
            // let zeitspeicher=0; 
            //     console.log(anderes);
            if (unti2.start.getTime() == unterricht.start.getTime()) {
              teilcount++;
              if(esr=="rhythmus"){
              teilzeit = teilzeit + (differenceInBusinessDays(unterricht.ende, unterricht.start) + 1) / 5 / 6;
              }
              if(esr=="epoche"){
                teilzeit = teilzeit + (differenceInBusinessDays(unterricht.ende, unterricht.start) + 1) / 5 / 3;
                }
                if(esr=="schiene"){
                  teilzeit = teilzeit + (differenceInBusinessDays(unterricht.ende, unterricht.start) + 1) / 5 / 5;
                  }
            }
            //
          });

        });
        //für die einzelepoche wird die stunde auf den fachteimer raufgerechnet
        abzug = abzug + teilzeit / teilcount;
      });
    });
   //wenn 2 lehrer dasselbe Fach machen, zb chor oder Wahlpflicht, wo unterschiedlcihe lehrer dasselbe fach "Wahlpflicht" machen
      //Bei wahlpflicht 2 abziehn
      //Bei chor nur 1, weils nur 2 machen...


    return stunden - abzug;
  }

  rhythmusElemente$ = this.klassenplanServ.esrPlaan$.pipe(
    concatMap(b => {
      return this.klassenplanServ.esrPlaan$.pipe(take(1));
    }),
    map(z => {
      let obj = {
        neun: z.rhythmus.neun,
        zehn: z.rhythmus.zehn,
        elf: z.rhythmus.elf,
        zwoelf: z.rhythmus.zwoelf
      }
      let ar9 = [];


      obj.neun.forEach(ele => {
        if (!ar9[ele.fach]) {
          let gesamtdauer = 0;
          ele.zuweisung.rhythmus.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 6;
          });
          ar9[ele.fach] = gesamtdauer;
          // console.log(ar9[ele.fach]);
        } else {
          //console.log(ar9[ele.fach]);
          let gesamtdauer = 0;
          ele.zuweisung.rhythmus.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 6;
          });
          ar9[ele.fach] = ar9[ele.fach] + gesamtdauer; //6 sind eine epoche im rhythmusteil
        }
      });
      //Elemente erweitern mit stundengesamt
      obj.neun.forEach((ele, e) => {
        obj.neun[e] = {
          fach: obj.neun[e].fach,
          klasse: obj.neun[e].klasse,
          lehrer: obj.neun[e].lehrer,
          zuweisung: obj.neun[e].zuweisung,
          stundenGesamt: ar9[ele.fach],
          rhythmus: obj.neun[e].rhythmus
        }
      });

      let ar10 = [];
      obj.zehn.forEach(ele => {
        if (!ar10[ele.fach]) {
          let gesamtdauer = 0;
          ele.zuweisung.rhythmus.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 6;
          });
          ar10[ele.fach] = gesamtdauer;
          // console.log(ar9[ele.fach]);
        } else {
          //console.log(ar9[ele.fach]);
          let gesamtdauer = 0;
          ele.zuweisung.rhythmus.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 6;
          });
          ar10[ele.fach] = ar10[ele.fach] + gesamtdauer; //6 sind eine epoche im rhythmusteil
        }
      });
      //Elemente erweitern mit stundengesamt
      obj.zehn.forEach((ele, e) => {
        obj.zehn[e] = {
          fach: obj.zehn[e].fach,
          klasse: obj.zehn[e].klasse,
          lehrer: obj.zehn[e].lehrer,
          zuweisung: obj.zehn[e].zuweisung,
          stundenGesamt: ar10[ele.fach],
          rhythmus: obj.zehn[e].rhythmus
        }
      });


      let ar11 = [];
      obj.elf.forEach(ele => {
        if (!ar11[ele.fach]) {
          let gesamtdauer = 0;
          ele.zuweisung.rhythmus.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 6;
          });
          ar11[ele.fach] = gesamtdauer;
          // console.log(ar9[ele.fach]);
        } else {
          //console.log(ar9[ele.fach]);
          let gesamtdauer = 0;
          ele.zuweisung.rhythmus.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 6;
          });
          ar11[ele.fach] = ar11[ele.fach] + gesamtdauer; //6 sind eine epoche im rhythmusteil
        }
      });
      //Elemente erweitern mit stundengesamt
      obj.elf.forEach((ele, e) => {
        obj.elf[e] = {
          fach: obj.elf[e].fach,
          klasse: obj.elf[e].klasse,
          lehrer: obj.elf[e].lehrer,
          zuweisung: obj.elf[e].zuweisung,
          stundenGesamt: ar11[ele.fach],
          rhythmus: obj.elf[e].rhythmus
        }
      });



      let ar12 = [];
      obj.zwoelf.forEach(ele => {
        if (!ar12[ele.fach]) {
          let gesamtdauer = 0;
          ele.zuweisung.rhythmus.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 6;
          });
          ar12[ele.fach] = gesamtdauer;
          // console.log(ar9[ele.fach]);
        } else {
          //console.log(ar9[ele.fach]);
          let gesamtdauer = 0;
          ele.zuweisung.rhythmus.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 6;
          });
          ar12[ele.fach] = ar12[ele.fach] + gesamtdauer; //6 sind eine epoche im rhythmusteil
        }
      });
      //Elemente erweitern mit stundengesamt
      obj.zwoelf.forEach((ele, e) => {
        obj.zwoelf[e] = {
          fach: obj.zwoelf[e].fach,
          klasse: obj.zwoelf[e].klasse,
          lehrer: obj.zwoelf[e].lehrer,
          zuweisung: obj.zwoelf[e].zuweisung,
          stundenGesamt: ar12[ele.fach],
          rhythmus: obj.zwoelf[e].rhythmus
        }
      });





      return obj;
    })
  );




  epochenElemente$ = this.klassenplanServ.esrPlaan$.pipe(
    concatMap(b => {
      return this.klassenplanServ.esrPlaan$.pipe(take(1));
    }),
    map(z => {
      let obj = {
        neun: z.epoche.neun,
        zehn: z.epoche.zehn,
        elf: z.epoche.elf,
        zwoelf: z.epoche.zwoelf
      }



      let ar9 = [];
      obj.neun.forEach(ele => {
        if (!ar9[ele.fach]) {
          let gesamtdauer = 0;
          ele.zuweisung.epoche.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 3;
          });
          ar9[ele.fach] = gesamtdauer;
          // console.log(ar9[ele.fach]);
        } else {
          //console.log(ar9[ele.fach]);
          let gesamtdauer = 0;
          ele.zuweisung.epoche.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 3;
          });
          ar9[ele.fach] = ar9[ele.fach] + gesamtdauer; //6 sind eine epoche im rhythmusteil
        }
      });
      obj.neun.forEach((ele, e) => {
        obj.neun[e] = {
          fach: obj.neun[e].fach,
          klasse: obj.neun[e].klasse,
          lehrer: obj.neun[e].lehrer,
          zuweisung: obj.neun[e].zuweisung,
          stundenGesamt: ar9[ele.fach],
          epoche: obj.neun[e].epoche
        }
      });

      let ar10 = [];
      obj.zehn.forEach(ele => {
        if (!ar10[ele.fach]) {
          let gesamtdauer = 0;
          ele.zuweisung.epoche.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 3;
          });
          ar10[ele.fach] = gesamtdauer;
          // console.log(ar9[ele.fach]);
        } else {
          //console.log(ar9[ele.fach]);
          let gesamtdauer = 0;
          ele.zuweisung.epoche.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 3;
          });
          ar10[ele.fach] = ar10[ele.fach] + gesamtdauer; //6 sind eine epoche im rhythmusteil
        }
      });
      obj.zehn.forEach((ele, e) => {
        obj.zehn[e] = {
          fach: obj.zehn[e].fach,
          klasse: obj.zehn[e].klasse,
          lehrer: obj.zehn[e].lehrer,
          zuweisung: obj.zehn[e].zuweisung,
          stundenGesamt: ar10[ele.fach],
          epoche: obj.zehn[e].epoche
        }
      });

      let ar11 = [];
      obj.elf.forEach(ele => {
        if (!ar11[ele.fach]) {
          let gesamtdauer = 0;
          ele.zuweisung.epoche.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 3;
          });
          ar11[ele.fach] = gesamtdauer;
          // console.log(ar9[ele.fach]);
        } else {
          //console.log(ar9[ele.fach]);
          let gesamtdauer = 0;
          ele.zuweisung.epoche.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 3;
          });
          ar11[ele.fach] = ar11[ele.fach] + gesamtdauer; //6 sind eine epoche im rhythmusteil
        }
      });
      obj.elf.forEach((ele, e) => {
        obj.elf[e] = {
          fach: obj.elf[e].fach,
          klasse: obj.elf[e].klasse,
          lehrer: obj.elf[e].lehrer,
          zuweisung: obj.elf[e].zuweisung,
          stundenGesamt: ar11[ele.fach],
          epoche: obj.elf[e].epoche
        }
      });
      let ar12 = [];
      obj.zwoelf.forEach(ele => {
        if (!ar12[ele.fach]) {
          let gesamtdauer = 0;
          ele.zuweisung.epoche.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 3;
          });
          ar12[ele.fach] = gesamtdauer;
          // console.log(ar9[ele.fach]);
        } else {
          //console.log(ar9[ele.fach]);
          let gesamtdauer = 0;
          ele.zuweisung.epoche.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 3;
          });
          ar12[ele.fach] = ar12[ele.fach] + gesamtdauer; //6 sind eine epoche im rhythmusteil
        }
      });
      obj.zwoelf.forEach((ele, e) => {
        obj.zwoelf[e] = {
          fach: obj.zwoelf[e].fach,
          klasse: obj.zwoelf[e].klasse,
          lehrer: obj.zwoelf[e].lehrer,
          zuweisung: obj.zwoelf[e].zuweisung,
          stundenGesamt: ar12[ele.fach],
          epoche: obj.zwoelf[e].epoche
        }
      });

      return obj;
    })
  );

  schieneElemente$ = this.klassenplanServ.esrPlaan$.pipe(
    concatMap(b => {
      return this.klassenplanServ.esrPlaan$.pipe(take(1));
    }),
    map(z => {
      let obj = {
        neun: z.schiene.neun,
        zehn: z.schiene.zehn,
        elf: z.schiene.elf,
        zwoelf: z.schiene.zwoelf
      }


      let ar9 = [];
      obj.neun.forEach(ele => {
        if (!ar9[ele.fach]) {
          let gesamtdauer = 0;
          ele.zuweisung.schiene.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 5;
          });
          ar9[ele.fach] = gesamtdauer;
          // console.log(ar9[ele.fach]);
        } else {
          //console.log(ar9[ele.fach]);
          let gesamtdauer = 0;
          ele.zuweisung.schiene.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 5;
          });
          ar9[ele.fach] = ar9[ele.fach] + gesamtdauer; //6 sind eine epoche im rhythmusteil
        }
      });
      obj.neun.forEach((ele, e) => {
        obj.neun[e] = {
          fach: obj.neun[e].fach,
          klasse: obj.neun[e].klasse,
          lehrer: obj.neun[e].lehrer,
          zuweisung: obj.neun[e].zuweisung,
          stundenGesamt: ar9[ele.fach],
          schiene: obj.neun[e].schiene
        }
      });

      let ar10 = [];
      obj.zehn.forEach(ele => {
        if (!ar10[ele.fach]) {
          let gesamtdauer = 0;
          ele.zuweisung.schiene.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 5;
          });
          ar10[ele.fach] = gesamtdauer;
          // console.log(ar9[ele.fach]);
        } else {
          //console.log(ar9[ele.fach]);
          let gesamtdauer = 0;
          ele.zuweisung.schiene.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 5;
          });
          ar10[ele.fach] = ar10[ele.fach] + gesamtdauer; //6 sind eine epoche im rhythmusteil
        }
      });
      obj.zehn.forEach((ele, e) => {
        obj.zehn[e] = {
          fach: obj.zehn[e].fach,
          klasse: obj.zehn[e].klasse,
          lehrer: obj.zehn[e].lehrer,
          zuweisung: obj.zehn[e].zuweisung,
          stundenGesamt: ar10[ele.fach],
          schiene: obj.zehn[e].schiene
        }
      });

      let ar11 = [];
      obj.elf.forEach(ele => {
        if (!ar11[ele.fach]) {
          let gesamtdauer = 0;
          ele.zuweisung.schiene.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 5;
          });
          ar11[ele.fach] = gesamtdauer;
          // console.log(ar9[ele.fach]);
        } else {
          //console.log(ar9[ele.fach]);
          let gesamtdauer = 0;
          ele.zuweisung.schiene.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 5;
          });
          ar11[ele.fach] = ar11[ele.fach] + gesamtdauer; //6 sind eine epoche im rhythmusteil
        }
      });
      obj.elf.forEach((ele, e) => {
        obj.elf[e] = {
          fach: obj.elf[e].fach,
          klasse: obj.elf[e].klasse,
          lehrer: obj.elf[e].lehrer,
          zuweisung: obj.elf[e].zuweisung,
          stundenGesamt: ar11[ele.fach],
          schiene: obj.elf[e].schiene
        }
      });

      let ar12 = [];
      obj.zwoelf.forEach(ele => {
        if (!ar12[ele.fach]) {
          let gesamtdauer = 0;
          ele.zuweisung.schiene.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 5;
          });
          ar12[ele.fach] = gesamtdauer;
          // console.log(ar9[ele.fach]);
        } else {
          //console.log(ar9[ele.fach]);
          let gesamtdauer = 0;
          ele.zuweisung.schiene.forEach(element => {
            gesamtdauer = gesamtdauer + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 5;
          });
          ar12[ele.fach] = ar12[ele.fach] + gesamtdauer; //6 sind eine epoche im rhythmusteil
        }
      });
      obj.zwoelf.forEach((ele, e) => {
        obj.zwoelf[e] = {
          fach: obj.zwoelf[e].fach,
          klasse: obj.zwoelf[e].klasse,
          lehrer: obj.zwoelf[e].lehrer,
          zuweisung: obj.zwoelf[e].zuweisung,
          stundenGesamt: ar12[ele.fach],
          schiene: obj.zwoelf[e].schiene
        }
      });


      return obj;
    })
  );


  tagimAbschnitt(ele, date, plan) {
    let zaehler = 0;
    ele.zuweisung[plan].forEach(epoche => {
      if (epoche.start <= date && epoche.ende >= date) {
        zaehler++;
      }
    });
    return zaehler >= 1 ? ele : null;
    // console.log(ele.zuweisung.rhythmus);
    // console.log(date); //definiert, datum!
  }


  elementeDesTages(epochenElementenArray, date, epochenPlanName) {
    let ar = [];
    epochenElementenArray.forEach(element => {
      element.zuweisung[epochenPlanName].forEach(epochenElem => {
        if (epochenElem.start <= date && epochenElem.ende >= date) {
          ar.push(element);
        }
      });

    });
    return ar;
  }

  kuerzen(text) {
    return text.slice(0, 5);
  }

  breite(klassenItems, tag, zeilenIndex, esrLang, abschnitt) {
    //console.log(abschnitt);

    let enddate = abschnitt[abschnitt.length - 1].tag;
    let breite = 1;
    let items = klassenItems.filter(element => (element.zuweisung[esrLang].length > 0));
    let item = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= tag && ele.ende >= tag) != -1);
    let item2 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 7) && ele.ende >= addDays(tag, 7)) != -1);
    let item3 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 14) && ele.ende >= addDays(tag, 14)) != -1);
    let item4 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 21) && ele.ende >= addDays(tag, 21)) != -1);
    let item5 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 28) && ele.ende >= addDays(tag, 28)) != -1);
    let item6 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 35) && ele.ende >= addDays(tag, 35)) != -1);
    let item7 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 42) && ele.ende >= addDays(tag, 42)) != -1);
    let item8 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 49) && ele.ende >= addDays(tag, 49)) != -1);
    let item9 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 56) && ele.ende >= addDays(tag, 56)) != -1);
    let item10 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 63) && ele.ende >= addDays(tag, 63)) != -1);


    if (this.equals(item, item2) && addDays(tag, 7) <= enddate) {
      // console.log("isgleich");
      breite = 2;

      if (addDays(tag, 14) <= enddate && this.equals(item2, item3)) { //und keine fahrt in der zeit
        breite = 3;
        if (addDays(tag, 21) <= enddate && this.equals(item3, item4)) {
          breite = 4;
          if (addDays(tag, 28) <= enddate && this.equals(item4, item5)) {
            breite = 5;
            if (addDays(tag, 35) <= enddate && this.equals(item5, item6)) {
              breite = 6;
              if (addDays(tag, 42) <= enddate && this.equals(item6, item7)) {
                breite = 7;
                if (addDays(tag, 49) <= enddate && this.equals(item7, item8)) {
                  breite = 8;
                  if (addDays(tag, 56) <= enddate && this.equals(item8, item9)) {
                    breite = 9;
                    if (addDays(tag, 63) <= enddate && this.equals(item9, item10)) {
                      breite = 10;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {}
    // console.log(breite);
    return breite;
  }

  equals(cell1, cell2) {
    //  console.log(cell1); 
    //console.log
    let counter = 0;
    if (cell1.length != 0 && cell1.length == cell2.length) {
      cell1.forEach(unterricht => {
        cell2.forEach(u => {
          if (unterricht.lehrer[0].kuerzel == u.lehrer[0].kuerzel && unterricht.fach == u.fach) {
            counter++;
          }
        });
      });
    }

    return counter >= cell2.length && counter != 0 ? true : false;
  }



  klassenFahrtBreite(abschnitt, box, klasseZahl, i) {
    let tag = box.tag;
    let start = abschnitt[i];
    let breite = 1;
    //console.log(abschnitt);
    if (abschnitt[i + 7] && abschnitt[i + 7].tag < abschnitt[abschnitt.length - 1].tag &&
      this.klassenFahrt(abschnitt[i + 7].fahrten, klasseZahl) !== null &&
      this.klassenFahrt(abschnitt[i].fahrten, klasseZahl).titel == this.klassenFahrt(abschnitt[i + 7].fahrten, klasseZahl).titel) {
      //    console.log("Gleich");
      breite++;
      if (abschnitt[i + 14] && abschnitt[i + 14].tag < abschnitt[abschnitt.length - 1].tag && this.klassenFahrt(abschnitt[i + 14].fahrten, klasseZahl) !== null && this.klassenFahrt(abschnitt[i].fahrten, klasseZahl).titel == this.klassenFahrt(abschnitt[i + 14].fahrten, klasseZahl).titel) {
        breite++;
        if (abschnitt[i + 21] && abschnitt[i + 21].tag < abschnitt[abschnitt.length - 1].tag && this.klassenFahrt(abschnitt[i + 21].fahrten, klasseZahl) !== null && this.klassenFahrt(abschnitt[i].fahrten, klasseZahl).titel == this.klassenFahrt(abschnitt[i + 21].fahrten, klasseZahl).titel) {
          breite++;
          if (abschnitt[i + 28] && abschnitt[i + 28].tag < abschnitt[abschnitt.length - 1].tag && this.klassenFahrt(abschnitt[i + 28].fahrten, klasseZahl) !== null && this.klassenFahrt(abschnitt[i].fahrten, klasseZahl).titel == this.klassenFahrt(abschnitt[i + 28].fahrten, klasseZahl).titel) {
            breite++;
          }
        }
      }
    }
    return breite;
  }

  abschn(zahl) {
    this.absch = zahl;
  }
  abschnAdd(zahl) {
    if (zahl === 3) {
      this.absch = 0
    } else {
      this.absch = zahl + 1;
    }
  }
  abschnSub(zahl) {
    if (zahl === 0) {
      this.absch = 3
    } else {
      this.absch = zahl - 1;
    }
  }

  besondererTag(tag) {
    switch (true) {
      case tag.ferien.length != 0:
        return "ferien";
      case tag.pruefungen.length != 0:
        return "pruefung";
      default:
        return "";
    }
  }


  stringTeiler(str) {
    let neu = "";
    let arr = str.split("_");
    arr.forEach(element => {
      neu = neu + " " + element;
    });
    return neu;
  }
  klassenFahrt(arr, zahl) {
    let ele;
    arr.forEach(element => {
      if (element.klasse == zahl.toString()) {
        //console.log(element);
        ele = element;
      }
    });
    return ele ? ele : null;
  }
  wochenTag(day) {
    switch (day) {
      case 0:
        return "So";
      case 1:
        return "Mo";
      case 2:
        return "Di";
      case 3:
        return "Mi";
      case 4:
        return "Do";
      case 5:
        return "Fr";
      case 6:
        return "Sa";
    }
  }

  toggle() {
    if (this.termineEinblenden === false) {
      this.termineEinblenden = true
    } else {
      this.termineEinblenden = false
    }
  }
  terminAdd(titel, start, ende, klasse) {
    let startArray = start.split("/");
    //startArray[1]--;
    let startt = new Date('' + startArray[2] + "-" + startArray[1] + "-" + startArray[0]);
    startt.setHours(0, 0, 0, 0);
    let endArray = ende.split("/");
    // endArray[1]--;
    let endd = new Date('' + endArray[2] + "-" + endArray[1] + "-" + endArray[0]);
    endd.setHours(0, 0, 0, 0);
    this.loginServ.terminHinzufügen({
      titel: titel,
      //Date.parse("2021-09-03 19:34:57")/1000;
      start: startt,
      ende: endd,
      klasse: klasse
    });
  }

  pruefungAdd(titel, start, ende) {
    let startArray = start.split("/");
    //startArray[1]--;
    console.log(startArray);
    let startt = new Date('' + startArray[2] + "-" + startArray[1] + "-" + startArray[0]);
    startt.setHours(0, 0, 0, 0);
    let endd = undefined;
    if (ende.trim() === "") {
      endd = undefined;
    } else {
      let endArray = ende.split("/");
      // endArray[1]--;
      endd = new Date('' + endArray[2] + "-" + endArray[1] + "-" + endArray[0]);
      endd.setHours(0, 0, 0, 0);
    }

    this.loginServ.pruefungHinzufügen({
      titel: titel,
      start: startt,
      ende: endd,
    });
  }
  ferienAdd(titel, start, ende) {
    let startArray = start.split("/");
    //startArray[1]--;
    let startt = new Date('' + startArray[2] + "-" + startArray[1] + "-" + startArray[0]);
    startt.setHours(0, 0, 0, 0);
    let endd = undefined;
    if (ende.trim() !== "") {
      let endArray = ende.split("/");
      endd = new Date('' + endArray[2] + "-" + endArray[1] + "-" + endArray[0]);
      endd.setHours(0, 0, 0, 0);
      this.loginServ.ferienHinzufügen({
        titel: titel,
        start: startt,
        ende: endd,
      });
    } else {
      this.loginServ.ferienHinzufügen({
        titel: titel,
        start: startt
      });

    }

  }

  rechts() {
    if (this.gewaehlterPlan === "rhythmus") {
      this.gewaehlterPlan = "epoche"
    } else if (this.gewaehlterPlan === "epoche") {
      this.gewaehlterPlan = "schiene";
    } else if (this.gewaehlterPlan === "schiene") {
      this.gewaehlterPlan = "rhythmus";
    }
  }
  links() {
    if (this.gewaehlterPlan === "rhythmus") {
      this.gewaehlterPlan = "schiene"
    } else if (this.gewaehlterPlan === "schiene") {
      this.gewaehlterPlan = "epoche";
    } else if (this.gewaehlterPlan === "epoche") {
      this.gewaehlterPlan = "rhythmus";
    }

  }







  daysBetween(startDate, endDate) { //in weeeks geändert mit *7
    var millisecondsPerDay = 24 * 60 * 60 * 1000 * 7;
    return Math.round(((endDate) - (startDate)) / millisecondsPerDay);
  }

  wortInZahl(neun) {
    switch (neun) {
      case 'neun':
        return 9;
      case 'zehn':
        return 10;
      case 'elf':
        return 11;
      case 'zwoelf':
        return 12
    }
  }

  //doppelt



  clickN(e, klasse, datum) { //tagIndex, wochentagZahl) { //wochenTagZahl So=0, Mo=1, Di=2, Mi=3, Do=4, Fr=5, Sa=6

    let wochentagZahl = datum.getDay();
    //let tagIndex = this.ferienServ.daysBetween().findIndex(tag => tag.tag.getTime() == datum.getTime());
    let monta = datum //Montag der Woche auswhäln für Start (Akutell klickt man nur montag an)
    let freit = addDays(datum, 4); //Ende der Schulwoche/epoche
    //Gerade oder Ungerade Clickanzahl

    this.grundPlanfaecher.forEach(ele => {
      if (ele) {
        ele.lehrer.forEach((le, eh) => {
          if (e.shiftKey) {
            ele.zuweisung[this.gewaehlterPlan].forEach((startEnde, s) => {
              if (startEnde.start.getTime() == monta.getTime() && klasse == ele.klasse) {
                ele.zuweisung[this.gewaehlterPlan].splice(s, 1);
                // console.log(ele.zuweisung[this.gewaehlterPlan]);
              }
            });
            //this.klassenplanServ.grundPlanfaecher.next(ar);
          } else if (this.clickCount > 0) {
            //Ende:
            ele.zuweisung[this.gewaehlterPlan].forEach(obj => {
              if (obj.ende == null) {
                obj.ende = freit; //Freitag für das ende der epoche
              }
            });
          }
        });
      }
    });
    if (this.clickCount > 0) {
      this.klassenplanServ.grundPlanfaecher.next(this.grundPlanfaecher);
    }
    this.clickCount = 0;
  }


  toggleClick(ele, datum) {

    this.gewaehltesElement = ele;
    this.clickCount = 0;
    //markieren schon angelegte epochen:
    this.lehrerServ.lehrerSelected.next(ele.lehrer[0]); //bis hier alles, was vorher Auswahl gemacht hat
    let monta = datum;

    let ar = this.grundPlanfaecher;
    ar.forEach(ele => {
      if (ele) {
        ele.lehrer.forEach((le, eh) => {
          //
          if (ele.klasse == this.gewaehltesElement.klasse && le == this.gewaehltesElement.lehrer[eh] && ele.fach == this.gewaehltesElement.fach) {
            ele.zuweisung[this.gewaehlterPlan].push({
              start: monta,
              ende: null
            });

          }
        });
      }
    });
    this.clickCount++;
    console.log(this.clickCount);
    //console.log(this.grundPlanfaecher);
  }




  reihenAufteilung(row, cIndex) {
    var span = 1;
    var cellIndex = cIndex;

    while (row.length > cellIndex + 1) {
      if (this.equals(row[cellIndex], row[cellIndex + 1])) {
        span++;
      } else {
        break;
      }

      ++cellIndex;
    }
    // console.log(span);

    return span;

  }
  /*
      let aufteilung = new Array(row.length);
      let dupli=0;

      row.forEach((cell, c) => {
        dupli=0;

        if (aufteilung[c] === undefined) {
          aufteilung[c] = 0;
        }

        if (c === 0) {
          aufteilung[0] = 1;
        }
        if (c === 1) {
          if (this.equals(row[c - 1], cell)) {
            aufteilung[c - 1]++;
            aufteilung[c]=aufteilung[c-1];
          }
        }
        if (c === 2) {
          if (this.equals(row[c - 2], cell)) {
            aufteilung[c - 2]++;
            aufteilung[c - 1]++;
            aufteilung[c]++;
          } else if (this.equals(row[c - 1], cell)) {
            aufteilung[c - 1]++;
            aufteilung[c]++;
          }
        }

      });
      console.log(aufteilung);
      return aufteilung;
    }*/



  markedd(kuerz) {
    if (kuerz && this.selectLehrer && kuerz == this.selectLehrer.kuerzel) {
      return "blueback";
    }
  }



  getGanztagsEvent(tagg, klasse) {
    let string: string = "";
    this.epochenPlanS.esr_plan.getValue().forEach(tag => {

      if (tag.tag.getTime() === tagg.getTime() && tag.ganztaegig[this.zahlInWort(klasse)] !== null) {
        //   console.log(tag.ganztaegig[this.zahlInWort(klasse)]);
        string = tag.ganztaegig[this.zahlInWort(klasse)];
      } else {}
    });

    return string;
  }




  wahl(z) {
    this.gewaehlterPlan = z;
    this.clickCount = 0;
  }
  tabellensortierung(kl: Lehrjahr) {
    let lehrerVonKlasse: Array < Elementt > = [];
    //let newArray:Array<Elementt> =this.klassenplanServ.grundPlanfaecher.getValue();
    //this.klassen.forEach((klas, f) => {
    this.grundPlanfaecher.forEach(element => {
      if ((element != null) && (element.klasse == kl) && (element[this.gewaehlterPlan] > 0)) {
        lehrerVonKlasse.push(element);
      }
    });
    return lehrerVonKlasse;
  }



  epochenWahl(ele: Elementt) {
    this.gewaehltesElement = ele;
    this.clickCount = 0;
    //markieren schon angelegte epochen:
    this.lehrerServ.lehrerSelected.next(ele.lehrer[0]);
  }



  duplicates(lehrer, tag) {
    let duplica = 0;

    this.grundPlanfaecher.forEach(elem => {
      if (elem) {
        elem.zuweisung[this.gewaehlterPlan].forEach(startEnde => { //nur angewählter plan rhythmus o. shiene oder epoche die jeweiligen start-endes angucken je element
          if (startEnde.start != null && startEnde.ende != null) {
            if (startEnde.start.getTime() <= tag.getTime() && startEnde.ende.getTime() >= tag.getTime()) {
              elem.lehrer.forEach(lehr => {
                if (lehr.kuerzel == lehrer.kuerzel) {
                  duplica++;
                }
              });
            }
          }
        });
      }
    });
    return duplica > 1 ? "error" : "ok";
  }


  zahlInWort(zahl) {
    switch (zahl) {
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

  counter2 = 0;
  print() {
    if (this.counter2 % 2 == 0) {
      this.printAktiv = true;
    } else {
      this.printAktiv = false;
    }
    this.counter2++;

  }

  constructor(public epochenPlanS: EpochenPlaeneService,
    public ferienServ: FerientermineService, public klassenplanServ: KlassenplaeneService,
    public lehrerServ: LehrerService, public loginServ: LoginService) {
    this.epochenPlanS.esr_plan$.subscribe((data: Array < Array < TagesObjekt >> ) => {

      this.esrPlan = data;
      // console.log(data);

    });
    this.klassenplanServ.grundPlanfaecher$.subscribe((data) => this.grundPlanfaecher = data);

    lehrerServ.lehrerSelected$.subscribe(data => {
      this.selectLehrer = data;
    });


  }

  ngOnInit(): void {}

}
