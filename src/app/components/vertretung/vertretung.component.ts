import {
  AfterViewInit,
  Renderer2,

} from '@angular/core';

import {
  Component,
  OnInit
} from '@angular/core';
import {
  map
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
  VertretungsElement
} from 'src/app/interfaces/vertretungs-element';
import {
  EpochenPlaeneService
} from 'src/app/services/epochen-plaene.service';
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

  vertretung;

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

  vertretungsraster = {};
  vertretungsraster2 = {};

  klassen = Object.values(Lehrjahr);


  zahlinKlasse(za) {
    // console.log(za);
    let zahl = parseInt(za);
    switch (zahl) {
      case 9:
        return 'neun';
      case 10:
        return 'zehn';
      case 11:
        return 'elf';
      case 12:
        return 'zwoelf';
    }

  }

  esr;
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
          el.lehrer.forEach(lehr => {
            if (ar[woT.toLowerCase()][std][klasse] === undefined) {
              ar[woT.toLowerCase()][std][klasse] = new Array();
            }
            //   console.log(el.fach);
            //   console.log(lehr.kuerzel);

            let hu;
            let strr = "";
            // console.log(this.esr);
            //Hu schiene und epoche mit aktuellen fächern füllen
            if ((el.fach == Fach.hauptunterricht || el.fach == Fach.schiene || el.fach == Fach.rhythmisch) && parseInt(el.klasse) > 8) {

              if (el.fach === Fach.hauptunterricht) {
                strr = "epo";
              } else if (el.fach === Fach.schiene) {
                strr = "sch";
              } else if (el.fach === Fach.rhythmisch) {
                strr = "rhy";
              }
              //   console.log(el.klasse);
              //  console.log(this.zahlinKlasse(el.klasse));
              hu = this.esr[this.zahlinKlasse(el.klasse)][strr];
            }
            if (hu && parseInt(el.klasse) > 8) {
              //  console.log(hu);
              ar[woT.toLowerCase()][std][klasse] = [{
                fach: el.fach,
                lehrerKuerz: "bob"
              }].concat(hu);
            } else {
              //  console.log(el.fach);
              //  console.log(lehr.kuerzel)
              ar[woT.toLowerCase()][std][klasse].push({
                fach: el.fach,
                lehrerKuerz: lehr.kuerzel
              });
            }

          });
        });
      });
      return ar;
    })
  );

  hintergrundd(el) {
    // console.log(el);

    if (el && el[0]) {
      switch (el[0].fach) {
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



  cellKlickk(e, c, i, cell) { //c ist zeilennummer, i ist die celle waagerecht!

    let raster;
    this.gesamtRaster$.subscribe(data=> raster=data);
    //this.esr sind alle aktuellen epochen drin mit .neun.rhy z.b. oder .zwoelf.epo=Zelle

    //
    let stringTag=this.wochenTagauswahl;

    //raster[stringTag][c][i]
    cell.forEach(fachLehrer => {
      if(this.markedd(fachLehrer.lehrerKuerz)=='blueback'){

        if (fachLehrer.fach != Fach.hauptunterricht && fachLehrer.fach != Fach.schiene && fachLehrer.fach != Fach.rhythmisch ) { //alle normalen stunden und hu unter 9. klasse
          this.vertretungsElement.wochentag = this.wochenTagauswahl;
          //vertretungsElement.datum=element.zuweisung.uebstunde
          this.vertretungsElement.klasse = i;
          this.vertretungsElement.stunde = c; //+1?
          this.vertretungsElement.lehrer = this.selectLehrer;
          this.vertretungsElement.fach = fachLehrer.fach;
          //  this.vertretungsSer.vertretung.push(vertretungsElement);
        }
        //Bei hauptunterricht schiene oder epoche erst aktuelle Epoche finden:
      
    }
  });
}

    //Wenn lehrer in der zelle markiert ist

   


  togglezellenClickk(stdZ, clickedElementt: Elementt, zelle) { //ganze Zelle/stunden zeile als Zahl
    if (this.vertretungsElement.klasse !== null) {
      console.log(zelle);
      let zellenI = zelle.findIndex(ele => ele.fach == this.vertretungsElement.fach && ele.lehrerKuerz === this.vertretungsElement.lehrer.kuerzel);
      //zellenI bestimmen index



      let aktuelleVertret = this.vertretungsSer.vertretung.getValue();
      this.vertretungsElement.vertretung = clickedElementt;
      aktuelleVertret.push(this.vertretungsElement);
      this.vertretungsSer.vertretung.next(aktuelleVertret);

      if (Number.isInteger(this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde])) {
        this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde] = [];
        //this.vertretungsraster[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse-1][this.vertretungsElement.stunde][0]=[];
      }
      if (!this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde][zellenI]) {
        this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde][zellenI] = [];
      }

      this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde][zellenI].push(this.vertretungsElement);


      
    } else {
      console.error("bitte klicke vorher einen Lehrer an");
    }
    this.vertretungsElement = {
      wochentag: null,
      datum: null,
      klasse: null,
      stunde: null,
      lehrer: null,
      fach: null,
      vertretung: null,
      sonderfach: null,
      notiz: null,
      vertretungsLehrer: null,
    };
  }


  freieLehrerClickk(lehr, cell) {

    if (this.vertretungsElement.klasse !== null) {
      let zellenI = cell.findIndex(ele => ele.fach == this.vertretungsElement.fach && ele.lehrerKuerz === this.vertretungsElement.lehrer.kuerzel);

      let aktuelleVertret = this.vertretungsSer.vertretung.getValue();
      this.vertretungsElement.vertretung = null; //kein element vorhanden
      this.vertretungsElement.vertretungsLehrer = lehr;
      aktuelleVertret.push(this.vertretungsElement); //VERTRETUNG IST UNDEFINED dafür notiz: selbständig
      this.vertretungsSer.vertretung.next(aktuelleVertret);


      if (Number.isInteger(this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde])) {
        this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde] = [];
        //this.vertretungsraster[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse-1][this.vertretungsElement.stunde][0]=[];
      }
      if (!this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde][zellenI]) {
        this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde][zellenI] = [];
      }

      this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde][zellenI].push(this.vertretungsElement);


     
    } else {
      console.error("bitte klicke vorher einen Lehrer an");
    }
    this.vertretungsElement = {
      wochentag: null,
      datum: null,
      klasse: null,
      stunde: null,
      lehrer: null,
      fach: null,
      vertretung: null,
      sonderfach: null,
      notiz: null,
      vertretungsLehrer: null
    };
  }

  freii(cell) {
    if (this.vertretungsElement.klasse !== null) {
      let zellenI = cell.findIndex(ele => ele.fach == this.vertretungsElement.fach && ele.lehrerKuerz === this.vertretungsElement.lehrer.kuerzel);

      let aktuelleVertret = this.vertretungsSer.vertretung.getValue();
      this.vertretungsElement.vertretung = null; //VERTRETUNG IST NULL aber dafür notiz "frei"
      this.vertretungsElement.notiz = "frei";
      aktuelleVertret.push(this.vertretungsElement);
      this.vertretungsSer.vertretung.next(aktuelleVertret);


      if (Number.isInteger(this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde])) {
        this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde] = [];
        //this.vertretungsraster[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse-1][this.vertretungsElement.stunde][0]=[];
      }
      if (!this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde][zellenI]) {
        this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde][zellenI] = [];
      }

      this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde][zellenI].push(this.vertretungsElement);


      
    } else {
      console.error("bitte klicke vorher einen Lehrer an");
    }
    this.vertretungsElement = {
      wochentag: null,
      datum: null,
      klasse: null,
      stunde: null,
      lehrer: null,
      fach: null,
      vertretung: null,
      sonderfach: null,
      notiz: null,
      vertretungsLehrer: null
    };
  }
  selbstaendigg(cell) {
    if (this.vertretungsElement.klasse !== null) {
      let zellenI = cell.findIndex(ele => ele.fach == this.vertretungsElement.fach && ele.lehrerKuerz === this.vertretungsElement.lehrer.kuerzel);

      let aktuelleVertret = this.vertretungsSer.vertretung.getValue();
      this.vertretungsElement.vertretung = null;
      this.vertretungsElement.notiz = "Arbeitsauftrag";
      aktuelleVertret.push(this.vertretungsElement); //VERTRETUNG IST UNDEFINED dafür notiz: selbständig
      this.vertretungsSer.vertretung.next(aktuelleVertret);


      if (Number.isInteger(this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde])) {
        this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde] = [];
        //this.vertretungsraster[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse-1][this.vertretungsElement.stunde][0]=[];
      }
      if (!this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde][zellenI]) {
        this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde][zellenI] = [];
      }

      this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde][zellenI].push(this.vertretungsElement);



     
    } else {
      console.error("bitte klicke vorher einen Lehrer an");
    }
    this.vertretungsElement = {
      wochentag: null,
      datum: null,
      klasse: null,
      stunde: null,
      lehrer: null,
      fach: null,
      vertretung: null,
      sonderfach: null,
      notiz: null,
      vertretungsLehrer: null
    };
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


  

  wochentagWahl(x: string) {
    this.wochenTagauswahl = x;
  }

  freieLehrer(r) {

    let freieLehrer: Array < Lehrer > = [];
    let lehrerbesetzt = false;
    this.lehrerService.lehrer.forEach((lehrer, l) => {
      lehrerbesetzt = false;
      if (this.grundPlanfaecher) {
        this.grundPlanfaecher.forEach(element => {
          if (element != null && element.lehrer.length > 0) {
            element.lehrer.forEach(le => {
              element.zuweisung.uebstunde.forEach(zuw => {

                if (le && lehrer && le.kuerzel == lehrer.kuerzel && zuw.stunde == r) {
                  lehrerbesetzt = true;
                }
              });

            });
            // let filter = this.grundPlanfaecher.filter(el => el.klasse == klasse&&el.uebstunde>0);//Alle Elemente der Klasse filtern

          }
        });
      }
      if (lehrerbesetzt == false) {
        freieLehrer.push(lehrer);
      }
    });

    // console.log(freieLehrer);
    return freieLehrer;
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

 


  vertretungsElement: VertretungsElement = {
    wochentag: null,
    datum: null,
    klasse: null,
    stunde: null,
    lehrer: null,
    fach: null,
    vertretung: null,
    sonderfach: null,
    notiz: null,
    vertretungsLehrer: null
  };



  


  hintergrund(el) {
    // console.log(el.sonderfach);
    if (el && (el.fach == Fach.hauptunterricht || el.kollektion == Fach.hauptunterricht)) {
      return "huB";
    } else if (el && (el.fach == Fach.schiene || el.kollektion == Fach.schiene)) {
      return "schB";
    } else if (el && (el.fach == Fach.rhythmisch || el.kollektion == Fach.rhythmisch)) {
      return "rhyB";
    } else {
      return "normalB";
    }
  }

  constructor(public vertretungsSer: VertretungServService, public lehrerService: LehrerService, public login: LoginService, public klassenplanServ: KlassenplaeneService, public epoPlan: EpochenPlaeneService) {
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

    vertretungsSer.vertretung$.subscribe(data => this.vertretung = data);

    this.vertretungsraster = {
      montag: this.login.leerestagesRaster(),
      dienstag: this.login.leerestagesRaster(),
      mittwoch: this.login.leerestagesRaster(),
      donnerstag: this.login.leerestagesRaster(),
      freitag: this.login.leerestagesRaster()
    };

    this.vertretungsraster2 = {
      montag: this.login.leerestagesRaster(),
      dienstag: this.login.leerestagesRaster(),
      mittwoch: this.login.leerestagesRaster(),
      donnerstag: this.login.leerestagesRaster(),
      freitag: this.login.leerestagesRaster()
    };

    this.epoPlan.aktuelleEpo$.subscribe(data => {

      this.esr = data;
    });

  }

  ngOnInit(): void {}

}
