import {
  Injectable
} from '@angular/core';
import {
  differenceInBusinessDays
} from 'date-fns';
import {
  element
} from 'protractor';
import {
  Observable
} from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  take,
  tap,
  timeout
} from 'rxjs/operators';
import {
  Fach
} from '../enums/fach.enum';
import {
  Lehrjahr
} from '../enums/lehrjahr.enum';
import {
  Wochentag
} from '../enums/wochentag.enum';
import {
  Elementt
} from '../interfaces/elementt';
import {
  KlassenplaeneService
} from './klassenplaene.service';

@Injectable({
  providedIn: 'root'
})
export class DeputatrechnerService {
  lehrerListe;

  fach(fach){
    return Fach[fach];
  }

  lehrerArray$: Observable < {
      [key: string]: Elementt[]
    } > =
    this.klassenplan.grundPlanfaecher$.pipe(
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
      return (await this.klassenplan.lehrerListe$.pipe(
          filter(e => e !== null),
          take(1)).toPromise())
        .map(lehr => {
          let lehrerElemente = z[lehr.kuerzel];
          let deputatsArray = {
            kuerzel: lehr.kuerzel,
            epoche: 0,
            rhythmus: 0,
            schiene: 0,
            uebstunde: 0,
            zuweisungen: {
              ueb: [],
              rhy: [],
              epo: [],
              sch: [],
            }
          };
          if (lehrerElemente) {
            //Deputat unterscheidet sich je nach ueb, rhy, epo und sch in der Berechnung

              //Hauptunterricht in klasse 0-7 hinzugefügt bei unterricht wenn kleiner neun.
            let uebElemente = lehrerElemente.filter(elements => (elements.uebstunde > 0) && (elements.fach !== Fach.hauptunterricht||parseInt(elements.klasse)<9) && elements.fach !== Fach.schiene && elements.fach !== Fach.rhythmisch);
            let rhyElemente = lehrerElemente.filter(elements => elements.rhythmus > 0 && elements.fach !== Fach.hauptunterricht && elements.fach !== Fach.schiene && elements.fach !== Fach.rhythmisch); //achtung.  elemente können sowhl übestunden als auch epochen haben
            let epoElemente = lehrerElemente.filter(elements => elements.epoche > 0 && elements.fach !== Fach.hauptunterricht && elements.fach !== Fach.schiene && elements.fach !== Fach.rhythmisch);
            let schElemente = lehrerElemente.filter(elements => elements.schiene > 0 && elements.fach !== Fach.hauptunterricht && elements.fach !== Fach.schiene && elements.fach !== Fach.rhythmisch);

            let uebNeu = [];
            //Merke 1: gleiche Fächer sollen zusammengefasst werden, ein Klassenarray da dann rein.
            //Merke 2: Wahlpflicht etc sonderbehandlung in uebstunde, rhythmus etc
            //Merke 3 : Epochen müssen umgewandelt werden und haben mehrere zuweisungen die auch zusammengefastst werden müssen

            uebElemente.forEach(unterricht => {
              if (!uebNeu[unterricht.fach]) {
                uebNeu[unterricht.fach] = {
                  fach: unterricht.fach,
                  klasse: [unterricht.klasse],
                  stunden: unterricht.zuweisung.uebstunde.length
                }
              } else {
                if (uebNeu[unterricht.fach]) { //Wenn aktuell geprüftes Fach schon vorhanden
                  uebNeu[unterricht.fach].stunden = uebNeu[unterricht.fach].stunden + unterricht.zuweisung.uebstunde.length;
                  uebNeu[unterricht.fach].klasse.push(unterricht.klasse);
                }
              }
            });
            //Wahlpflicht/Chor, Oberstufenorchester, mittelstufenorchester nachbehandlung: 
            if (uebNeu[Fach.wahlpflicht]) {
              uebNeu[Fach.wahlpflicht].stunden = uebNeu[Fach.wahlpflicht].stunden / uebNeu[Fach.wahlpflicht].klasse.length; //Stunden durch die anzahl der klassen teilen
            }
            if (uebNeu[Fach.orchester]) {
              uebNeu[Fach.orchester].stunden = uebNeu[Fach.orchester].stunden / uebNeu[Fach.orchester].klasse.length;
            }
            if (uebNeu[Fach.chor]) {
              uebNeu[Fach.chor].stunden = uebNeu[Fach.chor].stunden / uebNeu[Fach.chor].klasse.length;
            }
            if (uebNeu[Fach.mittelstufenorchester]) {
              uebNeu[Fach.mittelstufenorchester].stunden = uebNeu[Fach.mittelstufenorchester].stunden / uebNeu[Fach.mittelstufenorchester].klasse.length;
            }



            let rhyNeu = [];
            rhyElemente.forEach(unterricht => {
              if (!rhyNeu[unterricht.fach]) {
                let stundi = 0;
                unterricht.zuweisung.rhythmus.forEach(element => {
                  stundi = stundi + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 6; //6 Wochen sind eine rhythmusepoche
                });
                rhyNeu[unterricht.fach] = {
                  fach: unterricht.fach,
                  klasse: [unterricht.klasse],
                  stunden: stundi
                }

              } else {
                if (rhyNeu[unterricht.fach]) { //Wenn aktuell geprüftes Fach schon vorhanden
                  let stundi = 0;
                  unterricht.zuweisung.rhythmus.forEach(element => {
                    stundi = stundi + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 6; //6 Wochen sind eine rhythmusepoche
                  });
                  rhyNeu[unterricht.fach].stunden = rhyNeu[unterricht.fach].stunden + stundi;
                  rhyNeu[unterricht.fach].klasse.push(unterricht.klasse);
                }
              }
            });
            //Wahlpflicht/Chor, Oberstufenorchester, mittelstufenorchester nachbehandlung: 
            if (rhyNeu[Fach.wahlpflicht]) {
              rhyNeu[Fach.wahlpflicht].stunden = rhyNeu[Fach.wahlpflicht].stunden / rhyNeu[Fach.wahlpflicht].klasse.length; //Stunden durch die anzahl der klassen teilen
            }
            if (rhyNeu[Fach.orchester]) {
              rhyNeu[Fach.orchester].stunden = rhyNeu[Fach.orchester].stunden / rhyNeu[Fach.orchester].klasse.length;
            }
            if (rhyNeu[Fach.chor]) {
              rhyNeu[Fach.chor].stunden = rhyNeu[Fach.chor].stunden / rhyNeu[Fach.chor].klasse.length;
            }
            if (rhyNeu[Fach.mittelstufenorchester]) {
              rhyNeu[Fach.mittelstufenorchester].stunden = rhyNeu[Fach.mittelstufenorchester].stunden / rhyNeu[Fach.mittelstufenorchester].klasse.length;
            }



            let epoNeu = [];
            epoElemente.forEach((unterricht: Elementt) => {
              if (epoNeu[unterricht.fach] === undefined) {
                let stundi = 0;

                unterricht.zuweisung.epoche.forEach(element => {

                  stundi = stundi + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 3; //3 Wochen sind eine Epoche
                });
                epoNeu[unterricht.fach] = {
                  fach: unterricht.fach,
                  klasse: [unterricht.klasse],
                  stunden: stundi
                }

              } else {
                if (epoNeu[unterricht.fach] !== undefined) { //Wenn aktuell geprüftes Fach schon vorhanden
                  let stundi = 0;

                  unterricht.zuweisung.epoche.forEach(element => {
                    stundi = stundi + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 3; //6 Wochen sind eine rhythmusepoche

                  });

                  epoNeu[unterricht.fach].stunden = epoNeu[unterricht.fach].stunden + stundi;
                  epoNeu[unterricht.fach].klasse.push(unterricht.klasse);
                }
              }
            });
            //Wahlpflicht/Chor, Oberstufenorchester, mittelstufenorchester nachbehandlung: 
            if (epoNeu[Fach.wahlpflicht]) {
              epoNeu[Fach.wahlpflicht].stunden = epoNeu[Fach.wahlpflicht].stunden / epoNeu[Fach.wahlpflicht].klasse.length; //Stunden durch die anzahl der klassen teilen
            }
            if (epoNeu[Fach.orchester]) {
              epoNeu[Fach.orchester].stunden = epoNeu[Fach.orchester].stunden / epoNeu[Fach.orchester].klasse.length;
            }
            if (epoNeu[Fach.chor]) {
              epoNeu[Fach.chor].stunden = epoNeu[Fach.chor].stunden / epoNeu[Fach.chor].klasse.length;
            }
            if (epoNeu[Fach.mittelstufenorchester]) {
              epoNeu[Fach.mittelstufenorchester].stunden = epoNeu[Fach.mittelstufenorchester].stunden / epoNeu[Fach.mittelstufenorchester].klasse.length;
            }



            let schNeu = [];
            schElemente.forEach(unterricht => {
              if (!schNeu[unterricht.fach]) {
                let stundi = 0;
                unterricht.zuweisung.schiene.forEach(element => {
                  stundi = stundi + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 5; //5 Wochen sind eine Schiene
                });
                schNeu[unterricht.fach] = {
                  fach: unterricht.fach,
                  klasse: [unterricht.klasse],
                  stunden: stundi
                }

              } else {
                if (schNeu[unterricht.fach]) { //Wenn aktuell geprüftes Fach schon vorhanden
                  let stundi = 0;
                  unterricht.zuweisung.schiene.forEach(element => {
                    stundi = stundi + (differenceInBusinessDays(element.ende, element.start) + 1) / 5 / 5; //6 Wochen sind eine rhythmusepoche
                  });
                  schNeu[unterricht.fach].stunden = schNeu[unterricht.fach].stunden + stundi;
                  schNeu[unterricht.fach].klasse.push(unterricht.klasse);
                }
              }
            });
            //Wahlpflicht/Chor, Oberstufenorchester, mittelstufenorchester nachbehandlung: 
            if (schNeu[Fach.wahlpflicht]) {
              schNeu[Fach.wahlpflicht].stunden = schNeu[Fach.wahlpflicht].stunden / schNeu[Fach.wahlpflicht].klasse.length; //Stunden durch die anzahl der klassen teilen
            }
            if (schNeu[Fach.orchester]) {
              schNeu[Fach.orchester].stunden = schNeu[Fach.orchester].stunden / schNeu[Fach.orchester].klasse.length;
            }
            if (schNeu[Fach.chor]) {
              schNeu[Fach.chor].stunden = schNeu[Fach.chor].stunden / schNeu[Fach.chor].klasse.length;
            }
            if (schNeu[Fach.mittelstufenorchester]) {
              schNeu[Fach.mittelstufenorchester].stunden = schNeu[Fach.mittelstufenorchester].stunden / schNeu[Fach.mittelstufenorchester].klasse.length;
            }



            //Gesamt ueb, rhy undsoweiter stunden berechnen:
            lehr.faecher.forEach(fach => {
              if (uebNeu[Fach[fach]]) {
                deputatsArray.uebstunde = deputatsArray.uebstunde + uebNeu[Fach[fach]].stunden;
              }

              if(rhyNeu[Fach[fach]]){
                deputatsArray.rhythmus = deputatsArray.rhythmus + rhyNeu[Fach[fach]].stunden;
              }

              if(epoNeu[Fach[fach]]){
                deputatsArray.epoche = deputatsArray.epoche + epoNeu[Fach[fach]].stunden;
              }
              if(schNeu[Fach[fach]]){
                deputatsArray.schiene = deputatsArray.schiene + schNeu[Fach[fach]].stunden;
              }
            });

          
       






            //


            //Stunden runden (nur im GEsamtzahl, einzelfächer bleiben so?)

            deputatsArray.uebstunde = Math.round(deputatsArray.uebstunde);
            deputatsArray.rhythmus = Math.round(deputatsArray.rhythmus);
            deputatsArray.epoche = Math.round(deputatsArray.epoche);
            deputatsArray.schiene = Math.round(deputatsArray.schiene);
            //deputatsarray-zuweisungen einfügen:
            deputatsArray.zuweisungen.epo = epoNeu;
            deputatsArray.zuweisungen.rhy = rhyNeu;
            deputatsArray.zuweisungen.sch = schNeu;
            deputatsArray.zuweisungen.ueb = uebNeu;

          }

          return deputatsArray;
        });
    }),
    tap(z => {
      // console.log(z);
    })
  );

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



  constructor(public klassenplan: KlassenplaeneService) {
    this.klassenplan.lehrerListe$.subscribe((data) => {
      this.lehrerListe = data
    });
  }
}
