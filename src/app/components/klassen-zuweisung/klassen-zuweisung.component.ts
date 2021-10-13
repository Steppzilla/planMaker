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
import {
  filter,
  map,
} from 'rxjs/operators';
import {
  Observable
} from 'rxjs';



@Component({
  selector: 'app-klassen-zuweisung',
  templateUrl: './klassen-zuweisung.component.html',
  styleUrls: ['./klassen-zuweisung.component.scss']
})
export class KlassenZuweisungComponent implements OnInit {
  //keys=Object.keys;
  faecher = Object.values(Fach);
  faecherKeys = Object.keys(Fach);
  klassen = Object.values(Lehrjahr);
  grundPlanfaecher;
  selectLehrer;

  lehrerListe;

  gewaehlteKlasse = 10;
  printAktiv = false;

  lehrerArray$: Observable < {
      [key: string]: {}
    } > =
    this.klassenplanServ.grundPlanfaecher$.pipe(
      filter(r => r !== null),
      map(x => {
        let obj: {
          [key: string]: Elementt[]
        } = {};
        x.forEach((ele: Elementt) => {
          if(ele!==null){
          ele.lehrer.forEach(le => {
            if (obj[le.kuerzel] === undefined) {
              obj[le.kuerzel] = [];
            }
            obj[le.kuerzel].push(ele);
          });
        }
        });
        ///obj enthält alle lehrerElemente-> soll: [ueb, rhy, epo, sch] - anzahl der stunden nun rein:
        let neuObj: {
          [key: string]: {}
        } = {};
        if (this.lehrerListe) {
          let lehrer = this.lehrerListe.slice(0, this.lehrerListe.length);
          lehrer.forEach(le => {
            if (obj[le.kuerzel]) {
              let neu = {
                ueb: 0,
                sch: 0,
                epo: 0,
                rhy: 0
              };
              obj[le.kuerzel].forEach(ele => {
           //     if(ele.lehrer[0].kuerzel==="Wo"){
            //      console.log(ele);
             //   }
                //HU und alle sammelbehälter nicht doppelt zählen:
                if ((ele.fach !== Fach.hauptunterricht && ele.fach !== Fach.rhythmisch && ele.fach !== Fach.schiene)||(ele.fach!=="HU"&&ele.fach!=="StartUp"&&ele.fach!=="Schiene")) {
                  neu.ueb = neu.ueb + ele.uebstunde;
                  neu.sch = neu.sch + ele.schiene;
                  neu.rhy = neu.rhy + ele.rhythmus;
                  neu.epo =  neu.epo+ele.epoche;
               }else{ //Wenn HU dann nix
             //   neu.sch = neu.sch + ele.schiene;
             //   neu.rhy = neu.rhy + ele.rhythmus;
              //  neu.epo=neu.epo+ele.epoche;

                }
              });
              if (neuObj[le.kuerzel] === undefined) {
                neuObj[le.kuerzel] = neu;
              }
            }

          });
        }

        return neuObj;
      }));


      classPrintAktiv(klasse){
        switch(klasse){
          case "esrButtonContainer": if(this.printAktiv){return 'esrPrintAktiv'}else{return klasse};
          case "lehrerkuerzelBox": if(this.printAktiv){return 'lehrerkuerzelPrintAktiv'}else{return klasse};
        }
      }

  klasseWaehlen(zahl) {
    if (zahl === 14) {
      this.gewaehlteKlasse = 1;
    } else if (zahl === 0) {
      this.gewaehlteKlasse = 13;
    } else {
      this.gewaehlteKlasse = zahl;
    }

  }

  marked(lehr) {
    if (lehr && this.selectLehrer && lehr.kuerzel == this.selectLehrer.kuerzel && lehr.kuerzel !== null) {
      return "blueback";
    } else if (lehr.kuerzel === null) {
      return "";
    }
  }

  print() {
    this.printAktiv = true;
  }

  loeschen(fa, kl) {
    this.klassenplanServ.elementLoeschen(fa, kl);
  }


