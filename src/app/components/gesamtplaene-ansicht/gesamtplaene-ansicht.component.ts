import {
  Component,
  OnInit
} from '@angular/core';
import { map } from 'rxjs/operators';
import { Fach } from 'src/app/enums/fach.enum';
import { Elementt } from 'src/app/interfaces/elementt';
import { Lehrer } from 'src/app/interfaces/lehrer';
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
  selector: 'app-gesamtplaene-ansicht',
  templateUrl: './gesamtplaene-ansicht.component.html',
  styleUrls: ['./gesamtplaene-ansicht.component.scss']
})
export class GesamtplaeneAnsichtComponent implements OnInit {

  grundPlanfaecher: Array < Elementt > ; //statt stundenLehrerArray?

  selectLehrer: Lehrer;
  
  tabellensortierung(klasse) {
    let lehrerVonKlasse: Array < Elementt > = [];
    if (this.grundPlanfaecher) {
      this.grundPlanfaecher.forEach(element => {
        if ((element != null) && (element.klasse == klasse) && (element.uebstunde > 0)) {
          // let filter = this.grundPlanfaecher.filter(el => el.klasse == klasse&&el.uebstunde>0);//Alle Elemente der Klasse filtern
          lehrerVonKlasse.push(element);
        }
      });
    }
    return lehrerVonKlasse;
  }
  klassengesamtstunden(kla) {
    let elementederKlasse = this.tabellensortierung(kla);
    let zaehler = 0;
    // console.log(elementederKlasse);
    //console.log(Object.values(Fach));

    let faecher = Object.values(Fach);
    faecher.forEach(fach => {
      //  console.log(fach);

      let fachItems = elementederKlasse.filter(eles => (eles.fach == fach));
      //  console.log(fachItems);
      if (fachItems.length > 0) {
        // console.log(" Kl. " +fachItems[0].klasse + " " + fachItems[0].fach+  " : " + fachItems[0].uebstunde);
        zaehler = zaehler + fachItems[0].uebstunde;
      }
      //   

    });
    return zaehler;
  }


  gesamtRaster$ = this.klassenplanServ.grundPlanfaecher$.pipe( //Bei Änderungen im Plan updaten

    map(z => {
      let ar = {
        montag: new Array(11).fill(null).map(x => new Array(13)),
        dienstag: new Array(11).fill(null).map(x => new Array(13)),
        mittwoch: new Array(11).fill(null).map(x => new Array(13)),
        donnerstag: new Array(11).fill(null).map(x => new Array(13)),
        freitag: new Array(11).fill(null).map(x => new Array(13))
      };
      z.forEach(el => {
        el.zuweisung.uebstunde.forEach(zuw => {
          //  ["Montag", "Dienstag", "Mittwoch", "Donnerstag"].forEach(wochenTag=>{
          let std = zuw.stunde;
          let woT = zuw.wochentag;
          let klasse = parseInt(el.klasse) - 1;

          if (ar[woT.toLowerCase()][std][klasse] === undefined) {
            ar[woT.toLowerCase()][std][klasse] = new Array();
          }

          if (el.lehrer.length === 0) {
            ar[woT.toLowerCase()][std][klasse].push([el.fach, "NN"]);
          }

          //wenn lehrer vorhanden
          el.lehrer.forEach(lehr => {
            //   console.log(el.fach);
            //   console.log(lehr.kuerzel
            if (lehr) {
              ar[woT.toLowerCase()][std][klasse].push([el.fach, lehr.kuerzel]);
            } else {


            }
          });
        });
      });
      return ar;
    })
  );

  hintergrundd(el) {
    // console.log(el);

    if (el && el[0]) {
      switch (el[0][0]) {
        case Fach.hauptunterricht:
          return "huB";
        case Fach.schiene:
          return "schB";
        case Fach.rhythmisch:
          return "rhyB";
        case "HU":
          return "huB";
        default:
          return "normalB";
      }
    } else {
      return "empty";
    }
  }

  markedd(lehr) {
    if (lehr && this.selectLehrer && lehr == this.selectLehrer.kuerzel) {
      return "blueback";
    }
  }

  constructor(public lehrerService: LehrerService,
    public login: LoginService,
    public klassenplanServ: KlassenplaeneService) {
 this.klassenplanServ.grundPlanfaecher$.subscribe((data) => {
      this.grundPlanfaecher = data;
       console.log(data);
    });
    lehrerService.lehrerSelected$.subscribe(data => {
      this.selectLehrer = data;
    });


  }

  ngOnInit(): void {}

}
