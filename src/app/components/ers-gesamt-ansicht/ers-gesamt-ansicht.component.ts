import { Component, OnInit } from '@angular/core';
import { addDays } from 'date-fns';
import { concatMap, map, take } from 'rxjs/operators';
import { Elementt } from 'src/app/interfaces/elementt';
import { TagesObjekt } from 'src/app/interfaces/tages-objekt';
import { EpochenPlaeneService } from 'src/app/services/epochen-plaene.service';
import { FerientermineService } from 'src/app/services/ferientermine.service';
import { KlassenplaeneService } from 'src/app/services/klassenplaene.service';
import { LehrerService } from 'src/app/services/lehrer.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-ers-gesamt-ansicht',
  templateUrl: './ers-gesamt-ansicht.component.html',
  styleUrls: ['./ers-gesamt-ansicht.component.scss']
})
export class ERSGesamtAnsichtComponent implements OnInit {
  grundPlanfaecher: Array < Elementt > ;
  selectLehrer;

  esrPlan: Array < Array < TagesObjekt >> ;

  einblenden=false;;
counti=0;
  kuerzeleinblenden(){
    if(this.counti%2==0){
    this.einblenden=true;
    }else{this.einblenden=false;}
this.counti++;
  }
  kuerzen(text){
    return text.slice(0,5);
  }

  tagimAbschnitt(ele, date, plan) {
    let zaehler = 0;
    ele.zuweisung[plan].forEach(epoche => {
      if (epoche.start <= date && epoche.ende >= date) {
        zaehler++;
      }
    });
    return zaehler >= 1 ? ele : null;
    // console.log(ele.zuweisung.rhythmus);
    // console.log(date); //definiert, datum!
  }

