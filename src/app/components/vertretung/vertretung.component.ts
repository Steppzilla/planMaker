import {
  Component,
  OnInit
} from '@angular/core';
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
  VertretungsElement
} from 'src/app/interfaces/vertretungs-element';
import {
  KlassenplaeneService
} from 'src/app/services/klassenplaene.service';
import {
  LehrerService
} from 'src/app/services/lehrer.service';
import {
  LoginService
} from 'src/app/services/login.service';
import {
  VertretungServService
} from 'src/app/services/vertretung-serv.service';

@Component({
  selector: 'app-vertretung',
  templateUrl: './vertretung.component.html',
  styleUrls: ['./vertretung.component.scss']
})
export class VertretungComponent implements OnInit {

  aktuellESRArray: Array < Elementt > ;



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

            if (element.fach != Fach.hauptunterricht && element.fach != Fach.schiene && element.fach != Fach.rhythmisch || parseInt(element.klasse) <= 8) {
              inhalt.push(element);
            } else {
              //aktuelle Epoche reinschreiben:
              if (element.fach == Fach.hauptunterricht) {
               // console.log(this.vertretungsSer.aktuelleESRElemente);
               // console.log(this.vertretungsSer.aktuelleESRElemente.filter(ele => ele[0].klasse == klas && ele[2] == "epoche"));
                let auswahl = this.vertretungsSer.aktuelleESRElemente.filter(ele => ele[0].klasse == klas && ele[2] == "epoche");
                let speicher = [];
                let neu = [];
                let bo = true;
                auswahl.forEach(ehl => {
                  if (speicher.length > 0) {
                    speicher.forEach(speichELEM => {
                      if (speichELEM.fach == ehl[0].fach && speichELEM.lehrer[0].kuerzel == ehl[0].lehrer[0].kuerzel) {
                 //       console.log("false");
                        bo = false;
                      }
                    });
                  }
                  if (bo == true) {
                    neu.push(ehl[0]);
                  
                  }
                  speicher.push(ehl[0]);
                });

                inhalt = neu;

              } else if (element.fach == Fach.schiene) {
              //  console.log(this.vertretungsSer.aktuelleESRElemente);
              ///  console.log(this.vertretungsSer.aktuelleESRElemente.filter(ele => ele[0].klasse == klas && ele[2] == "schiene"));
                let auswahl = this.vertretungsSer.aktuelleESRElemente.filter(ele => ele[0].klasse == klas && ele[2] == "schiene");
                let speicher = [];
                let neu = [];
                let bo = true;
                auswahl.forEach(ehl => {

                  speicher.forEach(speichELEM => {
                    if (speichELEM.fach == ehl[0].fach && speichELEM.lehrer[0].kuerzel == ehl[0].lehrer[0].kuerzel) {
                      bo = false;
                    }
                  });
                  if (bo == true) {
                    neu.push(ehl[0]);
                  }
                  speicher.push(ehl[0]);


                })

                inhalt = neu;

              } else if (element.fach == Fach.rhythmisch) {
             //   console.log(this.vertretungsSer.aktuelleESRElemente);
             //   console.log(this.vertretungsSer.aktuelleESRElemente.filter(ele => ele[0].klasse == klas && ele[2] == "rhythmus"));
                let auswahl = this.vertretungsSer.aktuelleESRElemente.filter(ele => ele[0].klasse == klas && ele[2] == "rhythmus");
                let speicher = [];
                let neu = [];
                let bo = true;
                auswahl.forEach(ehl => {

                  speicher.forEach(speichELEM => {
                    if (speichELEM.fach == ehl[0].fach && speichELEM.lehrer[0].kuerzel == ehl[0].lehrer[0].kuerzel) {
                      bo = false;
                    }
                  });
                  if (bo == true) {
                    neu.push(ehl[0]);
                  }
                  speicher.push(ehl[0]);


                })

                inhalt = neu;

              }
            }
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
                  //duplicates++; //Funktioniert hier nicht, wenn man HU anzeigen lässt!
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