  mainButtonClick(e, ele) {
    if (e.shiftKey) {
      this.klassenplanServ.elementeZuruecksetzen(ele.fach, ele.klasse);
    }
    ele.lehrer.push([]);

  }
  wochenstundenVerteilen(e, art, elementDerZeile, kIndex) {
    //  console.log(elementDerZeile);
    elementDerZeile.forEach(element => {
      
    
    if (element.klasse == kIndex) {
      switch (art) {
        case "ueb":
          if ((e.shiftKey) && (element.uebstunde > 0)) {
            element.uebstunde--;
          } else {
            element.uebstunde++;
          }
       //   this.epocheSchieneRhythmusBefuellen();
          break;
        case "rhythmus":
          if ((e.shiftKey) && (element.rhythmus > 0)) {
            element.rhythmus--;
          } else {
            element.rhythmus++;
            //Lehrer in rhythmus hinzufügen?
          }
         // this.epocheSchieneRhythmusBefuellen();
          break;
        case "epoche":
          if ((e.shiftKey) && (element.epoche > 0)) {
            element.epoche--;
          } else {
            element.epoche++;
            //Lehrer in epoche hinzufügen?
          }
         // this.epocheSchieneRhythmusBefuellen();
          break;
        case "schiene":
          if ((e.shiftKey) && (element.schiene > 0)) {
            element.schiene--;
          } else {
            element.schiene++;
            //Lehrer in schiene hinzufügen?
          }
         // this.epocheSchieneRhythmusBefuellen(); //für gesamtplan, damit der im HU gezählt wird
          break;
      }
    }
  });
  console.log()
  }

  lehrerHinzufuegen(lehrerI: Lehrer, klasseI: Lehrjahr, fachI: Fach) {
    let neuesEle: boolean;
    let neuArray: Array < Elementt >= this.klassenplanServ.grundPlanfaecher.getValue();

    neuArray.forEach(obj => {
      if (obj != null) {
        if (obj.fach == fachI) {
          //  console.log(obj.fach + " / " + obj.klasse + "/" + obj.lehrer[0] + "kuerzel: " + obj.lehrer[0].kuerzel);
          //  console.log(fachI + "/ " + klasseI + "/ ");
          //  console.table( obj.lehrer);
        }
        if ((obj.fach == fachI) && (obj.klasse == klasseI) && (obj.lehrer[0] === undefined)) {
          //  console.log("L. hinzugefügt, kein neues Element");
          //Lehrer null rauschemeißen
          obj.lehrer = [];
          obj.lehrer.push(lehrerI);
          neuesEle = false;
        } else if ((obj.fach == fachI) && (obj.klasse == klasseI)) {
          //  console.log("neues Element hinzufügen");
          neuesEle = true;
        } else {
          //   console.log("das Element entspricht nicht dem angeklickten");
        }
      }
    });

    //wenn ein Lehrer schon drin is, neues Element erstellen mit Lehrer drin.
    if (neuesEle == true) {
      this.klassenplanServ.elementHinzufuegenmitLehrer(fachI, klasseI, lehrerI);
    } else {
      this.klassenplanServ.grundPlanfaecher.next(neuArray);
    }
  }

  wortInZahl(wort) {
    switch (wort) {
      case 'neun':
        return 9;
      case 'zehn':
        return 10;
      case 'elf':
        return 11;
      case 'zwoelf':
        return 12;
    }
  }

  toggleClick(lehrer: Lehrer, fach: Fach, klasse: Lehrjahr) {
    this.lehrerHinzufuegen(lehrer, klasse, fach);
  }



  esrFuellen(esr, fach, klasse) { //geht nur von neun bis zwölf
    let klassenElemente = this.grundPlanfaecher.filter((element) => (element != null && element.klasse == klasse)); //Alle klasse 9 zb.
    let hu = klassenElemente.filter(element => element[esr] >= 1); //esr muss epoche schiene oder rhythmus sein //Alle mit z.b.epochenzuweisung
    let fachDerKlasse = hu.filter(element => element.klasse == klasse);
    let lehrermerker = [];
    let bo = true;

    this.grundPlanfaecher.forEach((element, e) => {
      if (element != null) {
        if (parseInt(element.klasse) == parseInt(klasse) && element.fach == fach) { //erst: 9. klasse Hauptunterricht
          element.lehrer = [];
          fachDerKlasse.forEach(el => {
            bo = true;
            //doppelte rauskicken
            if (lehrermerker.length >= 1) {
              lehrermerker.forEach(le => {
                if (le != undefined && el.lehrer[0] != undefined && le.kuerzel == el.lehrer[0].kuerzel) {
                  bo = false;
                }
              });
            }
            //reinschreiben
            if (el.lehrer[0] && bo == true) {
              lehrermerker.push(el.lehrer[0]);
              element.lehrer.push(el.lehrer[0]);
            }
          });
        }
      }
    });
  }
/*
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
  }*/



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




