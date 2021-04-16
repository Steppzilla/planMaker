import {
  Component,
  OnInit
} from '@angular/core';
import {
  Lehrer
} from 'src/app/interfaces/lehrer';
import {
  KlassenplaeneService
} from 'src/app/services/klassenplaene.service';
import {
  LehrerService
} from 'src/app/services/lehrer.service';
import {
  LoginService
} from 'src/app/services/login.service';

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
          if (lehr.kuerzel == lehrer.kuerzel) {
            elemente.push(element);
          }

        });
      }
    });
console.log(elemente);
    return elemente;



  }
  constructor(public lehrerServ: LehrerService, public klassenplan: KlassenplaeneService) {


  }

  ngOnInit(): void {}

}