  leherkuerzelToggle() {
    if (this.kuerzeleinblenden == true) {
      this.kuerzeleinblenden = false;
      this.buttontext = "einblenden";
    } else {
      this.kuerzeleinblenden = true;
      this.buttontext = "ausblenden";
    }
  }

  /*

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
      }*/

  //ANDERS ALS BEIM GESAMTPLan muss hier diesmal nicht das Raster geändert werden, sondern ein Vertretungsplan erstellt werden:

  togglezellenClick(stdZ, clickedElementt: Elementt) { //ganze Zelle/stunden zeile als Zahl
   
this.vertretungsElement.vertretung=clickedElementt;
this.vertretungsSer.vertretung.push(this.vertretungsElement);
this.vertretungsElement={
  wochentag: null,
  datum: null,
  klasse: null,
  stunde: null,
  lehrer: null,
  fach: null,
  vertretung: null
};

  }


  vertretungsElement: VertretungsElement = {
    wochentag: null,
    datum: null,
    klasse: null,
    stunde: null,
    lehrer: null,
    fach: null,
    vertretung: null
  };

  cellKlick(e, c, reiheKlasse) {
      // let neu=this.klassenplanServ.grundPlanfaecher.getValue();
      // neu[c].zuweisung.uebstunde=[];

      this.grundPlanfaecher.forEach((element, el) => {
        if (element != null) {
          element.zuweisung.uebstunde.forEach((zuw, z) => {
            if (element != null && zuw.wochentag == this.wochenTagauswahl && zuw.stunde == c && element.klasse == reiheKlasse) {

              //NUr wenn auch vorher markiert wurde:
              element.lehrer.forEach(leHHR => {
                if (this.marked(leHHR) == "blueback") {
                  //bei Übstunde gleich reinpushen
                  if (element.fach != Fach.hauptunterricht && element.fach != Fach.schiene && element.fach != Fach.rhythmisch || parseInt(element.klasse) <= 8) {
                    this.vertretungsElement.wochentag = element.zuweisung.uebstunde[z].wochentag;
                    //vertretungsElement.datum=element.zuweisung.uebstunde
                    this.vertretungsElement.klasse = parseInt(element.klasse);
                    this.vertretungsElement.stunde = element.zuweisung.uebstunde[z].stunde;
                    this.vertretungsElement.lehrer = element.lehrer[0];
                    this.vertretungsElement.fach = element.fach;
                  //  this.vertretungsSer.vertretung.push(vertretungsElement);
                  }
                  //Bei hauptunterricht schiene oder epoche erst aktuelle Epoche finden:
                  else {
                    if(this.aktuellesElementdesESR(leHHR,element.klasse)!=undefined){
                    this.vertretungsElement.wochentag = element.zuweisung.uebstunde[z].wochentag;
                    this.vertretungsElement.klasse = parseInt(element.klasse);
                    this.vertretungsElement.stunde = element.zuweisung.uebstunde[z].stunde;
                    this.vertretungsElement.lehrer = leHHR;
                    this.vertretungsElement.fach = this.aktuellesElementdesESR(leHHR,element.klasse); //nur aktueller Lehrer geamrkt
                    //this.vertretungsSer.vertretung.push(vertretungsElement);
                    }
                  }
                }
              //  console.log(this.vertretungsSer.vertretung);
              });
            }
          });
        }
      });
      // console.log(neu);
      // this.klassenplanServ.grundPlanfaecher.next(neu);
   
  }

  aktuellesElementdesESR(le,klas) {
    let aktuell = this.vertretungsSer.aktuelleESRElemente.filter(el => el[0].lehrer[0].kuerzel == le.kuerzel&&el[0].klasse==klas);
    return aktuell[0]? aktuell[0][0].fach : undefined;

    //element=>element[0].klasse==klasse&&esr==element[2]
    ///  console.log(aktuell);
  }

  constructor(public vertretungsSer: VertretungServService, public lehrerService: LehrerService, public login: LoginService, public klassenplanServ: KlassenplaeneService) {
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
