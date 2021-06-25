import {
  Component,
  OnInit
} from '@angular/core';
import { Fach } from 'src/app/enums/fach.enum';
import {
  EpochenPlaeneService
} from 'src/app/services/epochen-plaene.service';
import {
  FerientermineService
} from 'src/app/services/ferientermine.service';
import { KlassenplaeneService } from 'src/app/services/klassenplaene.service';
import {
  LehrerService
} from 'src/app/services/lehrer.service';

@Component({
  selector: 'app-einzelplan',
  templateUrl: './einzelplan.component.html',
  styleUrls: ['./einzelplan.component.scss']
})
export class EinzelplanComponent implements OnInit {
  gewaehlterLehrer;
  esrPlan;

  grundPlanfaecher;
  

  lehrerItems(lehrer){
    let hi=this.grundPlanfaecher.filter(el=>el.rhythmus>=1||el.epoche>=1||el.schiene>=1);  //Hu selbst z.b hat kein rhythmisch-wert! fällt also hier raus
    let ar=[];
    let bo=false;
    hi.forEach(element => {//Nur noch lehrer items rausfiltern:
        bo=false;
        element.lehrer.forEach(lehr => {
          if(lehr.kuerzel==lehrer.kuerzel)
          {bo=true;          }
        });
        if(bo==true){
          ar.push(element);
        }     
    });
  //  console.log(ar);
    return ar;
  }

  constructor( public klassenplanServ: KlassenplaeneService, public ferienServ: FerientermineService, epochenPlanS: EpochenPlaeneService, lehrerServ: LehrerService) {
    lehrerServ.lehrerSelected$.subscribe(data => {
      this.gewaehlterLehrer = data;
    });

    epochenPlanS.esr_plan$.subscribe((data) => {
      this.esrPlan = data;
    });

    this.klassenplanServ.grundPlanfaecher$.subscribe((data) => this.grundPlanfaecher = data);
  }

  ngOnInit(): void {}

}
