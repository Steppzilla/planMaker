import {
  Component,
  OnInit
} from '@angular/core';
import {
  LehrerService
} from 'src/app/services/lehrer.service';
import {
  Fach
} from 'src/app/enums/fach.enum';
import {
  Lehrjahr
} from 'src/app/enums/lehrjahr.enum';
import {
  KlassenFaecherService
} from 'src/app/services/klassen-faecher.service';
import {
  KlassenplaeneService
} from 'src/app/services/klassenplaene.service';
import {
  Lehrer
} from 'src/app/interfaces/lehrer';
import { Elementt } from 'src/app/interfaces/elementt';


@Component({
  selector: 'app-klassen-zuweisung',
  templateUrl: './klassen-zuweisung.component.html',
  styleUrls: ['./klassen-zuweisung.component.scss']
})
export class KlassenZuweisungComponent implements OnInit {
  //keys=Object.keys;
  faecher = Object.values(Fach);
  lehrerauswahl;
  klassen = Object.values(Lehrjahr);
  grundPlanfaecher;

  mainButtonClick(e,ele){
     if(e.shiftKey){
       this.klassenplanServ.elementeZuruecksetzen(ele.fach, ele.klasse);
    }
 
  }
  wochenstundenVerteilen(e, art, elementDerZeile, kIndex) {
  //  console.log(elementDerZeile);
    if (elementDerZeile.klasse == kIndex) {
      switch (art) {
        case "woche":
          if ((e.shiftKey) && (elementDerZeile.wochenstunden > 0)) {
            elementDerZeile.wochenstunden--;
          } else {
            elementDerZeile.wochenstunden++;
          }
          break;
        case "ueb":
          if ((e.shiftKey) && (elementDerZeile.uebstunde > 0)) {
            elementDerZeile.uebstunde--;
          } else {
            elementDerZeile.uebstunde++;
          }
          break;
        case "rhythmus":
          if ((e.shiftKey) && (elementDerZeile.rhythmus > 0)) {
            elementDerZeile.rhythmus--;
          } else {
            elementDerZeile.rhythmus++;
          }
          break;
        case "epoche":
          if ((e.shiftKey) && (elementDerZeile.epoche > 0)) {
            elementDerZeile.epoche--;
          } else {
            elementDerZeile.epoche++;
          }
          break;
        case "schiene":
          if ((e.shiftKey) && (elementDerZeile.schiene > 0)) {
            elementDerZeile.schiene--;
          } else {
            elementDerZeile.schiene++;
          }
          break;
      }
    }
  }

  fachElemente(rowI:number,klasse:number) { //i ist die reihe (des fachs, alle lehrer mit dem fach werden in allen klassen angezeigt)
    let alleFilter:Array<Elementt> = [];
    this.grundPlanfaecher.forEach(element => {
           if((element)&&(klasse==element.klasse)&&(this.faecher[rowI]==element.fach)){
        alleFilter.push(element);
      }
    });
    return alleFilter; //zb alle Elemente für französisch
  }

  lehrerHinzufuegen(lehrerI: Lehrer, klasseI: Lehrjahr, fachI: Fach) {
    let neuesEle:boolean;
    let neuArray:Array<Elementt>=this.klassenplanServ.grundPlanfaecher.getValue();
 
    neuArray.forEach(obj=>{
      if(obj!=null){
    //  console.log(obj.fach + " / " + obj.klasse);
      if ((obj.fach==fachI)&&(obj.klasse==klasseI)&&(obj.lehrer[0]==undefined)) {
        console.log("L. hinzugefügt, kein neues Element");
        obj.lehrer.push(lehrerI);
        neuesEle=false;
      }else if((obj.fach==fachI)&&(obj.klasse==klasseI)&&(obj.lehrer[0]!=undefined)){
        console.log("neues Element hinzufügen");
        neuesEle=true;
      }
      else{
        //console.log("das Element entspricht nicht dem angeklickten");
      }
    }
    });

  
    //wenn ein Lehrer schon drin is, neues Element erstellen mit Lehrer drin.
    if(neuesEle==true){
      this.klassenplanServ.elementHinzufuegenmitLehrer(fachI,klasseI,lehrerI);
    }else{
    this.klassenplanServ.grundPlanfaecher.next(neuArray);
    }
   // console.log(this.klassenplanServ.grundPlanfaecher);
  }

  toggleClick(lehrer: Lehrer, fach: Fach, klasse: Lehrjahr) {
    this.lehrerHinzufuegen(lehrer, klasse, fach);
  }

  lehrerZuweisung(zeileI) {
    let liste: Array < Lehrer >= [];
    this.lehrerauswahl.forEach((fachLehrer) => {
      if (this.faecher[zeileI] == fachLehrer.fach) { //grundplanfächer als Bezug der Reihen [0] ist das Fach
        fachLehrer.lehrer.forEach((lehrer) => {
          liste.push(lehrer);
        });
      }
    });
    return liste;
  }

  constructor(public lehrerServ: LehrerService, public klassenFaecherServ: KlassenFaecherService,
    public klassenplanServ: KlassenplaeneService) {
        
 this.klassenplanServ.grundPlanfaecher$.subscribe((data)=>this.grundPlanfaecher=data);

    this.klassenplanServ.grundPlanerstellen();
    this.lehrerauswahl = lehrerServ.lehrernachFach();
   // console.log(this.grundPlanfaecher);
  //  this.klassenplanServ.elementHinzufuegen(Fach.wirtschaftspolitik,Lehrjahr.dreizehn);
  }



  ngOnInit(): void {}

}
