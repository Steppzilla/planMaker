import {
  Injectable
} from '@angular/core';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  eachDayOfInterval,addDays,subDays
} from 'date-fns';

import {
  Elementt
} from '../interfaces/elementt';
import {
  Ferientermin
} from '../interfaces/ferientermin';
import {
  Lehrer
} from '../interfaces/lehrer';
import {
  Pruefungstermin
} from '../interfaces/pruefungstermin';
import {
  TagesObjekt
} from '../interfaces/tages-objekt';
import {
  Termin
} from '../interfaces/termin';
import {
  EpochenPlaeneService
} from './epochen-plaene.service';
import {
  FerientermineService
} from './ferientermine.service';
import {
  KlassenplaeneService
} from './klassenplaene.service';
import {
  LehrerService
} from './lehrer.service';
import {
  VertretungServService
} from './vertretung-serv.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  store: AngularFirestore; //db

  saveAll(version) {
    // debugger;
    let y = btoa(JSON.stringify(this.klassenPlanServ.grundPlanfaecher.getValue()));
    //Schiene, Epoche, Rhythmus in einer datei:
    // let z = btoa(JSON.stringify(this.epochenPlanServ.esr_plan.getValue()));

    let plan = this.store.collection('plaene').doc("gesamtplaene" + version);
    plan.set({ //Gesamtaufteilung Array<Elementt>
      stundenElemente: y,
      //  esrPlan: z,
    }).then(() => {
      console.log('saved' + version);
    }).catch(function (error) {
      console.log("1 nicht gespeichert");
      console.error(error);
    });
  }

  //Stundenraster montag dienstag etc aus planmaker wird gesetzt: //und im Lehrerservice aktuelles Raster/behavioural
  gesamtPlanLaden(zahl) {
    this.vertretungS.aktuelleESRElemente = [];
    let stundenAufteilungJSO: Array < Elementt > ;
    //Epochenpläne + Schiene
    this.store.collection('plaene').doc("gesamtplaene" + zahl).valueChanges().subscribe((plaene) => { //in Firebase heißt der Ordner plaene. das erste Element [0] ist "gesamtplaene", darin sind die pläne:   
      stundenAufteilungJSO = JSON.parse(atob(plaene["stundenElemente"]));
      //   console.log(stundenAufteilungJSO);
    //  let esrJSO = JSON.parse(atob(plaene["esrPlan"])); //Datum teile sind alle Strings..
     // esrJSO.forEach(element => {
      //  let date = new Date(element.tag);
      //  element.tag = date;
      //});
      //  this.epochenPlanServ.esr_plan.next(esrJSO);
      //in Elementt auch datum strings wieder in datum umwandeln:

      stundenAufteilungJSO.forEach((el, ei) => {
        let aktuell: [Elementt, number, string];
        if (el == null) {
          stundenAufteilungJSO.splice(ei, 1);
        } else {
          ["epoche", "schiene", "rhythmus"].forEach(plan => {

            el.zuweisung[plan].forEach((startEnde, z) => {
              let datum = new Date(startEnde.start);
              startEnde.start = datum;
              datum = new Date(startEnde.ende);
              startEnde.ende = datum;
              //Aktuelle epoche, schiene, rhythmus speichern in Vertretung:
              

            });
          });

        }
      });

      this.klassenPlanServ.grundPlanfaecher.next(stundenAufteilungJSO); //opt: .concat(ele) um Element hinzuzufügen beim Load der Daten
      //  this.klassenPlanServ.elementHinzufuegen(Fach.kunstgeschichte,Lehrjahr.neun);

    });
  }


  lehrerladen() {
    this.store.collection('lehrer').valueChanges().subscribe((lehrer: Array < Lehrer > ) => {
      // console.log(lehrer);
      let lehrerListe = [];
      lehrer.forEach(le => {
        let obj = {
          name: le.name,
          kuerzel: le.kuerzel,
          anrede: le.anrede,
          faecher: le.faecher,
          aufgaben: le.aufgaben
        };
        lehrerListe.push(obj);
      });
      this.klassenPlanServ.lehrerListe.next(lehrerListe);
    });
  }

  lehrerHinzufuegen(le: Lehrer) {
    let lehrer = this.store.collection('lehrer').doc(le.kuerzel);

    lehrer.set({ //Gesamtaufteilung Array<Elementt>
      anrede: le.anrede,
      aufgaben: le.aufgaben,
      faecher: le.faecher,
      kuerzel: le.kuerzel,
      name: le.name
    }).then(() => {
      console.log('saved' + le.kuerzel);
    }).catch(function (error) {
      console.log("1 nicht gespeichert");
      console.error(error);
    });

  }


  lehrerLoeschen(kuerz: string) { //String ist Kuerzel, also speicherort als Dokumentname
    let lehrer = this.store.collection('lehrer').doc(kuerz);
  }

  termineladen() { //auch prüfungen und ferientermine //ESR plan-aufbauen anhandtermine
    let terminListe: Array < Termin >= [];
    this.store.collection('Termine').valueChanges().subscribe((termine: Array < Termin > ) => {
      // console.log(termine);
      terminListe = [];
      termine.forEach(te => {
        let obj = {
          titel: te.titel,
          start: te.start,
          ende: te.ende,
          klasse: te.klasse
        };
        terminListe.push(obj);
      });

      terminListe.sort(function(a, b) {
       let c=a.start;
       let d=b.start;
        return  c<=d ? -1 : c>d ? 1 : 0;
    });

      this.klassenPlanServ.terminListe.next(terminListe);

    });
    let pruefungsListe: Array < Pruefungstermin > = [];
    //prüfungen:
    this.store.collection("Pruefungen").valueChanges().subscribe((pruefungen: Array < Pruefungstermin > ) => {
      pruefungsListe = [];
      pruefungen.forEach(prue => {
        let obj;
        if (prue.ende !== undefined) {
          obj = {
            titel: prue.titel,
            start: prue.start,
            ende: prue.ende
          }
        } else {
          obj = {
            titel: prue.titel,
            start: prue.start
          }
        }
        pruefungsListe.push(obj);
        //  console.log(pruefungsListe);
      });
      pruefungsListe.sort(function(a, b) {
        let c=a.start;
        let d=b.start;
         return  c<=d ? -1 : c>d ? 1 : 0;
     });
      this.klassenPlanServ.pruefungsListe.next(pruefungsListe);
    });

    let ferienListe: Array < Ferientermin > = [];
    //Ferien:
    this.store.collection("Ferien").valueChanges().subscribe((ferien: Array < Ferientermin > ) => {
      ferienListe = [];
      // console.log(ferien[0].start.toDate());
      ferien.forEach(fer => {
        let obj;
        if (fer.ende !== undefined) {
          obj = {
            titel: fer.titel,
            start: fer.start,
            ende: fer.ende
          }
        } else {
          obj = {
            titel: fer.titel,
            start: fer.start,
          }
        }
        ferienListe.push(obj);
      });
      ferienListe.sort(function(a, b) {
        let c=a.start;
        let d=b.start;
         return  c<=d ? -1 : c>d ? 1 : 0;
     });
      this.klassenPlanServ.ferienListe.next(ferienListe);
      //termin in ESRPlan:

      let abschnitt1: Array < TagesObjekt > = eachDayOfInterval({ // @ts-ignore
        start: addDays(ferienListe.find(element => element.titel === "Sommerferien").ende.toDate(),1), // @ts-ignore
        end: subDays(ferienListe.find(element => element.titel == "Herbstferien").start.toDate(),1)
      }).map(z => {
        return fahrteinfuegen(z);
      });

      let abschnitt2: Array < TagesObjekt > = eachDayOfInterval({ // @ts-ignore
          start: addDays(ferienListe.find(element => element.titel == "Herbstferien").ende.toDate(),1), // @ts-ignore
          end: subDays(ferienListe.find(element => element.titel == "Weihnachtsferien").start.toDate(),1)
        })
        .map(z => {
          return fahrteinfuegen(z);
        });

      let abschnitt3: Array < TagesObjekt > = eachDayOfInterval({ // @ts-ignore
        start:addDays(ferienListe.find(element => element.titel == "Weihnachtsferien").ende.toDate(),1), // @ts-ignore
        end: subDays(ferienListe.find(element => element.titel == "Osterferien").start.toDate(),1)
      }).map(z => {
        return fahrteinfuegen(z);
      });

      let abschnitt4: Array < TagesObjekt > = eachDayOfInterval({ // @ts-ignore
          start: addDays(ferienListe.find(element => element.titel == "Osterferien").ende.toDate(),1), // @ts-ignore
          end: subDays(ferienListe.find(element => element.titel == "Sommerferien").start.toDate(),1)
        })
        .map(z => {
          return fahrteinfuegen(z);
        });


      function fahrteinfuegen(dat: Date) {
        let obj: TagesObjekt;
        obj = {
          tag: dat,
          notiz: "",
          unterricht: [],
          fahrten: [],
          pruefungen: [],
          ferien: [] //pruefungen, ferien
        };
        terminListe.forEach((fahrt: Termin) => { //Nicht alle Ferien haben ein eEnde
          if (fahrt.ende) {
                      // @ts-ignore
            if (dat >= fahrt.start.toDate() && dat <= fahrt.ende.toDate()) {
            //  console.log("fahrt");
              obj.fahrten.push(fahrt);
            } else {}
          } else { // @ts-ignore
            if (dat == fahrt.start.toDate()) {
              obj.fahrten.push(fahrt);
            } else {}
          }
        });
        ferien.forEach((fer: Ferientermin) => {
          if (fer.ende) { //@ts-ignore
            if (dat >= fer.start.toDate() && dat <= fer.ende.toDate()) {
              obj.ferien.push(fer);
            }else{//sommerferien extra, weil startdatum das Ende des SJ ist, und Ende, Anfang.
              //@ts-ignore
              if(ferien.titel==="Sommerferien"&&(dat>=ferien.start.toDate()||dat<=ferien.ende.toDate())){
                obj.ferien.push(fer);
              }else{}

            }
          } else {//wenn ende nicht definiert ist, datum aber identisch is
            // @ts-ignore
            if (dat.getTime() == fer.start.toDate().getTime()) {
            //  console.log(fer.titel);
              obj.ferien.push(fer);
            }
          }
        });
        pruefungsListe.forEach((pruefung: Pruefungstermin) => {
          if (pruefung.ende) { // @ts-ignore
            if (dat.getTime() >= pruefung.start.toDate().getTime() && dat.getTime() <= pruefung.ende.toDate().getTime()) {
              obj.pruefungen.push(pruefung);
            } else {}
          } else {
            // @ts-ignore
            if (dat.getTime() === pruefung.start.toDate().getTime()) {
              obj.pruefungen.push(pruefung);
            } else {}
          }
        });
        return obj;
      }
      let esrPlan: Array < Array < TagesObjekt >>= [abschnitt1, abschnitt2, abschnitt3, abschnitt4];
     console.log(esrPlan);
      this.epochenPlanServ.esr_plan.next(esrPlan);
      //  
    });
  }

 

  terminHinzufügen(te: Termin) {
    let termin = this.store.collection('Termine').doc(te.titel + te.klasse);
    console.log(te);
    termin.set({ //Gesamtaufteilung Array<Elementt>
      start: te.start,
      ende: te.ende,
      titel: te.titel,
      klasse: te.klasse
    }).then(() => {
      console.log('saved' + te.titel);
    }).catch(function (error) {
      console.log("1 nicht gespeichert");
      console.error(error);
    });
  }

  pruefungHinzufügen(te: Pruefungstermin) {
    let termin = this.store.collection('Pruefungen').doc(te.titel);
    //console.log(te);
    if (te.ende === undefined) {
      termin.set({ //Gesamtaufteilung Array<Elementt>
        start: te.start,
        titel: te.titel,
      }).then(() => {
        console.log('saved' + te.titel);
      }).catch(function (error) {
        console.log("1 nicht gespeichert");
        console.error(error);
      });
    } else {
      termin.set({ //Gesamtaufteilung Array<Elementt>
        start: te.start,
        ende: te.ende,
        titel: te.titel,
      }).then(() => {
        console.log('saved' + te.titel);
      }).catch(function (error) {
        console.log("1 nicht gespeichert");
        console.error(error);
      });
    }
  }

  ferienHinzufügen(te: Ferientermin) {
    console.log(te);
    let termin = this.store.collection('Ferien').doc(te.titel);
    if (te.ende === undefined) {
      let term:Ferientermin={start: te.start, titel: te.titel}
      termin.set(Object.assign({}, term)).then(() => {
        console.log('saved' + te.titel);
      }).catch(function (error) {
        console.log("1 nicht gespeichert");
        console.error(error);
      });
    } else {
      let obj:Ferientermin={ //Gesamtaufteilung Array<Elementt>
        start:  te.start,
        ende: te.ende,
        titel: te.titel,
      }
      termin.set(Object.assign({},obj)).then(() => {
        console.log('saved' + te.titel);
      }).catch(function (error) {
        console.log("1 nicht gespeichert");
        console.error(error);
      });
    }
  }


