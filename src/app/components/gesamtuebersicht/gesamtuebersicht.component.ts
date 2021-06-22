import {
  Component,
  OnInit
} from '@angular/core';
import {
  BehaviorSubject
} from 'rxjs';
import { Fach } from 'src/app/enums/fach.enum';
import {
  Lehrjahr
} from 'src/app/enums/lehrjahr.enum';
import {
  Wochentag
} from 'src/app/enums/wochentag.enum';
import {
  Elementt
} from 'src/app/interfaces/elementt';
import {
  Lehrer
} from 'src/app/interfaces/lehrer';
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
  selector: 'app-gesamtuebersicht',
  templateUrl: './gesamtuebersicht.component.html',
  styleUrls: ['./gesamtuebersicht.component.scss']
})
export class GesamtuebersichtComponent implements OnInit {
  wochenTagauswahl: string;
  grundPlanfaecher: Array < Elementt > ; //statt stundenLehrerArray?
  lehrerAuswahl = []; //nur übstundenFilter von grundplanfaecher
  tagesPlan = [];
  // stundenRaster: Gesamtstundenraster;

  wochentage = Wochentag;
  kuerzeleinblenden: boolean;
  buttontext = "einblenden";
  selectLehrer: Lehrer;

 

  klassen = Object.values(Lehrjahr);

  wochenStundenBerechnen() {
    // this.klassenplanServ.berechnung(); 
  }
  klassengesamtstunden(kla){
    let elementederKlasse=this.tabellensortierung(kla);
    let zaehler=0;
   // console.log(elementederKlasse);
    //console.log(Object.values(Fach));

    let faecher=Object.values(Fach);
    faecher.forEach(fach=>{
    //  console.log(fach);
      
      let fachItems=elementederKlasse.filter(eles=>(eles.fach==fach));
    //  console.log(fachItems);
 if(fachItems.length>0){
  // console.log(" Kl. " +fachItems[0].klasse + " " + fachItems[0].fach+  " : " + fachItems[0].uebstunde);
  zaehler=zaehler+fachItems[0].uebstunde;
 }
   //   

    });



    return zaehler;
  }

  berechnungAktuelleStunden(elementt) {
    return this.klassenplanServ.berechnung(elementt);
  }


  zellenInhalt(klas, std) {
    let inhalt = [];
    this.grundPlanfaecher.forEach(element => {
      if (element && element.zuweisung && element.zuweisung.uebstunde) {
        element.zuweisung.uebstunde.forEach(woStd => {

          if (woStd.wochentag == this.wochenTagauswahl && woStd.stunde == std && element.klasse == klas) {
            inhalt.push(element);
          }
        });
      }
    });
    // console.log(inhalt);
    return inhalt;
  }

  wochentagWahl(x: string) {
    this.wochenTagauswahl = x;
  }

  tabellensortierung(klasse) {

    let lehrerVonKlasse: Array < Elementt > = [];

    if (this.grundPlanfaecher) {
      this.grundPlanfaecher.forEach(element => {
        if ((element != null) && (element.klasse == klasse) && (element.uebstunde > 0)) {
          // let filter = this.grundPlanfaecher.filter(el => el.klasse == klasse&&el.uebstunde>0);//Alle Elemente der Klasse filtern
          lehrerVonKlasse.push(element);
        }
      });
    }

    return lehrerVonKlasse;
  }

  valueLoopinArray(obj) {
    // console.log(obj);
    return Object.values(obj);
  }
  keyinArray(obj) {
    return Object.keys(obj);
  }
  wochenTagLoop() {
    return Object.values(Wochentag);
  }

  

  marked(lehr) {
    if (lehr && this.selectLehrer && lehr.kuerzel == this.selectLehrer.kuerzel) {
      return "blueback";
    }
  }

  togglezellenClick(stdZ, clickedElementt: Elementt) { //ganze Zelle/stunden zeile als Zahl
    let neu = this.klassenplanServ.grundPlanfaecher.getValue();
    neu.forEach((element, e) => {
      if (element != null && element.fach == clickedElementt.fach && element.klasse == clickedElementt.klasse && (element.uebstunde > 0)) {

        if (element.lehrer[0] == null) {
          element.zuweisung.uebstunde.push({
            wochentag: this.wochenTagauswahl,
            stunde: stdZ
          });
        } else if (element.lehrer[0].kuerzel == clickedElementt.lehrer[0].kuerzel) {

          element.zuweisung.uebstunde.push({
            wochentag: this.wochenTagauswahl,
            stunde: stdZ
          });
        }
        //bei HGW auch die einzelnen Fächer hochzählen
      }
    });
    this.klassenplanServ.grundPlanfaecher.next(neu);
    //Bei HU und epoche ggf nichts ändern? 
  }

