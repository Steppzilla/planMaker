import {
  Component,
  OnInit
} from '@angular/core';
import {
  differenceInBusinessDays,
} from 'date-fns';
import {
  Fach
} from 'src/app/enums/fach.enum';
import {
  Lehrer
} from 'src/app/interfaces/lehrer';
import { DeputatrechnerService } from 'src/app/services/deputatrechner.service';
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

  faecher = Object.keys(Fach).sort();
  aufgaben = ["Schulführung", "Vorstand", "Pädagogische Leitung", "Geschäftsführer"];



  // Fach dem Lehrer hinzufügen:
  fachLehrerAdd(fach, lehrer) {
    let faecher = lehrer.faecher;
    faecher.push(fach);
    this.loginServ.lehrerHinzufuegen({
      anrede: lehrer.anrede,
      name: lehrer.name,
      kuerzel: lehrer.kuerzel,
      faecher: faecher,
      aufgaben: []
    })

  }
  lehrerAdd(anrede, name, kuerzel, faecher, aufgaben, deputat) {
    console.log(anrede);
    console.log(name);
    console.log(kuerzel);
    this.loginServ.lehrerHinzufuegen({
      anrede: anrede,
      name: name,
      kuerzel: kuerzel,
      faecher: [],
      aufgaben: []
    })
  }
  lehrerLoeschen(kuerz) {
    this.loginServ.lehrerLoeschen(kuerz);
  }

  

  klassenReturn(lehrer: Lehrer, fach: Fach) {

    let neuArray = this.klassenplan.grundPlanfaecher.getValue();
    let elemente = [];
    neuArray.forEach(element => {
      if (element == null) {} else {
        element.lehrer.forEach(lehr => {
          if (lehrer.kuerzel == null) {} else
          if (lehr != null) {
            if (lehr.kuerzel == lehrer.kuerzel && fach == element.fach) {
              elemente.push(element.klasse);
            }
          }

        });

      }
    });
    return elemente;
  }

  loeschen(e, lehrer) {//aufgaben löschen
    let kuerzel=lehrer.kuerzel;
    let faecher=lehrer.faecher;

    if (faecher.length > 0&&faecher!=null&&faecher!=undefined) {
      console.log(kuerzel +"FACH:" + faecher);
      faecher.forEach(fach => {
        if (e.shiftKey) {
          this.loginServ.lehrerAufgabenHinzufuegen(kuerzel, fach) //das löscht die fächer und macht faecher=[]

        }
      });
    }


  }

  loeschenClick(e, lehrer) {//aufgaben löschen per Click
    let kuerzel=lehrer.kuerzel;
    let faecher=lehrer.faecher;

    if (faecher.length > 0&&faecher!=null&&faecher!=undefined) {
      console.log(kuerzel +"FACH:" + faecher);
      faecher.forEach(fach => {
          this.loginServ.lehrerAufgabenHinzufuegen(kuerzel, fach) //das löscht die fächer und macht faecher=[] 
      });
    }
  }



  constructor(public deputatServ:DeputatrechnerService, public lehrerServ: LehrerService, public klassenplan: KlassenplaeneService, public loginServ: LoginService) {

  }

  ngOnInit(): void {}

}
