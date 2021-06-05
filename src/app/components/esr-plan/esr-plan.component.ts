import {
  Component,
  OnInit
} from '@angular/core';
import {
  isSameDay,
  eachDayOfInterval,
  differenceInBusinessDays
} from 'date-fns';
import { Fach } from 'src/app/enums/fach.enum';
import {
  Lehrjahr
} from 'src/app/enums/lehrjahr.enum';
import {
  Elementt
} from 'src/app/interfaces/elementt';
import {
  EpochenPlaeneService
} from 'src/app/services/epochen-plaene.service';
import {
  FerientermineService
} from 'src/app/services/ferientermine.service';
import {
  KlassenplaeneService
} from 'src/app/services/klassenplaene.service';

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

  esrPlan;
  grundPlanfaecher: Array < Elementt > ;

  gewaehlterPlan = "rhythmus";
  gewaehltesElement: Elementt;
  clickCount = 0;
  berechnung() {
    let schieneElem=this.grundPlanfaecher.find(element=> element.fach==Fach.schiene);
    let huElem=this.grundPlanfaecher.find(element=> element.fach==Fach.hauptunterricht);
    let rhythmElem=this.grundPlanfaecher.find(element=> element.fach==Fach.rhythmisch);
    let jahresStundenWert=30;

    this.grundPlanfaecher=this.grundPlanfaecher.filter(function (el) {
      return el != null;
    });

    this.grundPlanfaecher.forEach(element=>{

      //Wochenstunden für Schiene/Rhythmus und Epoche herauslesen (in Stundenplan zu überprüfen ob es tatsächlich ist):

      let soll= element.wochenstunden ;  //soll-Stunden z.B. 4 in Mathe
      let epochenSoll=element.epoche; //soll Epoche
      let schieneSoll=element.schiene;//soll Schiene
      let rhythmusSoll=element.rhythmus; //Soll rhythmus
      let uebstundenSoll=element.uebstunde;//soll Uebstunde
  

      let uebstundeIST=element.zuweisung.uebstunde.length;

      let rhythmusIST=0; //logisch errechnete Stunden Wochen mal anzahl der Wochenstunden vom rhythmus

      element.zuweisung.rhythmus.forEach(startEnde=>{
        let start=startEnde.start; //Date
        let ende=startEnde.ende;
        let wochen=(differenceInBusinessDays(ende,start)+1)/5;
        rhythmusIST=rhythmusIST+(wochen*rhythmElem.wochenstunden)/jahresStundenWert;  
       });

       let epocheIST=0;

      element.zuweisung.epoche.forEach(startEnde=>{
        let start=startEnde.start; //Date
        let ende=startEnde.ende;
        let wochen=(differenceInBusinessDays(ende,start)+1)/5;
        epocheIST=epocheIST+wochen*huElem.wochenstunden/jahresStundenWert;

      });

      let schieneIST=0;

      element.zuweisung.schiene.forEach(startEnde=>{
        let start=startEnde.start; //Date
        let ende=startEnde.ende;
        let wochen=(differenceInBusinessDays(ende,start)+1)/5;
        schieneIST=schieneIST+wochen*schieneElem.wochenstunden/jahresStundenWert;
      });

      let uebDiff=uebstundenSoll-uebstundeIST;
      let rhythmDiff=rhythmusSoll-rhythmusIST;
      let epochenDiff=epochenSoll-epocheIST;
      let schieneDiff=schieneSoll-schieneIST;

      
      if(rhythmusSoll!=0&&element.klasse==Lehrjahr.neun&&this.gewaehlterPlan=="rhythmus"){

        console.log(element);
 // console.log("Uebstunde: Soll/IST: " + uebstundenSoll + " / "  + uebstundeIST) + ".";
  console.log("rhytmus: Soll/IST: " + rhythmusSoll*jahresStundenWert/rhythmElem.wochenstunden + " / "  + rhythmusIST*jahresStundenWert/rhythmElem.wochenstunden) + ".";
}
 if(epochenSoll!=0&&element.klasse==Lehrjahr.neun&&this.gewaehlterPlan=="epoche"){
  console.log(element);
  console.log("epoche: Soll/IST: " + epochenSoll*jahresStundenWert/huElem.wochenstunden + " / "  + epocheIST*jahresStundenWert/huElem.wochenstunden) + ".";
 }
  //console.log("schiene: Soll/IST: " + schieneSoll*jahresStundenWert/5 + " / "  + schieneIST*jahresStundenWert/5) + ".";
 // console.log("------");
 // console.log("Erwartete Gesamtstunden  ");
 // console.log(soll);
    //  let epochenIST=element.
     // let ergebnis=

    });

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


  click(e, klasse, tagIndex, klasseString, wochentagZahl) { //wochenTagZahl So=0, Mo=1, Di=2, Mi=3, Do=4, Fr=5, Sa=6

    let monta = this.esrPlan[tagIndex - wochentagZahl + 1].tag; //Montag der Woche auswhäln für Start
    let freit = this.esrPlan[tagIndex - wochentagZahl + 5].tag; //Ende der Schulwoche/epoche
    let clickStart = true;
    //Gerade oder Ungerade Clickanzahl
    if (this.clickCount % 2 == 0) {
      clickStart = true;
    } else {
      clickStart = false;
    }

    this.grundPlanfaecher.forEach(ele => {
      if (ele) {
        ele.lehrer.forEach((le, eh) => {
          if (e.shiftKey) {
            ele.zuweisung[this.gewaehlterPlan].forEach((startEnde, s) => {
              if (startEnde.start.getTime() == monta.getTime() && klasse == ele.klasse) {
                ele.zuweisung[this.gewaehlterPlan].splice(s, 1);
                console.log(ele.zuweisung[this.gewaehlterPlan]);
              }
            });

          } else {

            if (ele.klasse == this.gewaehltesElement.klasse && le == this.gewaehltesElement.lehrer[eh] && ele.fach == this.gewaehltesElement.fach) {
              if (clickStart == true) {
                ele.zuweisung[this.gewaehlterPlan].push({
                  start: monta,
                  ende: null
                });
              } else { //Ende:
                ele.zuweisung[this.gewaehlterPlan].forEach(obj => {

                  if (obj.ende == null) {
                    obj.ende = freit; //Freitag für das ende der epoche
                    console.log(ele.zuweisung[this.gewaehlterPlan]);
                  }
                });

              }
                            console.log(ele.zuweisung[this.gewaehlterPlan]);
                           console.log(ele);
            }
          }
        });
      }
    });


    this.clickCount++;
  }




  //console.log(this.esrPlan);





  epochenWahl(ele: Elementt) {
    this.gewaehltesElement = ele;
    this.clickCount = 0;

  }


  duplicates(lehrer, tag) {
    let duplica = 0;

    this.grundPlanfaecher.forEach(elem => {
      if (elem) {
        elem.zuweisung[this.gewaehlterPlan].forEach(startEnde => { //nur angewählter plan rhythmus o. shiene oder epoche die jeweiligen start-endes angucken je element
         if(startEnde.start!=null&&startEnde.ende!=null){
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

  constructor(public epochenPlanS: EpochenPlaeneService, public ferienServ: FerientermineService, public klassenplanServ: KlassenplaeneService) {
    this.epochenPlanS.esr_plan$.subscribe((data) => {
      this.esrPlan = data;
      //  console.log(data);
    });
    this.klassenplanServ.grundPlanfaecher$.subscribe((data) => this.grundPlanfaecher = data);
  }

  ngOnInit(): void {}

}
