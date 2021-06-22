import {
  Component,
  OnInit
} from '@angular/core';
import {
  Lehrer
} from 'src/app/interfaces/lehrer';
import { FerientermineService } from 'src/app/services/ferientermine.service';
import {
  KlassenplaeneService
} from 'src/app/services/klassenplaene.service';
import { LehrerService } from 'src/app/services/lehrer.service';
import {
  GesamtuebersichtComponent
} from '../gesamtuebersicht.component';

@Component({
  selector: 'app-stundenplan',
  templateUrl: './stundenplan.component.html',
  styleUrls: ['./stundenplan.component.scss']
})
export class StundenplanComponent implements OnInit {

  gewaehlterLehrer: Lehrer;
  grundFaecher;

  breite=new Array(5);
  hoehe=new Array(11);


  zellenElemente(woTa, std){
    let neu=[];
    this.lehrerElemente().forEach(element => {
      if(element){
      element.zuweisung.uebstunde.forEach(wotStd => {
      if(wotStd.wochentag.slice(0,2).toUpperCase()==this.ferienServ.zahlZuString(woTa).toUpperCase()&&wotStd.stunde==std){
        neu.push(element);
      }

      //"ele&&ele.wochentag.slice(0,2).toUpperCase()== ferienServ.zahlZuString(woTa).toUpperCase()&&ele.stunde==std"
    });
  }
    });
    return  neu;

  }

  lehrerElemente = () => {
    let liste = this.grundFaecher.filter(function (el) {
      return el != null
    });
    let neu=[];
    liste.forEach(element => {
      element.lehrer.forEach(leh => {
        if(leh!=null&&leh.kuerzel==this.gewaehlterLehrer.kuerzel){
          neu.push(element);
        }
      });
    });
   
    

    //=>(ele!=null&&ele.lehrer.kuerzel==this.gewaehlterLehrer.kuerzel));



    return neu;
  }
  constructor(klassenS: KlassenplaeneService, public ferienServ: FerientermineService,lehrerServ:LehrerService) {

    lehrerServ.lehrerSelected$.subscribe(data => {
      this.gewaehlterLehrer = data;
    });
    klassenS.grundPlanfaecher$.subscribe(data => this.grundFaecher = data);


  }

  ngOnInit(): void {}

}
