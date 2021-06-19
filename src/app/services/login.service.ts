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
  Elementt
} from '../interfaces/elementt';

import {
  EpochenPlaeneService
} from './epochen-plaene.service';
import {
  KlassenplaeneService
} from './klassenplaene.service';
import {
  LehrerService
} from './lehrer.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  store: AngularFirestore; //db

  saveAll(version) {
    // debugger;
    let y = btoa(JSON.stringify(this.klassenPlanServ.grundPlanfaecher.getValue()));
    //Schiene, Epoche, Rhythmus in einer datei:
    let z = btoa(JSON.stringify(this.epochenPlanServ.esr_plan.getValue()));

    let plan = this.store.collection('plaene').doc("gesamtplaene" + version);
    plan.set({ //Gesamtaufteilung Array<Elementt>
      stundenElemente: y,
      esrPlan: z,
    }).then(() => {
      console.log('saved'+version);
    }).catch(function (error) {
      console.log("1 nicht gespeichert");
      console.error(error);
    });
  }

  //Stundenraster montag dienstag etc aus planmaker wird gesetzt: //und im Lehrerservice aktuelles Raster/behavioural
  gesamtPlanLaden(zahl) {
    let stundenAufteilungJSO: Array < Elementt > ;
    //Epochenpläne + Schiene
    this.store.collection('plaene').doc("gesamtplaene" + zahl).valueChanges().subscribe((plaene) => { //in Firebase heißt der Ordner plaene. das erste Element [0] ist "gesamtplaene", darin sind die pläne:   
      stundenAufteilungJSO = JSON.parse(atob(plaene["stundenElemente"]));
      //   console.log(stundenAufteilungJSO);
      let esrJSO = JSON.parse(atob(plaene["esrPlan"])); //Datum teile sind alle Strings..
      esrJSO.forEach(element => {
        let date = new Date(element.tag);
        element.tag = date;

      });
      this.epochenPlanServ.esr_plan.next(esrJSO);
      //in Elementt auch datum strings wieder in datum umwandeln:
      stundenAufteilungJSO.forEach((el, ei) => {
        if (el == null) {
          stundenAufteilungJSO.splice(ei, 1);
        } else {
          ["epoche", "schiene", "rhythmus"].forEach(plan => {

            el.zuweisung[plan].forEach(startEnde => {
              let datum = new Date(startEnde.start);
              startEnde.start = datum;
              datum = new Date(startEnde.ende);
              startEnde.ende = datum;
            });
          });
        }
      });

      this.klassenPlanServ.grundPlanfaecher.next(stundenAufteilungJSO); //opt: .concat(ele) um Element hinzuzufügen beim Load der Daten
      //  this.klassenPlanServ.elementHinzufuegen(Fach.kunstgeschichte,Lehrjahr.neun);

    });
  }

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
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    ];
    return tagesRaster;

    // new Array(this.stundenanzahl).fill(null).map(
    //  (r) => r = new Array(this.klassen.length).fill(null).map(
    //    (s) => s = []));
  }

  constructor(db: AngularFirestore, public auth: AngularFireAuth, public epochenPlanServ: EpochenPlaeneService, public lehrerService: LehrerService, public klassenPlanServ: KlassenplaeneService) {
    this.store = db; //hier speichere ich die ganze angularfirestore dings 
  }
}
