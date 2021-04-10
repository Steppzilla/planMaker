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

  saveAll(stundenPlan: Gesamtstundenraster) {
    let x = btoa(JSON.stringify(stundenPlan)); //der plan kann aktuell nur stundenplan
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

    //Schiene, Epoche, Rhythmus :
    x=btoa(JSON.stringify(this.epochenPlanServ.epoche8.getValue()));
    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      epoche8: x    }).then(() => {      console.log('saved');
    }).catch(function (error) {      console.log("Epoche8 wurde nicht gespeichert");      console.error(error);    });

    x=btoa(JSON.stringify(this.epochenPlanServ.epoche9.getValue()));
    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      epoche9: x    }).then(() => {      console.log('saved');   
     }).catch(function (error) {      console.log("Epoche9 wurde nicht gespeichert");      console.error(error);    });

    x=btoa(JSON.stringify(this.epochenPlanServ.epoche10.getValue()));
    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      epoche10: x    }).then(() => {      console.log('saved');
    }).catch(function (error) {      console.log("Epoche10 wurde nicht gespeichert");      console.error(error);    });

    x=btoa(JSON.stringify(this.epochenPlanServ.epoche11.getValue()));
    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      epoche11: x    }).then(() => {      console.log('saved');
    }).catch(function (error) {      console.log("Epoche11 wurde nicht gespeichert");      console.error(error);    });

    x=btoa(JSON.stringify(this.epochenPlanServ.epoche12.getValue()));
    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      epoche12: x    }).then(() => {      console.log('saved');
    }).catch(function (error) {      console.log("Epoche12 wurde nicht gespeichert");      console.error(error);    });

    //Schiene:
    x=btoa(JSON.stringify(this.epochenPlanServ.schiene9.getValue()));
    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      schiene9: x    }).then(() => {      console.log('saved');    
    }).catch(function (error) {      console.log("Schiene9 wurde nicht gespeichert");      console.error(error);    });

    x=btoa(JSON.stringify(this.epochenPlanServ.schiene10.getValue()));
    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      schiene10: x    }).then(() => {      console.log('saved');   
     }).catch(function (error) {      console.log("Schiene10 wurde nicht gespeichert");      console.error(error);    });

    x=btoa(JSON.stringify(this.epochenPlanServ.schiene11.getValue()));
    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      schiene11: x    }).then(() => {      console.log('saved');    
    }).catch(function (error) {      console.log("Schiene11 wurde nicht gespeichert");      console.error(error);    });

    x=btoa(JSON.stringify(this.epochenPlanServ.schiene12.getValue()));
    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      schiene12: x    }).then(() => {      console.log('saved');   
     }).catch(function (error) {      console.log("Schiene12 wurde nicht gespeichert");      console.error(error);    });
    
    //Rhythmus:
    x=btoa(JSON.stringify(this.epochenPlanServ.rhythmus9.getValue()));
    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      rhythmus9: x    }).then(() => {      console.log('saved');    
    }).catch(function (error) {      console.log("Rhythmus9 wurde nicht gespeichert");      console.error(error);    });

    x=btoa(JSON.stringify(this.epochenPlanServ.rhythmus10.getValue()));
    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      rhythmus10: x    }).then(() => {      console.log('saved');    
    }).catch(function (error) {      console.log("Rhythmus10 wurde nicht gespeichert");      console.error(error);    });

    x=btoa(JSON.stringify(this.epochenPlanServ.rhythmus11.getValue()));
    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      rhythmus11: x    }).then(() => {      console.log('saved');    
    }).catch(function (error) {      console.log("Rhythmus11 wurde nicht gespeichert");      console.error(error);    });

    x=btoa(JSON.stringify(this.epochenPlanServ.rhythmus12.getValue()));
    this.store.collection('plaene').doc('/' + 'gesamtplaene').update({ //Gesamtaufteilung Array<Elementt>
      rhythmus12: x    }).then(() => {      console.log('saved');    
    }).catch(function (error) {      console.log("Rhythmus12 wurde nicht gespeichert");      console.error(error);    });

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
 
     
      this.epochenPlanServ.epoche8.next(JSON.parse(atob(plaene[0].epoche8)));
      this.epochenPlanServ.epoche9.next(JSON.parse(atob(plaene[0].epoche9)));
      this.epochenPlanServ.epoche10.next(JSON.parse(atob(plaene[0].epoche10)));
      this.epochenPlanServ.epoche11.next(JSON.parse(atob(plaene[0].epoche11)));
      this.epochenPlanServ.epoche12.next(JSON.parse(atob(plaene[0].epoche12)));

      this.epochenPlanServ.schiene9.next(JSON.parse(atob(plaene[0].schiene9)));
      this.epochenPlanServ.schiene10.next(JSON.parse(atob(plaene[0].schiene10)));
      this.epochenPlanServ.schiene11.next(JSON.parse(atob(plaene[0].schiene11)));
      this.epochenPlanServ.schiene12.next(JSON.parse(atob(plaene[0].schiene12)));

      this.epochenPlanServ.rhythmus9.next(JSON.parse(atob(plaene[0].rhythmus9)));
      this.epochenPlanServ.rhythmus10.next(JSON.parse(atob(plaene[0].rhythmus10)));
      this.epochenPlanServ.rhythmus11.next(JSON.parse(atob(plaene[0].rhythmus11)));
      this.epochenPlanServ.rhythmus12.next(JSON.parse(atob(plaene[0].rhythmus12)));
      //   var schieneJSO = JSON.parse(atob(planItem.schiene));
      //  var rhythmusJSO = JSON.parse(atob(planItem.rhythmus));
      this.stundenPlanDaten.next(stundenPlanJSO);
      this.klassenPlanServ.grundPlanfaecher.next(stundenAufteilungJSO); //opt: .concat(ele) um Element hinzuzufügen beim Load der Daten
      //  this.klassenPlanServ.elementHinzufuegen(Fach.kunstgeschichte,Lehrjahr.neun);

    });
    console.log(this.klassenPlanServ.grundPlanfaecher);
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
