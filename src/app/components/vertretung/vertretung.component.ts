import {
  Component,
  OnInit
} from '@angular/core';
import {
  async
} from 'rxjs';

import {
  map,
  take,
  timeout,
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
  FerientermineService
} from 'src/app/services/ferientermine.service';
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
  esr;

  grundPlanfaecher: Array < Elementt > ; //statt stundenLehrerArray?
  lehrerAuswahl = []; //nur übstundenFilter von grundplanfaecher
  tagesPlan = [];
  // stundenRaster: Gesamtstundenraster;

  wochenTagauswahl: string;

  wochentage = Wochentag;
  kuerzeleinblenden: boolean;
  buttontext = "einblenden";
  selectLehrer: Lehrer;

  vertretungsraster = {};
  vertretungsraster2 = {};

  klassen = Object.values(Lehrjahr);



  //fensterschliessen=false;

  aktuelleEpo$ = this.epoPlan.aktuelleEpo$.pipe(
    map(z => {
      return z;
    })
  );

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

          if (el.lehrer.length === 0) {
            ar[woT.toLowerCase()][std][klasse].push([el.fach, "NN", ""]);
          }

          //wenn lehrer vorhanden
          el.lehrer.forEach(async lehr => {
            //   console.log(el.fach);
            //   console.log(lehr.kuerzel
            //nur einfügen wnen nicht HU in klasse 9-12. Dann nu raktuelle Epoche einfügen....
            if (lehr) {
              if ((el.fach !== "HU" && el.fach !== "Schiene" && el.fach !== "Rhythmus") || parseInt(el.klasse) <= 8) {
                ar[woT.toLowerCase()][std][klasse].push([el.fach, lehr.kuerzel, ""]);
              } else {
                let neu = await this.aktuelleEpo$.pipe(take(1), timeout(200)).toPromise();
                if (neu[this.zahlinKlasse(klasse + 1)]) { //der rhythmus etc muss definiert sein (ist manchmal leer wenn nix eingetragen ist in der epoche)
                  let fac = neu[this.zahlinKlasse(klasse + 1)][this.fachinWort(el.fach)];
               //   console.log(fac);
                  // debugger
                  fac.forEach(unt => {
                    if (unt.lehrerKuerz == lehr.kuerzel) {
                      ar[woT.toLowerCase()][std][klasse].push([unt.fach, lehr.kuerzel,el.fach]);
                    }
                  });


                }

              }
              //bei epoche jez aktuelle einfügen aus $aktuelleEpoche[neun][rhy] usw

            } else {}
          });

        });
      });
  console.log(ar);
      return ar;
    }),

  );

  




  klassenFahrt(arr, zahl) {
    let ele;
    arr.forEach(element => {
      if (element.klasse == zahl.toString()) {
        //console.log(element);
        ele = element;
      }
    });
    return ele ? ele : null;
  }

  klasseInWort(kla) {
    switch (kla) {
      case 1:
        return "eins";
      case 2:
        return "zwei";
      case 3:
        return "drei";
      case 4:
        return "vier";
      case 5:
        return "fuenf";
      case 6:
        return "sechs";
      case 7:
        return "sieben";
      case 8:
        return "acht";
      case 9:
        return "neun";
      case 10:
        return "zehn";
      case 11:
        return "elf";
      case 12:
        return "zwoelf";

    }
  }

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
      case 13:
        return "dreizehn";
    }

  }

  fachinWort(z: string) {
    switch (z) {
      case "HU":
        return "epo";
      case "Schiene":
        return "sch";
      case "Rhythmus":
        return "rhy";
      default:
        return "";
    }
  }

  // esr;


  dupli = [];

  duplicatesss(kuerz, zeile, fachd) { // zeile war vorher nur zeilen-nummer
    //console.log(zeile);
    let duplicates = 0;
    zeile.forEach(cell => {
      cell.forEach(element => {
        //Zeitversetzte oder klassenübergreifende fächer aussschließen!
        if (kuerz === element[1]) {

          duplicates++;

        }
      });
    });
    if(fachd==Fach.mittelstufenorchester){
      duplicates=duplicates-2;
    }else if(fachd==Fach.chor){
      duplicates=duplicates-3;
    }else if(fachd==Fach.orchester){
      duplicates=duplicates-3;
    }else if(fachd==Fach.wahlpflicht){
      duplicates=duplicates-1;
    }

    return duplicates > 1 ? "error" : "ok";

  }

  hintergrundd(el) {
    // console.log(el);

    if (el && el[0]&&el[0][2]) {
      switch (el[0][2]) {
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
    } else if(el&&el[0]){
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
    }
  }
  markedd(lehr) {
    if (lehr && this.selectLehrer && lehr == this.selectLehrer.kuerzel) {
      return "blueback";
    }
  }

  fahrtInKlasse(termine, klassenZahl, planDatumZeit) {
    let titel = "";
    termine.forEach(termin => {


      if (termin.klasse == klassenZahl && termin.start.toDate().getTime() <= planDatumZeit && termin.ende.toDate().getTime() >= planDatumZeit) {
        titel = termin.titel;
      }
    });

    return titel;
  }


  wocheVorher() {

    let speicherDatum = new Date(this.epoPlan.planDatum.getValue().getTime());
    if (speicherDatum.getDay() !== 1) {
      while (speicherDatum.getDay() !== 1) {
        speicherDatum.setDate(speicherDatum.getDate() - 1);
      }
    }
    // console.log(this.epoPlan.planDatum.getValue());
    speicherDatum.setDate(speicherDatum.getDate() - 7);

    this.epoPlan.planDatum.next(new Date(speicherDatum.getTime()));
  }
  wocheNext() {
    let speicherDatum = new Date(this.epoPlan.planDatum.getValue().getTime());

    if (speicherDatum.getDay() !== 1) {
      while (speicherDatum.getDay() !== 1) {
        speicherDatum.setDate(speicherDatum.getDate() - 1);
      }
    }

    speicherDatum.setDate(speicherDatum.getDate() + 7)

    this.epoPlan.planDatum.next(new Date(speicherDatum.getTime()));

  }

  mainClick(){
    //this.fensterschliessen=false;
  }

  cellKlickk(e, c, i, fachKuerz, lehrkuerz,huKuerz) { //c ist zeilennummer, i ist die celle waagerecht!  klassenitems: noch .rhy oder so dann aktuelle epocehn
   // console.log(this.selectLehrer);  
 
          this.vertretungsElement.wochentag = this.wochenTagauswahl;
          //vertretungsElement.datum=element.zuweisung.uebstunde
          this.vertretungsElement.klasse = i;
          this.vertretungsElement.stunde = c; //+1?
          this.vertretungsElement.lehrerKuerz = lehrkuerz;
          this.vertretungsElement.fach = fachKuerz;
          //  this.vertretungsSer.vertretung.push(vertretungsElement);
          //Bei hauptunterricht schiene oder epoche erst aktuelle Epoche finden:
        console.log(this.vertretungsElement);
      
  }

  //Wenn lehrer in der zelle markiert ist




  togglezellenClickk(stdZ, clickedElementt: Elementt, zelle) { //ganze Zelle/stunden zeile als Zahl
    if (this.vertretungsElement.klasse !== null) {
      let zellenI = zelle.findIndex(ele => ele[1] === this.vertretungsElement.lehrerKuerz); //bei epochen muss anderes element genommen werden
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
      console.log(this.vertretungsraster2[this.wochenTagauswahl.toLowerCase()][this.vertretungsElement.klasse - 1][this.vertretungsElement.stunde]);

    } else {
      console.error("bitte klicke vorher einen Lehrer an");
    }
    this.vertretungsElement = {
      wochentag: null,
      datum: null,
      klasse: null,
      stunde: null,
      lehrerKuerz: null,
      fach: null,
      vertretung: null,
      sonderfach: null,
      notiz: null,
      vertretungsLehrer: null,
    };

    //alle fenster schließen
   // this.fensterschliessen=true;
  }


  freieLehrerClickk(lehr, cell) {

    if (this.vertretungsElement.klasse !== null) {
      let zellenI = cell.findIndex(ele => ele[0] == this.vertretungsElement.fach && ele[1] === this.vertretungsElement.lehrerKuerz);
      console.log(zellenI);
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
      lehrerKuerz: null,
      fach: null,
      vertretung: null,
      sonderfach: null,
      notiz: null,
      vertretungsLehrer: null
    };
  }

  freii(cell) {
    if (this.vertretungsElement.klasse !== null) {
      let zellenI = cell.findIndex(ele => ele[0] == this.vertretungsElement.fach && ele[1] === this.vertretungsElement.lehrerKuerz);

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
      lehrerKuerz: null,
      fach: null,
      vertretung: null,
      sonderfach: null,
      notiz: null,
      vertretungsLehrer: null
    };
  }
  selbstaendigg(cell) {
    if (this.vertretungsElement.klasse !== null) {
      let zellenI = cell.findIndex(ele => ele[0] == this.vertretungsElement.fach && ele[1] === this.vertretungsElement.lehrerKuerz);

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
      lehrerKuerz: null,
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

  lehrerListe;
  freieLehrer(r) {

    let freieLehrer: Array < Lehrer > = [];
    let lehrerbesetzt = false;
    this.lehrerListe.forEach((lehrer, l) => {
      lehrerbesetzt = false;
      if (this.grundPlanfaecher) {
        this.grundPlanfaecher.forEach(element => {
       
          if (element != null && element.lehrer.length > 0) {
            element.lehrer.forEach(le => {
              element.zuweisung.uebstunde.forEach(zuw => {

                if (le && lehrer && le.kuerzel == lehrer.kuerzel && zuw.stunde == r&&zuw.wochentag===this.wochenTagauswahl) { //er prüft über alle Tage... also ergänzt nur montag
          //       console.log(zuw.wochentag);
           //      console.log(this.wochenTagauswahl)
                  lehrerbesetzt = true;
               //   console.log(lehrer.kuerzel);
               //   console.log(element);
           //       console.log(r);
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




  /**
   *  let lehrerRhyKlas =  this.klassenS.lehrerArray$.pipe(  map(z => {
                      let ar = [];
                      if (lehra.kuerzel !== null) {
                        z[lehra.kuerzel].forEach(ele => {
                          if (ele.rhythmus > 0) {
                            ar.push(ele);
                          }
                        });
                      }

                      return ar;
                    }), take(10), toArray());
   async
   */

  duplicateToggle(zeile, ele) { //umändern, dass nur aktuelle Lehrer die auch in epoche/Schiene drin sind am Datum zu error führen
     let duplicates = 0;
     let tag = this.wochenTagauswahl;
     // let raster =   await this.gesamtRaster$.pipe(take(1),timeout(200)).toPromise();
    // console.log(zeile);
     zeile.forEach(cell => {
       cell.forEach((element, e) => {
         //elemente aus Togle haben nen ganzes lehrerarray:
         ele.lehrer.forEach(lehr => {
           if (element[1] == lehr.kuerzel) {
             //CHECK vorher! Bei Epoche, schiene und HU nur error, wenn Lehrer AKTUELL DRIN IST
             duplicates++;
           }
         });
       });
     });
     return duplicates > 0 ? "error" : "ok";

  }



  vertretungsElement: VertretungsElement = {
    wochentag: null,
    datum: null,
    klasse: null,
    stunde: null,
    lehrerKuerz: null,
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

  constructor(
    public vertretungsSer: VertretungServService,
    public lehrerService: LehrerService,
    public login: LoginService,
    public klassenplanServ: KlassenplaeneService,
    public epoPlan: EpochenPlaeneService,
    public feriTermServ: FerientermineService) {
    //this.wochenTagauswahl="Montag";
    this.wochenTagauswahl = lehrerService.wochenTagSelect;

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
    klassenplanServ.lehrerListe$.subscribe(data => {
      this.lehrerListe = data;
    })



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
