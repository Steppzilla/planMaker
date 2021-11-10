import {
  Injectable
} from '@angular/core';
import {
  differenceInBusinessDays
} from 'date-fns';
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
            kuerzel:lehr.kuerzel,
            epoche: 0,
            rhythmus: 0,
            schiene: 0,
            uebstunde: 0,
            zuweisungen: {ueb:[],rhy:[],epo:[],sch:[]}
          };
          if(lehrerElemente){
          lehrerElemente.forEach(unterricht => {
            
            if (((unterricht.fach != Fach.hauptunterricht && unterricht.fach != Fach.schiene && unterricht.fach != Fach.rhythmisch && parseInt(unterricht.klasse) > 8) || parseInt(unterricht.klasse) <= 8)) {
              //Problem sind hier noch Klassenübergreifende Fächer wie Wahlpflicht, Chor und MSO
              deputatsArray.uebstunde = deputatsArray.uebstunde + unterricht.zuweisung.uebstunde.length;
              deputatsArray.zuweisungen.ueb.push({fach:unterricht.fach, klasse: unterricht.klasse, stunden: unterricht.uebstunde});
              // rhy=  rhy+ element.zuweisung.rhythmus.length;
              if (unterricht.rhythmus > 0) {
                unterricht.zuweisung.rhythmus.forEach(epochElement => {
                  deputatsArray.rhythmus = deputatsArray.rhythmus - differenceInBusinessDays(epochElement.start, epochElement.ende) + 1; //Durch 6, da im Rhythmus 6 Wochen eine Epoche sind, später, da sonst zu viele kommazahlen gerunden werden
                  deputatsArray.zuweisungen.rhy.push({fach:unterricht.fach, klasse: unterricht.klasse,stunden: unterricht.rhythmus});
                });
              }
              if (unterricht.epoche > 0) {

                //  epo=epo+element.zuweisung.epoche.length;
                unterricht.zuweisung.epoche.forEach(epochElement => {
                  deputatsArray.epoche = deputatsArray.epoche - differenceInBusinessDays(epochElement.start, epochElement.ende) + 1; //Durch 3, da in Epoche 3 Wochen eine Epoche sind
                  deputatsArray.zuweisungen.epo.push({fach:unterricht.fach, klasse: unterricht.klasse,stunden: unterricht.epoche});
                });
              }
              if (unterricht.schiene > 0) {
                unterricht.zuweisung.schiene.forEach(epochElement => {
                  deputatsArray.schiene = deputatsArray.schiene - differenceInBusinessDays(epochElement.start, epochElement.ende) + 1; //Durch 5, da im Rhythmus 5 Wochen eine Epoche sind (6 Stundne pro Woche)
                  deputatsArray.zuweisungen.sch.push({fach:unterricht.fach, klasse: unterricht.klasse,stunden: unterricht.schiene});
                });
              }
            }
          });
        }
          //Runden und ggf teilen:
          deputatsArray.rhythmus = Math.round(deputatsArray.rhythmus / 5 / 6);
          deputatsArray.epoche = Math.round(deputatsArray.epoche / 5 / 3);
          //if (lehrer.kuerzel == "Wo") {
          //  console.log(Math.round(sch / 5 / 5));
          //}
          deputatsArray.schiene = Math.round(deputatsArray.schiene / 5 / 5);

          ["ueb","rhy","sch","epo"].forEach(esrU=>{
            let zuweisungsARrayNEU=[]
            let wahlpflichtstunden=0;
            let chorstunden=0;
            let oberstufenOrchester=0;
            let mittelstufenOrchester=0;

            deputatsArray.zuweisungen[esrU].forEach(element => {
              if(element.fach!==Fach.wahlpflicht&&element.fach!==Fach.chor&&element.fach!==Fach.orchester&&element.fach!==Fach.mittelstufenorchester){
                zuweisungsARrayNEU.push(element);
              }else{ //wahlpflicht, chor, orchester oder mso:
               //Elemente in eins zusammenfassen und stunden verrechnen in zuweisung und überliegend
               switch(element.fach){
                 case Fach.wahlpflicht: wahlpflichtstunden=wahlpflichtstunden+element.stunden; break;
                 case Fach.chor: chorstunden=chorstunden+element.stunden;break;
                 case Fach.orchester: oberstufenOrchester=oberstufenOrchester+element.stunden;break;
                 case Fach.mittelstufenorchester: mittelstufenOrchester=mittelstufenOrchester+element.stunden;break;
               }
              }
            });
            //alle nicht obig genannten fächer sind drin, letztere zufügen:
            if(wahlpflichtstunden>0){
              zuweisungsARrayNEU.push({fach:Fach.wahlpflicht, klasse: null,stunden: wahlpflichtstunden/2}); //durch 2 geteilt, da in zwei klassen
              deputatsArray
            }
            if(chorstunden>0){
              zuweisungsARrayNEU.push({fach:Fach.chor, klasse: null,stunden: chorstunden/4}); //chorstunden in 4 klassen
            }
            if(oberstufenOrchester>0){
              zuweisungsARrayNEU.push({fach:Fach.orchester, klasse: null,stunden: oberstufenOrchester/4}); //in 4 klassen
            }
            if(mittelstufenOrchester>0){
              zuweisungsARrayNEU.push({fach:Fach.mittelstufenorchester, klasse: null,stunden: mittelstufenOrchester/2}); //in 2 klassen
            }
            deputatsArray.zuweisungen[esrU]=zuweisungsARrayNEU;
            //deputatszahlen aktualisieren:
            let zaehler=0;
            deputatsArray.zuweisungen[esrU].forEach(element => {
              zaehler=zaehler+ element.stunden;
            });
            switch(esrU){
              case "ueb": deputatsArray.uebstunde=zaehler;break;
              case "rhy": deputatsArray.rhythmus=zaehler;break;
              case "epo": deputatsArray.epoche=zaehler;break;
              case "sch": deputatsArray.schiene=zaehler;break;
            }
            
            
            
           
          });

          
     
//Zuweisungen müssen noch angepasst werden, gleiche Fächer zusammengefasst werden und gegengerchnet.
         
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
