import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { Fach } from 'src/app/enums/fach.enum';
import { Wochentag } from 'src/app/enums/wochentag.enum';
import { Elementt } from 'src/app/interfaces/elementt';
import { EpochenPlaeneService } from 'src/app/services/epochen-plaene.service';
import { KlassenplaeneService } from 'src/app/services/klassenplaene.service';

@Component({
  selector: 'app-mittagsplan',
  templateUrl: './mittagsplan.component.html',
  styleUrls: ['./mittagsplan.component.scss']
})
export class MittagsplanComponent implements OnInit {

  lehrerListe;

  $plan=this.epochenPlanServ.mittagsPlan$.pipe(
    map(
      z=>{
        let ar={

        }
        return z;
      }
    )
  );

  kuerzeleingeblendet=true;

  namenKuerzelToggle(){
    if(this.kuerzeleingeblendet===true){
      this.kuerzeleingeblendet=false;
      console.log("F");
    }else{
      this.kuerzeleingeblendet=true;
      console.log("T");
    }
  }

  inInt(zahl){
    return parseInt(zahl);
  }



  mittagsplan$=this.klassenplanServ.grundPlanfaecher$.pipe( //Bei Änderungen im Plan updaten
    map(z => {
      let newElemets=z.filter(element=>element.fach===Fach.mittag&&parseInt(element.klasse)<=8);
    //  console.log(newElemets);
      newElemets=newElemets.sort((n1,n2)=>parseInt(n1.klasse)-parseInt(n2.klasse));
      return newElemets;
    })
  );

lehrereinfuegen($event, wot,klasse,stunde,lehrer){
  console.log(lehrer);

  let ar=this.klassenplanServ.grundPlanfaecher.getValue();
let neu=[];
ar.forEach(elem=>{
  if(elem.fach==Fach.mittag){
  elem.zuweisung.uebstunde.forEach(item=>{
  
    if(item.stunde==stunde&&item.wochentag==wot&&elem.klasse==klasse&&(elem.fach===Fach.mittag)){
      item.lehrer=lehrer;
      console.log(elem);
    }
  });
}

  this.klassenplanServ.grundPlanfaecher.next(ar);
});



}

lehrerloeschen(e, wot,klasse,stunde,lehrer){
  if(e.shiftKey){
    console.log(stunde);

    let ar=this.klassenplanServ.grundPlanfaecher.getValue();
  let neu=[];
  ar.forEach(elem=>{
    if(elem.fach==Fach.mittag){
    elem.zuweisung.uebstunde.forEach(item=>{
    
      if(item.stunde==stunde&&item.wochentag==wot&&elem.klasse==klasse&&elem.fach===Fach.mittag){
        item.lehrer=null;
        console.log(elem);
      }
    });
  }
  
    this.klassenplanServ.grundPlanfaecher.next(ar);
  });
  
    
  }

}

filter(wot, lehrerEle){
  let ar=[];
  lehrerEle.forEach(element => {
    element.zuweisung.uebstunde.forEach(item => {
      if (item.wochentag==wot){
        ar.push(element);
      }
      
    });
    
  });

}

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
      filter(e=>e!==null),
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
        lehrer: gg,
        planB: wochenPlan,
        //  planB:
      }
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

  constructor(public klassenplanServ:KlassenplaeneService, public epochenPlanServ:EpochenPlaeneService) { 


    this.klassenplanServ.lehrerListe$.subscribe((data) => {
      this.lehrerListe = data
    });
  }

  ngOnInit(): void {
  }

}