  lehrerNachFach$ = this.klassenplanServ.lehrerListe$.pipe(
    map(z => {
      let ar = new Object;
      z.forEach(obj => {
        obj.faecher.forEach(fach => {
          Object.keys(Fach).forEach((fachh, f) => {
            if (!ar[this.faecher[f]]) {
              ar[this.faecher[f]] = [];
            }
            if (fach == fachh) {
              ar[this.faecher[f]].push(obj);
            }
          });
        });
      });

      console.log(ar);

      return ar;
    })
  );

  /*  rhythmusElemente$ = this.klassenplanServ.esrPlaan$.pipe(
    concatMap(b => {
      return this.klassenplanServ.esrPlaan$.pipe(take(1));
    }),
    map(z => {
      let obj = {
        neun: z.rhythmus.neun,
        zehn: z.rhythmus.zehn,
        elf: z.rhythmus.elf,
        zwoelf: z.rhythmus.zwoelf
      }
      return obj;
    })
  );*/

  mainClickk(e, ele) {
    if (e.shiftKey) {
      this.klassenplanServ.elementeZuruecksetzen(ele.fach, ele.klasse);
    }

  }

  toggleClickk(lehrer: Lehrer, fach: Fach, klasse: Lehrjahr) {
    this.lehrerHinzufuegen(lehrer, klasse, fach);
  }


  wochenstundenVerteilenn(e, art, zelle, kIndex) {
    //  console.log(elementDerZeile);
    if (zelle[0].klasse == kIndex) {
      switch (art) {
        case "ueb":
          if ((e.shiftKey) && (zelle[0].uebstunde > 0)) {
            zelle.forEach(element => {
              
              element.uebstunde=0;
              
            });
          } else {
            zelle.forEach(element => {
              element.uebstunde++;
            });
          }
        //  this.epocheSchieneRhythmusBefuellen();
          break;
        case "rhythmus":
          if ((e.shiftKey) && (zelle[0].rhythmus > 0)) {
            zelle.forEach(element => {
              element.rhythmus=0;
            });
          } else {
            zelle.forEach(element => {
              element.rhythmus++;
            });
            //Lehrer in rhythmus hinzufügen?
          }
        //  this.epocheSchieneRhythmusBefuellen();
          break;
        case "epoche":
          if ((e.shiftKey) && (zelle[0].epoche > 0)) {
            zelle.forEach(element => {
              element.epoche=0;
            });
          } else {
            zelle.forEach(element => {
              element.epoche++;
            });
            //Lehrer in epoche hinzufügen?
          }
       //   this.epocheSchieneRhythmusBefuellen();
          break;
        case "schiene":
          if ((e.shiftKey) && (zelle[0].schiene > 0)) {
            zelle.forEach(element => {
              element.schiene=0;
            });
          } else {
            zelle.forEach(element => {
              element.schiene++;
            });
            //Lehrer in schiene hinzufügen?
          }
       //   this.epocheSchieneRhythmusBefuellen(); //für gesamtplan, damit der im HU gezählt wird
          break;
      }
    }
  }


  fachElemente$ = this.klassenplanServ.grundPlanfaecher$.pipe(
    map(z => {

      let ar = new Array(Object.values(Fach).length).fill(null).map(z => new Array(Object.values(Lehrjahr).length).fill(null));
      //  console.log(ar);
      z.forEach((element) => {
        if(element!==null){
        //  console.log(element);
        let fachIndex = -1;
        let klaIndex = parseInt(element.klasse) - 1;

        Object.values(Fach).forEach((facH, e) => {

          if (element !== null && element.fach.toString() === facH) {
            fachIndex = e;
          }
        });


        if (fachIndex !== -1) {
          if (!ar[fachIndex][klaIndex]) {
            ar[fachIndex][klaIndex] = [];
          }

          ar[fachIndex][klaIndex].push(element);
        }

      }

      });

      return ar;
    })
  );

