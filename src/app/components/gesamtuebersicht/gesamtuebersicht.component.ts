import {
  Component,
  OnInit
} from '@angular/core';
import {
  element
} from 'protractor';
import {
  concatMap,
  filter,
  map,
  reduce,
  take,
} from 'rxjs/operators';
import {
  Fach
} from 'src/app/enums/fach.enum';
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

  links() {
    if (this.wochenTagauswahl === "Montag") {
      this.wochenTagauswahl = "Dienstag"
    } else if (this.wochenTagauswahl === "Dienstag") {
      this.wochenTagauswahl = "Mittwoch";
    } else if (this.wochenTagauswahl === "Mittwoch") {
      this.wochenTagauswahl = "Donnerstag";
    } else if (this.wochenTagauswahl === "Donnerstag") {
      this.wochenTagauswahl = "Freitag";
    } else if (this.wochenTagauswahl === "Freitag") {
      this.wochenTagauswahl = "Montag";
    }
  }
  rechts() {
    if (this.wochenTagauswahl === "Montag") {
      this.wochenTagauswahl = "Freitag"
    } else if (this.wochenTagauswahl === "Freitag") {
      this.wochenTagauswahl = "Donnerstag";
    } else if (this.wochenTagauswahl === "Donnerstag") {
      this.wochenTagauswahl = "Mittwoch";
    } else if (this.wochenTagauswahl === "Mittwoch") {
      this.wochenTagauswahl = "Dienstag";
    } else if (this.wochenTagauswahl === "Dienstag") {
      this.wochenTagauswahl = "Montag";
    }

  }

  gesamtRaster$ = this.klassenplanServ.grundPlanfaecher$.pipe( //Bei Änderungen im Plan updaten
  
    map(z => {
      let ar = {
        montag: new Array(11).fill(null).map(x => new Array(13)),
        dienstag: new Array(11).fill(null).map(x => new Array(13)),
        mittwoch: new Array(11).fill(null).map(x => new Array(13)),
        donnerstag: new Array(11).fill(null).map(x => new Array(13)),
        freitag: new Array(11).fill(null).map(x => new Array(13))
      };
      z.forEach(el => {
        el.zuweisung.uebstunde.forEach(zuw => {
          //  ["Montag", "Dienstag", "Mittwoch", "Donnerstag"].forEach(wochenTag=>{
          let std = zuw.stunde;
          let woT = zuw.wochentag;
          let klasse = parseInt(el.klasse) - 1;

          if (ar[woT.toLowerCase()][std][klasse] === undefined) {
            ar[woT.toLowerCase()][std][klasse] = new Array();
          }

          if(el.lehrer.length===0){
            ar[woT.toLowerCase()][std][klasse].push([el.fach, "NN"]);
          }

          //wenn lehrer vorhanden
          el.lehrer.forEach(lehr => {
            //   console.log(el.fach);
            //   console.log(lehr.kuerzel
            if (lehr) {
              ar[woT.toLowerCase()][std][klasse].push([el.fach, lehr.kuerzel]);
            } else {
             

            }
          });
        });
      });
      return ar;
    })
  );


  cellKlick(e, c, reiheKlasse) {
    if (e.shiftKey) {
      let neu = this.klassenplanServ.grundPlanfaecher.getValue();
      // neu[c].zuweisung.uebstunde=[];
      neu.forEach((element, el) => {
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
      this.klassenplanServ.grundPlanfaecher.next(neu);
      //  console.log("ende");
    } else {}
  }


  markedd(lehr) {
    if (lehr && this.selectLehrer && lehr == this.selectLehrer.kuerzel) {
      return "blueback";
    }
  }

  duplicatess(kuerz, z, fachd) { //
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
              if (kuerz == null || le == null) {

              } else if (kuerz && element && kuerz == le.kuerzel) {
                // console.log(element.lehrer[0].kuerzel + "." +r + ". " + element.klasse);

                if (fachd != Fach.hauptunterricht && fachd != Fach.schiene && fachd != Fach.rhythmisch && fachd != Fach.orchester && fachd != Fach.wahlpflicht && fachd != Fach.chor && fachd != Fach.mittelstufenorchester) {
                  duplicates++;
                } else if (element.fach != Fach.hauptunterricht && element.fach != Fach.schiene && element.fach != Fach.rhythmisch && element.fach != Fach.orchester && element.fach != Fach.wahlpflicht && element.fach != Fach.chor && element.fach != Fach.mittelstufenorchester) {
                  duplicates++;
                }
              }
            });
          }
        });
      }
    });

    if (fachd == Fach.hauptunterricht || fachd == Fach.schiene || fachd == Fach.rhythmisch) {
      duplicates++;
    }
    return duplicates > 1 ? "error" : "ok";
  }


  hintergrundd(el) {
    // console.log(el);

    if (el && el[0]) {
      switch (el[0][0]) {
        case Fach.hauptunterricht:
          return "huB";
        case Fach.schiene:
          return "schB";
        case Fach.rhythmisch:
          return "rhyB";
        case "HU":
          return "huB";
        default:
          return "normalB";
      }
    } else {
      return "empty";
    }
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


  wochenStundenBerechnen() {
    // this.klassenplanServ.berechnung(); 
  }
  klassengesamtstunden(kla) {
    let elementederKlasse = this.tabellensortierung(kla);
    let zaehler = 0;
    // console.log(elementederKlasse);
    //console.log(Object.values(Fach));

    let faecher = Object.values(Fach);
    faecher.forEach(fach => {
      //  console.log(fach);

      let fachItems = elementederKlasse.filter(eles => (eles.fach == fach));
      //  console.log(fachItems);
      if (fachItems.length > 0) {
        // console.log(" Kl. " +fachItems[0].klasse + " " + fachItems[0].fach+  " : " + fachItems[0].uebstunde);
        zaehler = zaehler + fachItems[0].uebstunde;
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

        if (element.lehrer[0] == null||element.lehrer[0].kuerzel===null) {
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



  duplicates(lehr, z, fachd) { //
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

                if (fachd != Fach.hauptunterricht && fachd != Fach.schiene && fachd != Fach.rhythmisch && fachd != Fach.orchester && fachd != Fach.wahlpflicht && fachd != Fach.chor && fachd != Fach.mittelstufenorchester) {
                  duplicates++;
                } else if (element.fach != Fach.hauptunterricht && element.fach != Fach.schiene && element.fach != Fach.rhythmisch && element.fach != Fach.orchester && element.fach != Fach.wahlpflicht && element.fach != Fach.chor && element.fach != Fach.mittelstufenorchester) {
                  duplicates++;
                }


              }
            });
          }
        });
      }


    });

    if (fachd == Fach.hauptunterricht || fachd == Fach.schiene || fachd == Fach.rhythmisch) {
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
