import {
  Injectable
} from '@angular/core';
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
import { Lehrer } from '../interfaces/lehrer';
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


  grundPlanerstellen() {
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
          epoche: 0
        };
        gesamtArrayF.push(ele);
      });
    });
    this.grundPlanfaecher.next(gesamtArrayF);
    
  }

  elementHinzufuegen(fach:Fach,klasse:Lehrjahr){
    let ele: Elementt = this.neuesElement(fach,klasse);
    console.log(    this.grundPlanfaecher.value);
    this.grundPlanfaecher.next(this.grundPlanfaecher.getValue().concat(ele)); //concat ist zum hinzufügen
  }
  elementHinzufuegenmitLehrer(fach:Fach,klasse:Lehrjahr,lehrer:Lehrer){
    let ele: Elementt = this.neuesElementmitLehrer(fach,klasse,lehrer);
    console.log(    this.grundPlanfaecher.value);
    this.grundPlanfaecher.next(this.grundPlanfaecher.getValue().concat(ele));
  }

  elementeZuruecksetzen(fach:Fach, klas:Lehrjahr){
    let neuesARray=  this.grundPlanfaecher.getValue();
  
    neuesARray=neuesARray.filter(function (el) {
      return el != null;
    });
    let counter=0;
    neuesARray.forEach((elem,e)=>{
      if(elem.fach==fach&&elem.klasse==klas){
        elem.lehrer=[];
        counter++;
      }
      if((counter>1)&&(elem.fach==fach)&&(elem.klasse==klas)){
     //  this.elementZurücksetzen(elem);
        delete neuesARray[e];
       console.log("zurückgesetzt?");
      }
    });
    
     this.grundPlanfaecher.next(neuesARray);
  }

  

  elementLoeschen(fach:Fach, klasse:Lehrjahr){
    let neuesArray=this.grundPlanfaecher.getValue();
    neuesArray.forEach((el,index) => {
      if(  el.fach==fach&&el.klasse==klasse){
        delete neuesArray[index];
      }
    });

    this.grundPlanfaecher.next(neuesArray);

  }

  neuesElement(fach:Fach,klasse:Lehrjahr){
    let ele: Elementt = {
      fach: fach,
      klasse: klasse,
      wochenstunden: 0,
      raum: Raum.null,
      lehrer: [],
      uebstunde: 0,
      rhythmus: 0,
      schiene: 0,
      epoche: 0
    };
    return ele;
  }

  
  neuesElementmitLehrer(fach:Fach,klasse:Lehrjahr,lehrer:Lehrer){
    let ele: Elementt = {
      fach: fach,
      klasse: klasse,
      wochenstunden: 0,
      raum: Raum.null,
      lehrer: [lehrer],
      uebstunde: 0,
      rhythmus: 0,
      schiene: 0,
      epoche: 0
    };
    return ele;
  }
  
zahlinWorte(num:number){
  switch (num){
    case 0: return "null";
    case 1: return "eins";
    case 2: return "zwei";
    case 3: return "drei";
    case 4: return "vier";
    case 5: return "fuenf";
    case 6: return "sechs";
    case 7: return "sieben";
    case 8: return "acht";
    case 9: return "neun";
    case 10: return "zehn";
    case 11: return "elf";
    case 12: return "zwoelf";
    case 13: return "dreizehn";
  }
}





  constructor(public klassenFaecher: KlassenFaecherService, public lehrerServ: LehrerService) {

  }
}
