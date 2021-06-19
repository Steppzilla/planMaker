import {
  Component,
  OnInit
} from '@angular/core';
import { Fach } from 'src/app/enums/fach.enum';
import {
  Lehrer
} from 'src/app/interfaces/lehrer';
import {
  KlassenplaeneService
} from 'src/app/services/klassenplaene.service';
import {
  LehrerService
} from 'src/app/services/lehrer.service';


@Component({
  selector: 'app-lehrer-liste',
  templateUrl: './lehrer-liste.component.html',
  styleUrls: ['./lehrer-liste.component.scss']
})
export class LehrerListeComponent implements OnInit {

  klassenReturn(lehrer: Lehrer) {
    let neuArray = this.klassenplan.grundPlanfaecher.getValue();
    let elemente = [];
    neuArray.forEach(element => {
      if (element == null) {} else {
        element.lehrer.forEach(lehr => {
          if(lehr!=null){
          if (lehr.kuerzel == lehrer.kuerzel&&((element.fach!=Fach.hauptunterricht&&element.fach!=Fach.schiene&&element.fach!=Fach.rhythmisch)||(parseInt(element.klasse)<9))) {
            elemente.push(element);
          }
        }

        });
      }
    });
//console.log(elemente);
    return elemente;



  }
  constructor(public lehrerServ: LehrerService, public klassenplan: KlassenplaeneService) {


  }

  ngOnInit(): void {}

}
