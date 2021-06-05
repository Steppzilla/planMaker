import {
  Component,
  OnInit
} from '@angular/core';
import {
  Lehrjahr
} from 'src/app/enums/lehrjahr.enum';
import {
  Wochentag
} from 'src/app/enums/wochentag.enum';
import {
  Elementt
} from 'src/app/interfaces/elementt';
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
  selector: 'app-gesamtuebersicht',
  templateUrl: './gesamtuebersicht.component.html',
  styleUrls: ['./gesamtuebersicht.component.scss']
})
export class GesamtuebersichtComponent implements OnInit {
  wochenTagauswahl: string;
  grundPlanfaecher: Array < Elementt > ; //statt stundenLehrerArray?
  lehrerAuswahl = []; //nur übstundenFilter von grundplanfaecher
  tagesPlan=[] ;
 // stundenRaster: Gesamtstundenraster;

  wochentage = Wochentag;
  kuerzeleinblenden: boolean;
  buttontext = "einblenden";
  selectLehrer: Lehrer;

  klassen = Object.values(Lehrjahr);

  wochentagWahl(x: string) {
    this.wochenTagauswahl = x;
  }

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

  valueLoopinArray(obj) {
    // console.log(obj);
    return Object.values(obj);
  }
  keyinArray(obj) {
    return Object.keys(obj);
  }
  wochenTagLoop() {
    return Object.values(Wochentag);
  }

  lehrerwahl(lehrerNR) { //Blaumarkierung der gewählten lehrer
    this.selectLehrer = this.lehrerService.lehrer[lehrerNR]; //locale Variable
  }

  marked(lehr){
    if(lehr&&this.selectLehrer&&lehr.kuerzel==this.selectLehrer.kuerzel){
      return "blueback";
    }
   

  }

  togglezellenClick(stdZ, clickedElementt: Elementt) { //ganze Zelle/stunden zeile als Zahl
    let neu=this.klassenplanServ.grundPlanfaecher.getValue();
    neu.forEach((element,e)=>{
      if(element!=null&&element.fach==clickedElementt.fach&&element.klasse==clickedElementt.klasse&& (element.uebstunde > 0)&&element.lehrer[0].kuerzel==clickedElementt.lehrer[0].kuerzel){ 
        
        element.zuweisung.uebstunde.push({wochentag:this.wochenTagauswahl,stunde: stdZ});
      }
    });
    this.klassenplanServ.grundPlanfaecher.next(neu);
    //Bei HU und epoche ggf nichts ändern? 
}

  cellKlick(e,  c, reiheKlasse) {
    if (e.shiftKey) {
     // let neu=this.klassenplanServ.grundPlanfaecher.getValue();
     // neu[c].zuweisung.uebstunde=[];
      this.grundPlanfaecher.forEach((element,el)=>{
        if(element!=null){
        element.zuweisung.uebstunde.forEach((zuw,z) => {
          if(element!=null&&zuw.wochentag==this.wochenTagauswahl&&zuw.stunde==c&&element.klasse==reiheKlasse){
            element.zuweisung.uebstunde.splice(z,1);
            console.log("gelöschte uebstunde:");
            console.log(element);
            console.log(z);
            console.log(zuw);

             //element.zuweisung.uebstunde=[];
           }         
        });
        }       
      });
     // console.log(neu);
     // this.klassenplanServ.grundPlanfaecher.next(neu);
      console.log("ende");
     } else {}
  }

  duplicates(lehr,z) { //
    let duplicates=0;
    this.grundPlanfaecher.forEach((element,e) => {
      if(element==null){
        this.grundPlanfaecher.splice(e,1);
      }else{
      element.zuweisung.uebstunde.forEach(({wochentag,stunde},ue) => {
      //  console.log(wochentag + "."+this.wochenTagauswahl);
        if(wochentag==this.wochenTagauswahl&&stunde==z){
       element.lehrer.forEach(le=>{
        if(lehr&&element&&lehr.kuerzel==le.kuerzel){
          // console.log(element.lehrer[0].kuerzel + "." +r + ". " + element.klasse);
           duplicates++;
         }
       });
        }
      });
    }   
    });
    return duplicates>1? "error": "ok";  
  }

  duplicateToggle(c, ele) {

    let duplicates=0;
    this.grundPlanfaecher.forEach((element,e) => {
      if(element==null){
        this.grundPlanfaecher.splice(e,1);
      }else{
      element.zuweisung.uebstunde.forEach(({wochentag,stunde},ue) => {
      //  console.log(wochentag + "."+this.wochenTagauswahl);
        if(wochentag==this.wochenTagauswahl&&stunde==c){ 
       element.lehrer.forEach(le=>{
         ele.lehrer.forEach(el => {
          if(ele&&element&&el.kuerzel==le.kuerzel){
            // console.log(element.lehrer[0].kuerzel + "." +r + ". " + element.klasse);
             duplicates++;
           }          
         });
       });
        }
      });
    }     
    });
    return duplicates>1? "error": "ok";
  }

  leherkuerzelToggle() {
    if (this.kuerzeleinblenden == true) {
      this.kuerzeleinblenden = false;
      this.buttontext = "einblenden";
    } else {
      this.kuerzeleinblenden = true;
      this.buttontext = "ausblenden";
    }
  }

  constructor(public lehrerService: LehrerService, public login: LoginService, public klassenplanServ: KlassenplaeneService) {
    this.wochenTagauswahl = 'Montag';
    this.kuerzeleinblenden = false;
    this.klassenplanServ.grundPlanfaecher$.subscribe((data) => {
      this.grundPlanfaecher = data;
     // console.log(data);
    });
    this.wochentagWahl(this.wochenTagauswahl);
    this.tagesPlan=login.leerestagesRaster();
  }

  ngOnInit(): void {}

}