  rhythmusElemente$ = this.klassenplanServ.esrPlaan$.pipe(
    map(z => {
      let obj = {
        neun: z.rhythmus.neun,
        zehn: z.rhythmus.zehn,
        elf: z.rhythmus.elf,
        zwoelf: z.rhythmus.zwoelf
      }
      return obj;
    })
  );

  epochenElemente$ = this.klassenplanServ.esrPlaan$.pipe(
    map(z => {
      let obj = {
        neun: z.epoche.neun,
        zehn: z.epoche.zehn,
        elf: z.epoche.elf,
        zwoelf: z.epoche.zwoelf
      }
      return obj;
    })
  );

  schieneElemente$ = this.klassenplanServ.esrPlaan$.pipe(
    map(z => {
      let obj = {
        neun: z.schiene.neun,
        zehn: z.schiene.zehn,
        elf: z.schiene.elf,
        zwoelf: z.schiene.zwoelf
      }
      return obj;
    })
  );


  zahlInWort(zahl) {
    switch (zahl) {
      case Lehrjahr.neun:
        return "neun";
      case Lehrjahr.zehn:
        return "zehn";
      case Lehrjahr.elf:
        return "elf";
      case Lehrjahr.zwoelf:
        return "zwoelf";
      default:
        console.log("kein Lehrjahr für die Epoche erkannt");
    }
  }



  rechner(klasse) {
    let klassenElemente = this.grundPlanfaecher.filter((element) => (element != null && element.klasse == klasse)); //Alle klasse 9 zb.
    let uebstunden = klassenElemente.filter((element) => (element != null && element.uebstunde > 0));
    let rhythmus = klassenElemente.filter((element) => (element != null && element.rhythmus > 0));
    let epoche = klassenElemente.filter((element) => (element != null && element.epoche > 0));
    let schiene = klassenElemente.filter((element) => (element != null && element.schiene > 0));

    let zaehlUeb = 0;
    let zaehlR = 0;
    let zaehlE = 0;
    let zaehlS = 0;

    Object.values(Fach).forEach(fach => {
      let fachItems = uebstunden.filter(eles => (eles.fach == fach));
      if (fachItems.length > 0) {
        zaehlUeb = zaehlUeb + fachItems[0].uebstunde;
      }
      fachItems = rhythmus.filter(eles => (eles.fach == fach));
      if (fachItems.length > 0) {
        zaehlR = zaehlR + fachItems[0].rhythmus;
      }

      fachItems = epoche.filter(eles => (eles.fach == fach));
      if (fachItems.length > 0) {
        zaehlE = zaehlE + fachItems[0].epoche;
      }

      fachItems = schiene.filter(eles => (eles.fach == fach));
      if (fachItems.length > 0) {
        zaehlS = zaehlS + fachItems[0].schiene;
      }
    });

    return [zaehlUeb, zaehlR, zaehlE, zaehlS];
  }


  farbeUESR(ures, zahl) {
    switch (ures) {
      case "uebstunde":
        if (zahl > 0) {
          return "ueb";
        } else {
          return "nix"
        }
        case "rhythmus":
          if (zahl > 0) {
            return "rhy";
          } else {
            return "nix"
          }
          case "epoche":
            if (zahl > 0) {
              return "epo";
            } else {
              return "nix"
            }
            case "schiene":
              if (zahl > 0) {
                return "sch";
              } else {
                return "nix"
              }


    }

  }


  constructor(public lehrerServ: LehrerService, public klassenFaecherServ: KlassenFaecherService,
    public klassenplanServ: KlassenplaeneService) {


    this.klassenplanServ.grundPlanfaecher$.subscribe((data) => {
      this.grundPlanfaecher = data;
      // console.table(data)
    });


    // console.log(this.grundPlanfaecher);
    //  this.klassenplanServ.elementHinzufuegen(Fach.wirtschaftspolitik,Lehrjahr.dreizehn);
    //console.log(this.klassenplanServ.grundPlanfaecher.getValue());

    lehrerServ.lehrerSelected$.subscribe(data => {
      this.selectLehrer = data;
    });


    this.klassenplanServ.lehrerListe$.subscribe((data) => {
      this.lehrerListe = data
    });
  }





  ngOnInit(): void {}

}
