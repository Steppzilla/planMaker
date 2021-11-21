import {
  Component,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  take,
  tap
} from 'rxjs/operators';
import {
  PausenZeit
} from 'src/app/enums/pausen-zeit.enum';
import {
  PausenaufsichtsOrte
} from 'src/app/enums/pausenaufsichts-orte.enum';
import {
  Wochentag
} from 'src/app/enums/wochentag.enum';
import { Elementt } from 'src/app/interfaces/elementt';
import {
  PausenItem
} from 'src/app/interfaces/pausen-item';
import {
  EpochenPlaeneService
} from 'src/app/services/epochen-plaene.service';
import {
  KlassenplaeneService
} from 'src/app/services/klassenplaene.service';
import {
  LehrerService
} from 'src/app/services/lehrer.service';

@Component({
  selector: 'app-pausenplan',
  templateUrl: './pausenplan.component.html',
  styleUrls: ['./pausenplan.component.scss']
})
export class PausenplanComponent implements OnInit {
  lehrerListe;
  orte = Object.values(PausenaufsichtsOrte);
  zeiten = Object.values(PausenZeit);

  tage = Object.values(Wochentag);

  grundPlanfaecher;
  kuerzeleingeblendet=true;

  namenKuerzelToggle(){
    if(this.kuerzeleingeblendet===true){
      this.kuerzeleingeblendet=false;
    }else{
      this.kuerzeleingeblendet=true;
    }
  }

//fü rdas Toggle-menü die Auswahl der Lehrer, die für die pausen vorgeschlagen werden:
  lehrerAuswahl$ = this.klassenplanServ.grundPlanfaecher$.pipe( //Bei Änderungen im Plan updaten

    map(z => {
      let ar = new Array(4).fill(null).map(x => new Array(5));
      z.forEach(el => {
        el.zuweisung.uebstunde.forEach(zuw => {
          //  ["Montag", "Dienstag", "Mittwoch", "Donnerstag"].forEach(wochenTag=>{
          let std = zuw.stunde + 1;
          let woT = zuw.wochentag;
          let klasse = parseInt(el.klasse);

          el.lehrer.forEach(lehr => {
            if (!ar[0][this.wochenTaginZahl(woT)]) {
              ar[0][this.wochenTaginZahl(woT)] = [];
            }
            if (!ar[1][this.wochenTaginZahl(woT)]) {
              ar[1][this.wochenTaginZahl(woT)] = [];
            }
            if (!ar[2][this.wochenTaginZahl(woT)]) {
              ar[2][this.wochenTaginZahl(woT)] = [];
            }
            if (!ar[3][this.wochenTaginZahl(woT)]) {
              ar[3][this.wochenTaginZahl(woT)] = [];
            }


            let treffer = 0;
            if (ar[0][this.wochenTaginZahl(woT)].length > 0) {
              ar[0][this.wochenTaginZahl(woT)].forEach(element => {
                if (element.kuerzel === lehr.kuerzel) {
                  treffer = treffer + 1;
                }
              });
            }
            if (treffer > 0) {
              //nicht pushen
            } else { 
              ar[0][this.wochenTaginZahl(woT)].push(lehr);
            }

            treffer = 0;
            if (ar[1][this.wochenTaginZahl(woT)].length > 0) {
              ar[1][this.wochenTaginZahl(woT)].forEach(element => {
                if (element.kuerzel === lehr.kuerzel) {
                  treffer = treffer + 1;
                }
              });
            }
            if (treffer > 0) {
              //nicht pushen
            } else { 
              ar[1][this.wochenTaginZahl(woT)].push(lehr);
            }
            treffer = 0;
            if (ar[2][this.wochenTaginZahl(woT)].length > 0) {
              ar[2][this.wochenTaginZahl(woT)].forEach(element => {
                if (element.kuerzel === lehr.kuerzel) {
                  treffer = treffer + 1;
                }
              });
            }
            if (treffer > 0) {
              //nicht pushen
            } else { 
              ar[2][this.wochenTaginZahl(woT)].push(lehr);
            }
            treffer = 0;
            if (ar[3][this.wochenTaginZahl(woT)].length > 0) {
              ar[3][this.wochenTaginZahl(woT)].forEach(element => {
                if (element.kuerzel === lehr.kuerzel) {
                  treffer = treffer + 1;
                }
              });
            }
            if (treffer > 0) {
              //nicht pushen
            } else { 
              ar[3][this.wochenTaginZahl(woT)].push(lehr);
            }
 

          });

        /*  if ((std == 1) && ((klasse < 9)||klasse==13)) {
            el.lehrer.forEach(lehr => {
              if (!ar[0][this.wochenTaginZahl(woT)]) {
                ar[0][this.wochenTaginZahl(woT)] = [];
              }
              let treffer = 0;
              if (ar[0][this.wochenTaginZahl(woT)].length > 0) {
                ar[0][this.wochenTaginZahl(woT)].forEach(element => {
                  if (element.kuerzel === lehr.kuerzel) {
                    treffer = treffer + 1;
                  }

                });
              }
              if (treffer > 0) {
                //nicht pushen
              } else {
                ar[0][this.wochenTaginZahl(woT)].push(lehr);
              }
            });
          }
          if ( //Unterstufenpause
            ((std == 1 || std == 4) && (klasse <= 12) && (klasse >= 9)) ||
            ((std == 1 || std == 2 || std == 3 || std == 4) && ((klasse >= 12) || (klasse <= 9)))) {
            el.lehrer.forEach(lehr => {
              if (!ar[1][this.wochenTaginZahl(woT)]) {
                ar[1][this.wochenTaginZahl(woT)] = [];
              }
              let treffer = 0;
              if (ar[1][this.wochenTaginZahl(woT)].length > 0) {
                ar[1][this.wochenTaginZahl(woT)].forEach(element => {
                  if (element.kuerzel === lehr.kuerzel) {
                    treffer = treffer + 1;
                  }

                });
              }
              if (treffer > 0) {
                //nicht pushen
              } else {
                ar[1][this.wochenTaginZahl(woT)].push(lehr);
              }
            });
          }

          if ( //oberstufenpause
            ((std == 3 || std == 4) && (klasse <= 12) && (klasse >= 9)) //oberstufe 3 ode r4
            ||
            ((std == 2 || std == 4) && ((klasse >= 12) || (klasse <= 9))) //unterstufe nicht dritte stunde haben darf
          ) {
            el.lehrer.forEach(lehr => {
              if (!ar[2][this.wochenTaginZahl(woT)]) {
                ar[2][this.wochenTaginZahl(woT)] = [];
              }
              let treffer = 0;
              if (ar[2][this.wochenTaginZahl(woT)].length > 0) {
                ar[2][this.wochenTaginZahl(woT)].forEach(element => {
                  if (element.kuerzel === lehr.kuerzel) {
                    treffer = treffer + 1;
                  }

                });
              }
              if (treffer > 0) {
                //nicht pushen
              } else {
                ar[2][this.wochenTaginZahl(woT)].push(lehr);
              }
            });

          }


          if ( //2. pause
            ((std == 4 || std == 5) ) //egal welche klasse 4. oder 5. stunde
          ) {
            el.lehrer.forEach(lehr => {
              if (!ar[3][this.wochenTaginZahl(woT)]) {
                ar[3][this.wochenTaginZahl(woT)] = [];
              }
              let treffer = 0;
              if (ar[3][this.wochenTaginZahl(woT)].length > 0) {
                ar[3][this.wochenTaginZahl(woT)].forEach(element => {
                  if (element.kuerzel === lehr.kuerzel) {
                    treffer = treffer + 1;
                  }

                });
              }
              if (treffer > 0) {
                //nicht pushen
              } else {
                ar[3][this.wochenTaginZahl(woT)].push(lehr);
              }
            });

          }  */
        });
      
      });

      console.log(ar);

   
      return ar;

    })
  )