nextMonday(datum:Date){
  let newDate=datum;
  while(newDate.getDay()!==1){
    newDate=addDays(newDate,1);
  }
  console.log(datum);
  return newDate;
};


  login() {
    let email = "thunfischfreierdelfin@gmx.de";
    let passwort = "BOIZ2020";
    this.auth.signInWithEmailAndPassword(email, passwort).catch(function (e) {
      console.log(e.message + "Code: " + e.code);
    }); //original: Anonymously
  }

  logout() {
    this.auth.signOut().then(function () { // Sign-out successful.
    }).catch(function (error) { // An error happened.
    });
  }


  leerestagesRaster() {
    let arrayC = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    // let stA = arrayC.map(element => new Array());
    let tagesRaster = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    ];
    return tagesRaster;

    // new Array(this.stundenanzahl).fill(null).map(
    //  (r) => r = new Array(this.klassen.length).fill(null).map(
    //    (s) => s = []));
  }

  constructor(public vertretungS: VertretungServService,
    db: AngularFirestore,
    public auth: AngularFireAuth,
    public epochenPlanServ: EpochenPlaeneService,
    public lehrerService: LehrerService,
    public klassenPlanServ: KlassenplaeneService,
    public ferienTermServ: FerientermineService) {
    this.store = db; //hier speichere ich die ganze angularfirestore dings 

  }
}
