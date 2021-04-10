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
  Gesamtstundenraster
} from 'src/app/interfaces/gesamtstundenraster';
import {
  Lehrer
} from 'src/app/interfaces/lehrer';
import {
  StundenRaster
} from 'src/app/interfaces/stunden-raster';

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


  grundPlanfaecher: Array < Elementt > ; //statt stundenLehrerArray?
  lehrerAuswahl = []; //nur übstundenFilter von grundplanfaecher

  stundenRaster: Gesamtstundenraster;
  wochentage = Wochentag;
  kuerzeleinblenden: boolean;
  buttontext = "einblenden";
  selectLehrer: Lehrer;



  klassen = Object.values(Lehrjahr);

  tabellensortierung(klasse) {

    let lehrerVonKlasse: Array < Elementt > = [];
    //this.klassen.forEach((klas, f) => {
    if (this.grundPlanfaecher) {
      this.grundPlanfaecher.forEach(element => {
        if ((element != null) && (element.klasse == klasse) && (element.uebstunde > 0)) {
          // let filter = this.grundPlanfaecher.filter(el => el.klasse == klasse&&el.uebstunde>0);//Alle Elemente der Klasse filtern
          lehrerVonKlasse.push(element);
        }
      });
    }
    // });
    return lehrerVonKlasse;
  }

  valueLoopinArray(obj) {
    return Object.values(obj);
  }
  keyinArray(obj) {
    return Object.keys(obj);
  }
  wochenTagLoop() {
    return Object.values(Wochentag);
  }

 

  lehrerwahl(lehrerNR) { //Blaumarkierung der gewählten lehrer
    this.selectLehrer = this.lehrerService.lehrer[lehrerNR]; //locale Variable
    let auswahlLehrer=this.lehrerService.lehrer[lehrerNR];
    let neuesRaster = this.login.stundenPlanDaten.getValue();
    Object.values(neuesRaster).forEach((wochenTagsRaster: StundenRaster) => {
      Object.values(wochenTagsRaster).forEach((klassenArray) => {
        klassenArray.forEach(cell => {
          cell.forEach(elementt => {
            elementt.marked=false;
            elementt.lehrer.forEach(le => {
              if((le.kuerzel!=null) &&(auswahlLehrer!=undefined)&&(le.kuerzel==auswahlLehrer.kuerzel)){
                elementt.marked=true;
              }
            });
          });
        });
      });
    });
    this.login.stundenPlanDaten.next(neuesRaster);
  }


  togglezellenClick(tagIndex, zellenArray, stdZ, clickedElementt: Elementt) { //wochentag/ganze Zelle/stunden zeile als Zahl, KLasse ist in Zelle.klasse
    //bei shift-click löschen, sonst hinzufügen

    //Nur wenn Hauptunterricht, epoche und schiene festgelegt wurden: dann nichts ändern
    //  if ((zellenArray[0]) &&
    //   ((zellenArray[0].faecher == Fach.hauptunterricht) ||        (zellenArray[0].faecher == Fach.schiene) ||        (zellenArray[0].faecher == Fach.rhythmisch))) {

    //} else { //nur wenn nicht schiene hu oder rhythmus festgelegt ist:
    //let clickedUnterricht:Unterrichtsstunde={faecher: clickedElementt.fach,klasse: clickedElementt.klasse,lehrer: clickedElementt.lehrer, halbiert: false, drittel: false,marked: false};
    this.stundenRaster[Object.keys(Wochentag)[tagIndex]]["klasse" + clickedElementt.klasse][stdZ].push(clickedElementt);

    // }
  }

  cellKlick(e, r, c, iN) {
    if (e.shiftKey) {
      //Erst zähler hochzählen für vorhandene faecher
      // console.log(this.stundenRaster[Object.keys(Wochentag)[iN]]["klasse" + r][c][0]);
      this.stundenRaster[Object.keys(Wochentag)[iN]]["klasse" + r][c].forEach(unterricht => {
        unterricht.wochenstunden++;
      });
      //  console.log(this.stundenRaster[Object.keys(Wochentag)[iN]]["klasse" + r][c][0]);
      //Bei hauptunterricht, schiene oder rhythmus die lehrer wieder entfernen (nur für klassen über 9)
      if ((r > 8) &&
        ((this.stundenRaster[Object.keys(Wochentag)[iN]]["klasse" + r][c][0].faecher == Fach.hauptunterricht) ||
          (this.stundenRaster[Object.keys(Wochentag)[iN]]["klasse" + r][c][0].faecher == Fach.schiene) ||
          (this.stundenRaster[Object.keys(Wochentag)[iN]]["klasse" + r][c][0].faecher == Fach.rhythmisch))) {
        this.stundenRaster[Object.keys(Wochentag)[iN]]["klasse" + r][c][0].lehrer = []; //lehrerArray leeren
      }

      //sonst: zelle einfach leeren
      this.stundenRaster[Object.keys(Wochentag)[iN]]["klasse" + r][c] = [];

    } else {}
  }

  duplicates(arr, r, c, zellenArray) { //arr ist das gesamtRaster des Tages (mo, die o.Ä.). zellenarray sind alle Stunden der Zelle
    let dupli = 0;
    if (zellenArray[0]) {
      zellenArray.forEach(u => { //im folgenden werden Schiene und HU und Startup herausgenommen:
        u.lehrer.forEach(lehr => {
          let kurz = lehr.kuerzel;
          arr.forEach(kl => {
            if (kl[c] == undefined) {} else { //kl[c] ist eine Celle, hier genügt Position c zu überprüfen (waagerechte duplikate)
              kl[c].forEach(unterricht => { //unterricht sind alle fächer einer zelle/stunde           
                unterricht.lehrer.forEach(lehrt => {
                  if ((lehrt.kuerzel == kurz) && (kurz != null) && (lehrt.kuerzel != null) && (r + 1 != unterricht.klasse)) { //Lehrer darf nicht null sein
                    //wenn beides (feld + vergleichsfeld ausm Raster) HU, Schiene oder startup soll nich rot werden
                    if (
                      ((unterricht.faecher == Fach.hauptunterricht) && (u.faecher == Fach.hauptunterricht)) || ((unterricht.faecher == Fach.schiene) && (u.faecher == Fach.schiene)) ||
                      ((unterricht.faecher == Fach.rhythmisch) && (u.faecher == Fach.rhythmisch))) {} else {
                      dupli++;
                    }
                  }
                });

              });
            }
          });
        });
      });
    }
    //console.log(dupli);

    // return "ok";
    return dupli > 0 ? "error" : "ok";
  }

  duplicateToggle(raster, c, elementt) {
    let dupli = 0;
    let kuerzel = elementt.lehrer.kuerzel;
    raster.forEach(kl => {
      if (kl[c] == undefined) {} else {
        kl[c].forEach(unterricht => {
          unterricht.lehrer.forEach(lehrt => {
            if ((lehrt.kuerzel == kuerzel) && (kuerzel != null) && (lehrt.kuerzel != null)) { //Lehrer darf nicht null sein
              dupli++;
            }
          });
        });
      }
    });


    return dupli > 0 ? "error" : "ok";
  }

  save() {
    this.login.login();
    this.login.saveAll(this.stundenRaster);
    this.login.logout();
  }

  load() {
    this.login.login();
    this.login.gesamtPlanLaden(); //login.stundenplandaten wird neu belegt mit Daten, also observed durch this.stundenRaster ändert sich das dann auch
    this.login.logout();

  }


  neu() {
    this.login.neu();
    //Hu reinschreiben:
    ["montag", "dienstag", "mittwoch", "donnerstag", "freitag"].forEach((tag, t) => {
      [1, 2, 3, 4, 5, 6, 7, 8].forEach(zahl => {
        //this.togglezellenClick(t, [], 0, this.stundenLehrerArray[zahl][this.lehrerService.sort(Fach.hauptunterricht)].find(element => element.faecher[0] == Fach.hauptunterricht));
        //this.togglezellenClick(t, [], 1, this.stundenLehrerArray[zahl][this.lehrerService.sort(Fach.hauptunterricht)].find(element => element.faecher[0] == Fach.hauptunterricht));
      });
      //Hu oberstufe/Epoche:
      [9, 10, 11, 12].forEach(zahl => {
        //this.togglezellenClick(t, [], 1, this.stundenLehrerArray[zahl][this.lehrerService.sort(Fach.hauptunterricht)].find(element => element.faecher[0] == Fach.hauptunterricht));
        //7this.togglezellenClick(t, [], 2, this.stundenLehrerArray[zahl][this.lehrerService.sort(Fach.hauptunterricht)].find(element => element.faecher[0] == Fach.hauptunterricht));
      });
      //rhythmus:
      [9, 10, 11, 12].forEach(zahl => {
        // this.togglezellenClick(t, [], 0, this.stundenLehrerArray[zahl][this.lehrerService.sort(Fach.rhythmisch)].find(element => element.faecher[0] == Fach.rhythmisch));
      });
    });

    //Schiene (erstmal ):
    ["montag", "dienstag", "mittwoch", "donnerstag"].forEach((tag, t) => {
      [9, 10, 11, 12].forEach(zahl => {
        //  this.togglezellenClick(t, [], 4, this.stundenLehrerArray[zahl][this.lehrerService.sort(Fach.schiene)].find(element => element.faecher[0] == Fach.schiene));
        // this.togglezellenClick(t, [], 5, this.stundenLehrerArray[zahl][this.lehrerService.sort(Fach.schiene)].find(element => element.faecher[0] == Fach.schiene));
      });
    });
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
    //console.log(stA);
    //this.rasterAuswahl=this.stundenRaster.montag;

    //  this.stundenLehrerArray = this.lehrerService.stundenLehrerDerKlassen();
    this.kuerzeleinblenden = false;
    //login.stundenLehrerArray$.subscribe((stu)=>this.stundenLehrerArray=stu);


    login.stundenPlanDaten$.subscribe((stundenPlanDaten) => {
      this.stundenRaster = stundenPlanDaten;
      console.log(stundenPlanDaten);
    
    });
    this.klassenplanServ.grundPlanfaecher$.subscribe((data) => this.grundPlanfaecher = data);




    // this.stundenRaster[Object.keys(Wochentag)[tagIndex]]["klasse" + clickedUnterricht.klasse][stdZ].push(clickedUnterricht);
    // lehrerAuswahlListe[klasse.valueOf()][stunde.sort.valueOf()].push(stunde);
  }

  ngOnInit(): void {}

}