  breite(klassenItems, tag, zeilenIndex, esrLang, abschnitt) {
    //console.log(abschnitt);

    let enddate = abschnitt[abschnitt.length - 1].tag;
    let breite = 1;
    let items = klassenItems.filter(element => (element.zuweisung[esrLang].length > 0));
    let item = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= tag && ele.ende >= tag) != -1);
    let item2 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 7) && ele.ende >= addDays(tag, 7)) != -1);
    let item3 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 14) && ele.ende >= addDays(tag, 14)) != -1);
    let item4 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 21) && ele.ende >= addDays(tag, 21)) != -1);
    let item5 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 28) && ele.ende >= addDays(tag, 28)) != -1);
    let item6 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 35) && ele.ende >= addDays(tag, 35)) != -1);
    let item7 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 42) && ele.ende >= addDays(tag, 42)) != -1);
    let item8 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 49) && ele.ende >= addDays(tag, 49)) != -1);
    let item9 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 56) && ele.ende >= addDays(tag, 56)) != -1);
    let item10 = klassenItems.filter(element => element.zuweisung[esrLang].findIndex(ele => ele.start <= addDays(tag, 63) && ele.ende >= addDays(tag, 63)) != -1);


    if (this.equals(item, item2) && addDays(tag, 7) <= enddate) {
      // console.log("isgleich");
      breite = 2;

      if (addDays(tag, 14) <= enddate && this.equals(item2, item3)) { //und keine fahrt in der zeit
        breite = 3;
        if (addDays(tag, 21) <= enddate && this.equals(item3, item4)) {
          breite = 4;
          if (addDays(tag, 28) <= enddate && this.equals(item4, item5)) {
            breite = 5;
            if (addDays(tag, 35) <= enddate && this.equals(item5, item6)) {
              breite = 6;
              if (addDays(tag, 42) <= enddate && this.equals(item6, item7)) {
                breite = 7;
                if (addDays(tag, 49) <= enddate && this.equals(item7, item8)) {
                  breite = 8;
                  if (addDays(tag, 56) <= enddate && this.equals(item8, item9)) {
                    breite = 9;
                    if (addDays(tag, 63) <= enddate && this.equals(item9, item10)) {
                      breite = 10;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {}
    // console.log(breite);
    return breite;
  }

  equals(cell1, cell2) {
    //  console.log(cell1); 
    //console.log
    let counter = 0;
    if (cell1.length != 0 && cell1.length == cell2.length) {
      cell1.forEach(unterricht => {
        cell2.forEach(u => {
          if (unterricht.lehrer[0].kuerzel == u.lehrer[0].kuerzel && unterricht.fach == u.fach) {
            counter++;
          }
        });
      });
    }

    return counter >= cell2.length && counter != 0 ? true : false;
  }



  klassenFahrtBreite(abschnitt, box, klasseZahl, i) {
    let tag = box.tag;
    let start = abschnitt[i];
    let breite = 1;
    //console.log(abschnitt);
    if (abschnitt[i+7]&&abschnitt[i + 7].tag<abschnitt[abschnitt.length-1].tag
      &&this.klassenFahrt(abschnitt[i+7].fahrten, klasseZahl)!==null
      &&this.klassenFahrt(abschnitt[i].fahrten, klasseZahl).titel == this.klassenFahrt(abschnitt[i + 7].fahrten, klasseZahl).titel) {
  //    console.log("Gleich");
      breite++;
      if(abschnitt[i+14]&&abschnitt[i + 14].tag<abschnitt[abschnitt.length-1].tag&&this.klassenFahrt(abschnitt[i+14].fahrten, klasseZahl)!==null&&this.klassenFahrt(abschnitt[i].fahrten, klasseZahl).titel == this.klassenFahrt(abschnitt[i + 14].fahrten, klasseZahl).titel) {
        breite++;
        if(abschnitt[i+21]&&abschnitt[i + 21].tag<abschnitt[abschnitt.length-1].tag&&this.klassenFahrt(abschnitt[i+21].fahrten, klasseZahl)!==null&&this.klassenFahrt(abschnitt[i].fahrten, klasseZahl).titel == this.klassenFahrt(abschnitt[i + 21].fahrten, klasseZahl).titel) {
          breite++;
          if(abschnitt[i+28]&&abschnitt[i + 28].tag<abschnitt[abschnitt.length-1].tag&&this.klassenFahrt(abschnitt[i+28].fahrten, klasseZahl)!==null&&this.klassenFahrt(abschnitt[i].fahrten, klasseZahl).titel == this.klassenFahrt(abschnitt[i + 28].fahrten, klasseZahl).titel) {
            breite++;
          }
        }
      }
    }
    return breite;
  }

  besondererTag(tag) {
    switch (true) {
      case tag.ferien.length != 0:
        return "ferien";
      case tag.pruefungen.length != 0:
        return "pruefung";
      default:
        return "";
    }
  }
  wochenTag(day) {
    switch (day) {
      case 0:
        return "So";
      case 1:
        return "Mo";
      case 2:
        return "Di";
      case 3:
        return "Mi";
      case 4:
        return "Do";
      case 5:
        return "Fr";
      case 6:
        return "Sa";
    }
  }
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
  rhythmusElemente$ = this.klassenplanServ.esrPlaan$.pipe(
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
  );

  epochenElemente$ = this.klassenplanServ.esrPlaan$.pipe(
    concatMap(b => {
      return this.klassenplanServ.esrPlaan$.pipe(take(1));
    }),
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
    concatMap(b => {
      return this.klassenplanServ.esrPlaan$.pipe(take(1));
    }),
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

  constructor(public epochenPlanS: EpochenPlaeneService,
    public ferienServ: FerientermineService, public klassenplanServ: KlassenplaeneService,
    public lehrerServ: LehrerService, public loginServ: LoginService) { 


      this.epochenPlanS.esr_plan$.subscribe((data: Array < Array < TagesObjekt >> ) => {

        this.esrPlan = data;
        // console.log(data);
  
      });
      this.klassenplanServ.grundPlanfaecher$.subscribe((data) => this.grundPlanfaecher = data);
  
      lehrerServ.lehrerSelected$.subscribe(data => {
        this.selectLehrer = data;
      });
    }

  ngOnInit(): void {
  }

}
