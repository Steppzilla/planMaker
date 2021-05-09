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
  BehaviorSubject,
  Observable
} from 'rxjs';
import {
  Elementt
} from '../interfaces/elementt';
import {
  Gesamtstundenraster
} from '../interfaces/gesamtstundenraster';
import { EpochenPlaeneService } from './epochen-plaene.service';
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
  plaene; //firebase-plan?
  stundenPlanDaten = new BehaviorSubject < Gesamtstundenraster > (null);
  stundenPlanDaten$ = this.stundenPlanDaten.asObservable();

  stundenLehrerArray = new BehaviorSubject(null);
  stundenLehrerArray$ = this.stundenLehrerArray.asObservable();
  grundPlanfaecher: Array < Elementt > ;

  saveAll() {
    let x = btoa(JSON.stringify(this.stundenPlanDaten.getValue())); //der plan kann aktuell nur stundenplan
    let y = btoa(JSON.stringify(this.grundPlanfaecher));

    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({
      stundenPlan: x
    }).then(() => {
      console.log('saved');
    }).catch(function (error) {
      console.log("stundenPlan wurde nicht gespeichert");
      console.error(error);
    });

    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      stundenAufteilung: y
    }).then(() => {
      console.log('saved');
    }).catch(function (error) {
      console.log("Aufteilung/Grundplan wurde nicht gespeichert");
      console.error(error);
    });

    //Schiene, Epoche, Rhythmus in einer datei:
    let z=btoa(JSON.stringify(this.epochenPlanServ.esr_plan.getValue()));
    //console.log(JSON.parse(atob(z))); //DDATUM wird zu Strings
    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      esr_plan: z    }).then(() => {      console.log('saved esr');
    }).catch(function (error) {      console.log("esr wurde nicht gespeichert");      console.error(error);    });
