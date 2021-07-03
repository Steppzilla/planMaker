import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  concatMap,
  filter,
  map,
  take,
  tap,
  timeout,
} from 'rxjs/operators';
import {
  Wochentag
} from 'src/app/enums/wochentag.enum';
import {
  Lehrer
} from 'src/app/interfaces/lehrer';
import {
  FerientermineService
} from 'src/app/services/ferientermine.service';
import {
  KlassenplaeneService
} from 'src/app/services/klassenplaene.service';
import {
  LehrerService
} from 'src/app/services/lehrer.service';


@Component({
  selector: 'app-stundenplan',
  templateUrl: './stundenplan.component.html',
  styleUrls: ['./stundenplan.component.scss']
})
export class StundenplanComponent implements OnInit {





  printAktiv = false;

  show() {
    this.printAktiv = true;
  }






  gewaehlterLehrer: Lehrer;
  grundFaecher;

  breite = new Array(5);
  hoehe = new Array(11);


  alleLehrer$ = this.klassenS.lehrerArray$.pipe(
  
    //tap(lkj => console.log(lkj)),
    map(z => {
   //   let ar = new Array();

      return this.lehrerServ.lehrer.map(gg => {
        let lehrerElemente = z[gg.kuerzel];

        let wochenPlan = new Array(11).fill(null).map(g =>
          new Array(5).fill(null).map(() => ({
            fach: null,
            klasse: []
          }))
        );

        if(lehrerElemente!==undefined){
        lehrerElemente.forEach(element => {
          element.zuweisung.uebstunde.forEach(zuweisung=>{
            if(wochenPlan[zuweisung.stunde][this.tagInZahl(zuweisung.wochentag)].fach===null){
              wochenPlan[zuweisung.stunde][this.tagInZahl(zuweisung.wochentag)].fach=element.fach;
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
    tap(z=>{console.log (z);})
    
    );



  lehrerItems$ = this.lehrerServ.lehrerSelected$.pipe(
    filter(f => f.kuerzel !== null),
    concatMap(lehrSel => {
      return this.klassenS.lehrerArray$.pipe(
        take(1),
        map(l => l[lehrSel.kuerzel])
      ).toPromise();
    }),
    map(z => {
      let ar = new Array(11).fill(null).map(x => new Array(5));
      if (!!z) {
        z.forEach(el => {
          el.zuweisung.uebstunde.forEach(zuw => {
            if (ar[zuw.stunde][this.tagInZahl(zuw.wochentag)] === undefined) {
              ar[zuw.stunde][this.tagInZahl(zuw.wochentag)] = {
                fach: el.fach,
                klasse: []
              }
            }
            ar[zuw.stunde][this.tagInZahl(zuw.wochentag)].klasse.push(el.klasse);
          });
        });
      }
      return ar;
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


  constructor(private klassenS: KlassenplaeneService, public ferienServ: FerientermineService, private lehrerServ: LehrerService) {




    lehrerServ.lehrerSelected$.subscribe(data => {
      this.gewaehlterLehrer = data;
    });
    klassenS.grundPlanfaecher$.subscribe(data => this.grundFaecher = data);


  }

  ngOnInit(): void {}

}