  cellKlick(e, c, reiheKlasse) {
    if (e.shiftKey) {
      // let neu=this.klassenplanServ.grundPlanfaecher.getValue();
      // neu[c].zuweisung.uebstunde=[];
      this.grundPlanfaecher.forEach((element, el) => {
        if (element != null) {
          element.zuweisung.uebstunde.forEach((zuw, z) => {
            if (element != null && zuw.wochentag == this.wochenTagauswahl && zuw.stunde == c && element.klasse == reiheKlasse) {
              element.zuweisung.uebstunde.splice(z, 1);
              console.log("gelöschte uebstunde:");
              console.log(element);
              console.log(z);
              console.log(zuw);

              //element.zuweisung.uebstunde=[];
            }
          });
        }
      });
      // console.log(neu);
      // this.klassenplanServ.grundPlanfaecher.next(neu);
      console.log("ende");
    } else {}
  }

  duplicates(lehr, z,fachd) { //
    let duplicates = 0;
    this.grundPlanfaecher.forEach((element, e) => {
      if (element == null) {
        this.grundPlanfaecher.splice(e, 1);
      } else {
        element.zuweisung.uebstunde.forEach(({
          wochentag,
          stunde
        }, ue) => {
          //  console.log(wochentag + "."+this.wochenTagauswahl);
          if (wochentag == this.wochenTagauswahl && stunde == z) {
            element.lehrer.forEach(le => {
              if (lehr == null || le == null) {

              } else if (lehr && element && lehr.kuerzel == le.kuerzel) {
                // console.log(element.lehrer[0].kuerzel + "." +r + ". " + element.klasse);
               
                if(fachd!=Fach.hauptunterricht&&fachd!=Fach.schiene&&fachd!=Fach.rhythmisch&&fachd!=Fach.orchester&&fachd!=Fach.wahlpflicht&&fachd!=Fach.chor&&fachd!=Fach.mittelstufenorchester){
                duplicates++;
                }else  if(element.fach!=Fach.hauptunterricht&&element.fach!=Fach.schiene&&element.fach!=Fach.rhythmisch&&element.fach!=Fach.orchester&&element.fach!=Fach.wahlpflicht&&element.fach!=Fach.chor&&element.fach!=Fach.mittelstufenorchester){
                  duplicates++;
                  }

                
              }
            });
          }
        });
      } 
      
    
    });

    if(fachd==Fach.hauptunterricht||fachd==Fach.schiene||fachd==Fach.rhythmisch){
      duplicates++;
    }
    return duplicates > 1 ? "error" : "ok";
  }

  duplicateToggle(c, ele) {

    let duplicates = 0;
    this.grundPlanfaecher.forEach((element, e) => {
      if (element == null) {
        this.grundPlanfaecher.splice(e, 1);
      } else {
        element.zuweisung.uebstunde.forEach((woStu, ue) => {
          //console.log(woStu.wochentag + "."+this.wochenTagauswahl);
          if (woStu.wochentag == this.wochenTagauswahl && woStu.stunde == c) {
            // console.log("gleiche Stunde/Tag");
            element.lehrer.forEach(le => {

              ele.lehrer.forEach(el => {
                //    console.log(el.kuerzel);
                //    console.log(le.kuerzel);
                if (ele != null && element != null && el != null && le != null && el.kuerzel == le.kuerzel) {
                  //     console.log("gleiche lehrer!");

                  // console.log(element.lehrer[0].kuerzel + "." +r + ". " + element.klasse);
                  duplicates++;
                }
              });

            });
          }
        });
      }
    });
    return duplicates > 0 ? "error" : "ok";
  }

  leherkuerzelToggle() {
    if (this.kuerzeleinblenden == true) {
      this.kuerzeleinblenden = false;
      this.buttontext = "einblenden";
    } else {
      this.kuerzeleinblenden = true;
      this.buttontext = "ausblenden";
    }
  }

  constructor(public lehrerService: LehrerService, public login: LoginService, public klassenplanServ: KlassenplaeneService) {
    this.wochenTagauswahl = 'Montag';
    this.kuerzeleinblenden = false;
    this.klassenplanServ.grundPlanfaecher$.subscribe((data) => {
      this.grundPlanfaecher = data;
      // console.log(data);
    });
    this.wochentagWahl(this.wochenTagauswahl);
    this.tagesPlan = login.leerestagesRaster();

    lehrerService.lehrerSelected$.subscribe(data => {
      this.selectLehrer = data;
    });
  }

  ngOnInit(): void {}

}
