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
import {
  Elementt
} from 'src/app/interfaces/elementt';
import { reduceEachLeadingCommentRange } from 'typescript';


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


  addieren(e, fa, kl) {
    this.klassenplanServ.elementHinzufuegen(fa, kl);
    if (e.shiftKey) {
      this.klassenplanServ.elementLoeschen(fa, kl);
    }
  }
  mainButtonClick(e, ele) {
    if (e.shiftKey) {
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
            //Lehrer in rhythmus hinzufügen?
          }
          break;
        case "epoche":
          if ((e.shiftKey) && (elementDerZeile.epoche > 0)) {
            elementDerZeile.epoche--;
          } else {
            elementDerZeile.epoche++;
            //Lehrer in epoche hinzufügen?
          }
          break;
        case "schiene":
          if ((e.shiftKey) && (elementDerZeile.schiene > 0)) {
            elementDerZeile.schiene--;
          } else {
            elementDerZeile.schiene++;
            //Lehrer in schiene hinzufügen?
          }
          break;
      }
    }
  }

  fachElemente(rowI: number, klasse: number) { //i ist die reihe (des fachs, alle lehrer mit dem fach werden in allen klassen angezeigt)
    let alleFilter: Array < Elementt > = [];
    this.grundPlanfaecher.forEach((element, e) => {
      if ((element) && (klasse == element.klasse) && (this.faecher[rowI] == element.fach)) {
        alleFilter.push(element);
        //Anzahl Epoche/Rhythmus oder Schiene in HU etc->Lehrer einfügen?
      }
    });
    return alleFilter; //zb alle Elemente für französisch
  }

  lehrerHinzufuegen(lehrerI: Lehrer, klasseI: Lehrjahr, fachI: Fach) {
    let neuesEle: boolean;
    let neuArray: Array < Elementt >= this.klassenplanServ.grundPlanfaecher.getValue();

    neuArray.forEach(obj => {
      if (obj != null) {
        //  console.log(obj.fach + " / " + obj.klasse);
        if ((obj.fach == fachI) && (obj.klasse == klasseI) && (obj.lehrer[0] == undefined)) {
          console.log("L. hinzugefügt, kein neues Element");
          obj.lehrer.push(lehrerI);
          neuesEle = false;
        } else if ((obj.fach == fachI) && (obj.klasse == klasseI) && (obj.lehrer[0] != undefined)) {
          console.log("neues Element hinzufügen");
          neuesEle = true;
        } else {
          //console.log("das Element entspricht nicht dem angeklickten");
        }
      }
    });


    //wenn ein Lehrer schon drin is, neues Element erstellen mit Lehrer drin.
    if (neuesEle == true) {
      this.klassenplanServ.elementHinzufuegenmitLehrer(fachI, klasseI, lehrerI);
    } else {
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

  esrFuellen(esr, fach, klasse) { //geht nur von neun bis zwölf

    let klassenElemente = this.grundPlanfaecher.filter((element) => (element != null && element.klasse == klasse)); //Alle klasse 9 zb.
    let hu = klassenElemente.filter(element => element[esr] >= 1); //esr muss epoche schiene oder rhythmus sein //Alle mit z.b.epochenzuweisung
    console.log(hu);

    this.grundPlanfaecher.forEach((element, e) => {
      if (element != null) {
        if (element.klasse == klasse && element.fach == fach) { //erst: 9. klasse Hauptunterricht
         // console.log(element);
          element.lehrer = [];
          hu.forEach(el => {
            if(el[esr]>=1){
              element.lehrer.push(el.lehrer[0]);
            }
            if(el[esr]>=2){
              element.lehrer.push(el.lehrer[0]);
            }
            if(el[esr]>=3){
              element.lehrer.push(el.lehrer[0]);
            }
          });
        }
      }

    });
  }

  epocheSchieneRhythmusBefuellen() {
    this.esrFuellen("epoche", Fach.hauptunterricht, Lehrjahr.neun);
      this.esrFuellen("rhythmus", Fach.rhythmisch, Lehrjahr.neun);
      this.esrFuellen("schiene", Fach.schiene, Lehrjahr.neun);
      this.esrFuellen("epoche", Fach.hauptunterricht, Lehrjahr.zehn);
      this.esrFuellen("rhythmus", Fach.rhythmisch, Lehrjahr.zehn);
      this.esrFuellen("schiene", Fach.schiene, Lehrjahr.zehn);
      this.esrFuellen("epoche", Fach.hauptunterricht, Lehrjahr.elf);
      this.esrFuellen("rhythmus", Fach.rhythmisch, Lehrjahr.elf);
      this.esrFuellen("schiene", Fach.schiene, Lehrjahr.elf);
      this.esrFuellen("epoche", Fach.hauptunterricht, Lehrjahr.zwoelf);
      this.esrFuellen("rhythmus", Fach.rhythmisch, Lehrjahr.zwoelf);
      this.esrFuellen("schiene", Fach.schiene, Lehrjahr.zwoelf);
   
  }

rechner(klasse){
  let klassenElemente = this.grundPlanfaecher.filter((element) => (element != null && element.klasse == klasse)); //Alle klasse 9 zb.
  let uebstunden=klassenElemente.filter((element)=>(element!=null&&element.uebstunde>0));
  let rhythmus=klassenElemente.filter((element)=>(element!=null&&element.rhythmus>0));
  let epoche=klassenElemente.filter((element)=>(element!=null&&element.epoche>0));
  let schiene=klassenElemente.filter((element)=>(element!=null&&element.schiene>0));
  
  let zaehlUeb=0;
  let zaehlR=0;
  let zaehlE=0;
  let zaehlS=0;

  Object.values(Fach).forEach(fach=>{
    let fachItems=uebstunden.filter(eles=>(eles.fach==fach));
    if(fachItems.length>0){
      zaehlUeb=zaehlUeb+fachItems[0].uebstunde;
    }
    fachItems=rhythmus.filter(eles=>(eles.fach==fach));
    if(fachItems.length>0){
      zaehlR=zaehlR+fachItems[0].rhythmus;
    }

    fachItems=epoche.filter(eles=>(eles.fach==fach));
    if(fachItems.length>0){
      zaehlE=zaehlE+fachItems[0].epoche;
    }

    fachItems=schiene.filter(eles=>(eles.fach==fach));
    if(fachItems.length>0){
      zaehlS=zaehlS+fachItems[0].schiene;
    }
  });

  return [zaehlUeb,zaehlR,zaehlE,zaehlS];
  }




  constructor(public lehrerServ: LehrerService, public klassenFaecherServ: KlassenFaecherService,
    public klassenplanServ: KlassenplaeneService) {


    this.klassenplanServ.grundPlanfaecher$.subscribe((data) => {
      this.grundPlanfaecher = data;
      // console.table(data)
    });


    this.lehrerauswahl = lehrerServ.lehrernachFach();
    // console.log(this.grundPlanfaecher);
    //  this.klassenplanServ.elementHinzufuegen(Fach.wirtschaftspolitik,Lehrjahr.dreizehn);
    //console.log(this.klassenplanServ.grundPlanfaecher.getValue());
  }





  ngOnInit(): void {}

}