//Schiene, Epoche, Rhythmus :

   
    //Logout?
  }

  //Stundenraster montag dienstag etc aus planmaker wird gesetzt: //und im Lehrerservice aktuelles Raster/behavioural
  gesamtPlanLaden() {
    let stundenPlanJSO: Gesamtstundenraster;
    let stundenAufteilungJSO: Array < Elementt > ;
    //Epochenpläne + Schiene
    this.plaene.subscribe((plaene) => { //in Firebase heißt der Ordner plaene. das erste Element [0] ist "gesamtplaene", darin sind die pläne:
      stundenPlanJSO = JSON.parse(atob(plaene[0].stundenPlan));
      stundenAufteilungJSO = JSON.parse(atob(plaene[0].stundenAufteilung));
      //   var epochenJSO = JSON.parse(atob(planItem.epochen));
 
     
     let esrJSO=JSON.parse(atob(plaene[0].esr_plan)); //Datum teile sind alle Strings..
     esrJSO.forEach(element => {
       let date=new Date(element.tag);
       element.tag=date;
       
     });
     this.epochenPlanServ.esr_plan.next(esrJSO);
      
      this.stundenPlanDaten.next(stundenPlanJSO);
      this.klassenPlanServ.grundPlanfaecher.next(stundenAufteilungJSO); //opt: .concat(ele) um Element hinzuzufügen beim Load der Daten
      //  this.klassenPlanServ.elementHinzufuegen(Fach.kunstgeschichte,Lehrjahr.neun);

    });
   // console.log(this.klassenPlanServ.grundPlanfaecher);
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

  neu() {
    let neuesRaster = this.leeresRaster();
    //HU reinschreiben und zähler aus lehrerarray herunterzählen?
    this.stundenPlanDaten.next(neuesRaster);
  }


  leeresRaster(): Gesamtstundenraster {
    let arrayC = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    // let stA = arrayC.map(element => new Array());
    let stundenRaster = {
      montag: {
        klasse1: arrayC.map(element => new Array()),
        klasse2: arrayC.map(element => new Array()),
        klasse3: arrayC.map(element => new Array()),
        klasse4: arrayC.map(element => new Array()),
        klasse5: arrayC.map(element => new Array()),
        klasse6: arrayC.map(element => new Array()),
        klasse7: arrayC.map(element => new Array()),
        klasse8: arrayC.map(element => new Array()),
        klasse9: arrayC.map(element => new Array()),
        klasse10: arrayC.map(element => new Array()),
        klasse11: arrayC.map(element => new Array()),
        klasse12: arrayC.map(element => new Array()),
        klasse13: arrayC.map(element => new Array()),
      },
      dienstag: {
        klasse1: arrayC.map(element => new Array()),
        klasse2: arrayC.map(element => new Array()),
        klasse3: arrayC.map(element => new Array()),
        klasse4: arrayC.map(element => new Array()),
        klasse5: arrayC.map(element => new Array()),
        klasse6: arrayC.map(element => new Array()),
        klasse7: arrayC.map(element => new Array()),
        klasse8: arrayC.map(element => new Array()),
        klasse9: arrayC.map(element => new Array()),
        klasse10: arrayC.map(element => new Array()),
        klasse11: arrayC.map(element => new Array()),
        klasse12: arrayC.map(element => new Array()),
        klasse13: arrayC.map(element => new Array()),
      },
      mittwoch: {
        klasse1: arrayC.map(element => new Array()),
        klasse2: arrayC.map(element => new Array()),
        klasse3: arrayC.map(element => new Array()),
        klasse4: arrayC.map(element => new Array()),
        klasse5: arrayC.map(element => new Array()),
        klasse6: arrayC.map(element => new Array()),
        klasse7: arrayC.map(element => new Array()),
        klasse8: arrayC.map(element => new Array()),
        klasse9: arrayC.map(element => new Array()),
        klasse10: arrayC.map(element => new Array()),
        klasse11: arrayC.map(element => new Array()),
        klasse12: arrayC.map(element => new Array()),
        klasse13: arrayC.map(element => new Array()),
      },
      donnerstag: {
        klasse1: arrayC.map(element => new Array()),
        klasse2: arrayC.map(element => new Array()),
        klasse3: arrayC.map(element => new Array()),
        klasse4: arrayC.map(element => new Array()),
        klasse5: arrayC.map(element => new Array()),
        klasse6: arrayC.map(element => new Array()),
        klasse7: arrayC.map(element => new Array()),
        klasse8: arrayC.map(element => new Array()),
        klasse9: arrayC.map(element => new Array()),
        klasse10: arrayC.map(element => new Array()),
        klasse11: arrayC.map(element => new Array()),
        klasse12: arrayC.map(element => new Array()),
        klasse13: arrayC.map(element => new Array()),
      },
      freitag: {
        klasse1: arrayC.map(element => new Array()),
        klasse2: arrayC.map(element => new Array()),
        klasse3: arrayC.map(element => new Array()),
        klasse4: arrayC.map(element => new Array()),
        klasse5: arrayC.map(element => new Array()),
        klasse6: arrayC.map(element => new Array()),
        klasse7: arrayC.map(element => new Array()),
        klasse8: arrayC.map(element => new Array()),
        klasse9: arrayC.map(element => new Array()),
        klasse10: arrayC.map(element => new Array()),
        klasse11: arrayC.map(element => new Array()),
        klasse12: arrayC.map(element => new Array()),
        klasse13: arrayC.map(element => new Array()),
      },
    };
    return stundenRaster;

    // new Array(this.stundenanzahl).fill(null).map(
    //  (r) => r = new Array(this.klassen.length).fill(null).map(
    //    (s) => s = []));
  }

  constructor(db: AngularFirestore, public auth: AngularFireAuth, public epochenPlanServ:EpochenPlaeneService, public lehrerService: LehrerService, public klassenPlanServ: KlassenplaeneService) {
    this.store = db; //hier speichere ich die ganze angularfirestore dings
    this.plaene = db.collection('plaene').valueChanges(); //items ist firestore-collection name
    this.stundenPlanDaten.next(this.leeresRaster());

    // this.stundenLehrerArray.next(lehrerService.stundenLehrerDerKlassen());

    this.klassenPlanServ.grundPlanfaecher$.subscribe((data) => this.grundPlanfaecher = data);

  }
}