  wochenTaginZahl(wot) {
    switch (wot) {
      case "Montag":
        return 0;
      case "Dienstag":
        return 1;
      case "Mittwoch":
        return 2;
      case "Donnerstag":
        return 3;
      case "Freitag":
        return 4;
      case "Samstag":
        return 5;
      case "Sonntag":
        return 6;
    }
  }

  lehrereinfuegen(e,tag, ort, zeit,lehrer) {
    if(e.shiftKey){
      this.lehrerloeschen(tag, ort, zeit,lehrer);
    }else{
    let ar = this.epochenplanServ.pausenPlan.getValue();
   // let lehr = kuerz; //HIER MUSS DER LEHRER AUSGEWÄHLT WERDEN MIT DEM KUERZEL oben
     ar.push({
        lehrer: lehrer,
        pausenZeit: zeit,
        ort: ort,
        wochentag: tag
      })
    console.log(ar);


    
    this.epochenplanServ.pausenPlan.next(ar);
    }

  }

lehrerloeschen(tag, ort, zeit,lehrer){
  let ar = this.epochenplanServ.pausenPlan.getValue();
  // let lehr = kuerz; //HIER MUSS DER LEHRER AUSGEWÄHLT WERDEN MIT DEM KUERZEL oben
    let eleIndex=ar.findIndex(element=>element.lehrer.kuerzel==lehrer.kuerzel&&element.pausenZeit==zeit&&element.ort===ort&&element.wochentag==tag);
    ar.splice(eleIndex,1);
   console.log(ar);
   this.epochenplanServ.pausenPlan.next(ar);

}

anzahlAufsichten(lehrer){
  let ar = this.epochenplanServ.pausenPlan.getValue().filter(ele=>ele.lehrer.kuerzel==lehrer.kuerzel);

  return ar.length;
}

