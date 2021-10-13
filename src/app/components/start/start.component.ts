import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Fach } from 'src/app/enums/fach.enum';
import { Elementt } from 'src/app/interfaces/elementt';
import {
  FerientermineService
} from 'src/app/services/ferientermine.service';
import { KlassenplaeneService } from 'src/app/services/klassenplaene.service';
import {
  LehrerService
} from 'src/app/services/lehrer.service';
import {
  LoginService
} from 'src/app/services/login.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  speicherPlatzNr;
  lehrerListe;


  wahl(zahl) {
    this.speicherPlatzNr = zahl;
  }


  toggleColor() {

  }

  redirect(x: string) {
    this.router.navigate([x]);
    this.lehrer.gewaehlterPlan = x;
  //  console.log(x);
   // console.log(this.lehrer.gewaehlterPlan);
  }

  save() {
    this.login.saveAll(this.speicherPlatzNr)
    console.log("save?");
  }

  load() {
    this.login.gesamtPlanLaden(this.speicherPlatzNr); //login.stundenplandaten wird neu belegt mit Daten, also observed durch this.stundenRaster ändert sich das dann auch
  }

  lehrerwahl(lehrerNR) { //Blaumarkierung der gewählten lehrer
    //  this.selectLehrer = this.lehrerService.lehrer[lehrerNR]; //locale Variable
    this.lehrer.lehrerSelected.next(this.lehrerListe[lehrerNR]);
  }

  lehrerArray$: Observable < {
    [key: string]: {}
  } > =
  this.klassenPlanServ.grundPlanfaecher$.pipe(
    filter(r => r !== null),
    map(x => {
      let obj: {
        [key: string]: Elementt[]
      } = {};
      x.forEach((ele: Elementt) => {
        if(ele!==null){
        ele.lehrer.forEach(le => {
          if (obj[le.kuerzel] === undefined) {
            obj[le.kuerzel] = [];
          }
          obj[le.kuerzel].push(ele);
        });
      }
      });
    
      ///obj enthält alle lehrerElemente-> soll: [ueb, rhy, epo, sch] - anzahl der stunden nun rein:
      let neuObj: {
        [key: string]: {}
      } = {};
      if (this.lehrerListe) {
        let lehrer = this.lehrerListe.slice(0, this.lehrerListe.length);
        lehrer.forEach(le => {
          if (obj[le.kuerzel]) {
            let neu = {
              ueb: 0,
              sch: 0,
              epo: 0,
              rhy: 0
            };
            obj[le.kuerzel].forEach(ele => {
         //     if(ele.lehrer[0].kuerzel==="Wo"){
          //      console.log(ele);
           //   }
              //HU und alle sammelbehälter nicht doppelt zählen:
              if ((ele.fach !== Fach.hauptunterricht && ele.fach !== Fach.rhythmisch && ele.fach !== Fach.schiene)||(ele.fach!=="HU"&&ele.fach!=="StartUp"&&ele.fach!=="Schiene")) {
                neu.ueb = neu.ueb + ele.uebstunde;
                neu.sch = neu.sch + ele.schiene;
                neu.rhy = neu.rhy + ele.rhythmus;
                neu.epo =  neu.epo+ele.epoche;
             }else{ //Wenn HU dann nix
           //   neu.sch = neu.sch + ele.schiene;
           //   neu.rhy = neu.rhy + ele.rhythmus;
            //  neu.epo=neu.epo+ele.epoche;

              }
            });
            if (neuObj[le.kuerzel] === undefined) {
              neuObj[le.kuerzel] = neu;
            }
          }

        });
      }

      return neuObj;
    }));


  




  constructor(public lehrer: LehrerService, public login: LoginService, public router: Router, public termine: FerientermineService,public klassenPlanServ:KlassenplaeneService) {
    this.login.login();
    this.login.gesamtPlanLaden(5);
    this.speicherPlatzNr = 5;
    this.klassenPlanServ.lehrerListe$.subscribe(data => {
      this.lehrerListe=data;
    });
    
    login.lehrerladen();
    //console.log(this.lehrerListe);
    this.login.termineladen();
  }

  ngOnInit(): void {}

}