  pausenRaster$ = this.epochenplanServ.pausenPlan$.pipe( //Bei Änderungen im Plan updaten
    map(z => {
      let ar = {
        montag: [],
        dienstag: [],
        mittwoch: [],
        donnerstag: [],
        freitag: []
      };
      if (z !== null) {

        z.forEach((el: PausenItem) => {
          if (!ar[el.wochentag.toLowerCase()][this.zeitinString(el.pausenZeit)]) {
            ar[el.wochentag.toLowerCase()][this.zeitinString(el.pausenZeit)] = [];
          }
          if (!ar[el.wochentag.toLowerCase()][this.zeitinString(el.pausenZeit)][el.ort]) {
            ar[el.wochentag.toLowerCase()][this.zeitinString(el.pausenZeit)][el.ort] = [];
          }
          ar[el.wochentag.toLowerCase()][this.zeitinString(el.pausenZeit)][el.ort].push(el.lehrer);
        });
      }
      // console.log(ar);
      return ar;
    })
  );


  
  lehrerArray$: Observable < {
    [key: string]: Elementt[]
  } > =
  this.klassenplanServ.grundPlanfaecher$.pipe(
    filter(r => r !== null),
    map(x => {
      let obj: {
        [key: string]: Elementt[]
      } = {};
      x.forEach((ele: Elementt) => {
        ele.lehrer.forEach(le => {
          if (obj[le.kuerzel] === undefined) {
            obj[le.kuerzel] = [];
          }
          obj[le.kuerzel].push(ele);
        });
      });
      return obj;
    }));

alleLehrer$ = this.lehrerArray$.pipe(

  //ASYNC HACK!!!
  mergeMap(async z => {
    //   let ar = new Array();
    return (await this.klassenplanServ.lehrerListe$.pipe(
        filter(e => e !== null),
        take(1)).toPromise())
      .slice(0, this.lehrerListe.length).map(gg => {
        let lehrerElemente = z[gg.kuerzel];
        let wochenPlan = new Array(11).fill(null).map(g =>
          new Array(5).fill(null).map(() => ({
            fach: null,
            klasse: []
          }))
        );
        if (lehrerElemente !== undefined) {
          lehrerElemente.forEach(element => {
            element.zuweisung.uebstunde.forEach(zuweisung => {
              if (wochenPlan[zuweisung.stunde][this.tagInZahl(zuweisung.wochentag)].fach === null) {
                wochenPlan[zuweisung.stunde][this.tagInZahl(zuweisung.wochentag)].fach = element.fach;
              }
              wochenPlan[zuweisung.stunde][this.tagInZahl(zuweisung.wochentag)].klasse.push(element.klasse);
            });
          });
        }
        return {
          kuerzel: gg.kuerzel,
          planB: wochenPlan,
          //  planB:
        }
      });
  }),
  tap(z => {
    // console.log(z);
  })
);

  zeitinString(zeit) {

    //console.log(zeit);
    if (zeit === "7:45-8:00") {
      return "eins"
    } else if (zeit === "9:35-9:55") {
      return "zwei"
    } else
    if (zeit === "10:25-10:45") {
      return "drei"
    } else
    if (zeit === "11:30-11:45") {
      return "vier"
    }
  }

  tagInZahl(wochent: string) {
    switch (wochent) {
      case Wochentag.montag:
        return 0;
      case Wochentag.dienstag:
        return 1;
      case Wochentag.mittwoch:
        return 2;
      case Wochentag.donnerstag:
        return 3;
      case Wochentag.freitag:
        return 4;
    }
  }
  constructor(public epochenplanServ: EpochenPlaeneService, public lehrerServ: LehrerService, 
    public klassenplanServ: KlassenplaeneService) {
    this.klassenplanServ.grundPlanfaecher$.subscribe((data) => {
      this.grundPlanfaecher = data;
      //  console.log(data);
    });
    this.klassenplanServ.lehrerListe$.subscribe((data) => {
      this.lehrerListe = data
    });

  }

  ngOnInit(): void {}

}
