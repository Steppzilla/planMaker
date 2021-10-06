import {
  Component,
  OnInit
} from '@angular/core';
import {
  Fach
} from 'src/app/enums/fach.enum';
import {
  Lehrer
} from 'src/app/interfaces/lehrer';
import {
  KlassenplaeneService
} from 'src/app/services/klassenplaene.service';
import {
  LehrerService
} from 'src/app/services/lehrer.service';
import { LoginService } from 'src/app/services/login.service';
import { getSyntheticLeadingComments } from 'typescript';


@Component({
  selector: 'app-lehrer-liste',
  templateUrl: './lehrer-liste.component.html',
  styleUrls: ['./lehrer-liste.component.scss']
})
export class LehrerListeComponent implements OnInit {

  faecher=Object.keys(Fach);
  aufgaben=["Schulführung","Vorstand","Pädagogische Leitung", "Geschäftsführer"];

 // Fach dem Lehrer hinzufügen:
  fachLehrerAdd(fach,lehrer){
    let faecher=lehrer.faecher;
    faecher.push(fach);
    this.loginServ.lehrerHinzufuegen({anrede:lehrer.anrede,name:lehrer.name,kuerzel:lehrer.kuerzel,faecher:faecher,aufgaben:[]})

  }
  lehrerAdd(anrede,name,kuerzel,faecher,aufgaben,deputat){
    this.loginServ.lehrerHinzufuegen({anrede:anrede,name:name,kuerzel:kuerzel,faecher:[],aufgaben:[]})
  }
  lehrerLoeschen(kuerz){
    this.loginServ.lehrerLoeschen(kuerz);
  }

  deputat(lehrer){
    let neuArray = this.klassenplan.grundPlanfaecher.getValue();
    let ueb =0 ;
    let rhy=0;
    let epo=0;
    let sch=0;
    neuArray.forEach(element=>{
      if(element==null){}else{
        element.lehrer.forEach(lehr=>{
          if(lehr!=null&&lehr.kuerzel==lehrer.kuerzel&&(element.fach!=Fach.hauptunterricht&&element.fach!=Fach.schiene&&element.fach!=Fach.rhythmisch&&parseInt(element.klasse)>8|| parseInt(element.klasse)<=8)){
        //Problem sind hier noch Klassenübergreifende Fächer wie Wahlpflicht, Chor und MSO
            ueb= ueb+ element.zuweisung.uebstunde.length ;
            rhy=  rhy+ element.zuweisung.rhythmus.length;
            epo=epo+element.zuweisung.epoche.length;
           // console.log(lehr.kuerzel);
            //console.log(epo);
            
            sch=sch+element.zuweisung.schiene.length;
          }
        });
   
      }
    })
    
    //Wenn lehrer im wahlpflicht, chor und mso arbeitet zieh ich manuell die überflüssigen stunden ab:

    lehrer.faecher.forEach(fac => {
      
    
    if(fac==Fach.wahlpflicht){
      ueb=ueb-4 ; // 4 abziehen weil 2 übstunden und zwei Epochen/schiene doppelt gezählt wurden (also in 2 Klassen)
      sch=sch-0; //hier nur wenn wahlpflicht in der schiene ist was abziehn 
    }
    if(fac==Fach.chor||fac==Fach.orchester){
      ueb=ueb-6; // in 4KLassen je 2 Stunden, also 3x2 Stunden zu viel gerechnet weil gleichzeitig
    }
    if(fac==Fach.mittelstufenorchester){
      ueb=ueb-2; //in 2 Klassen 2 Stunden, also 2 zu viel
    }
  });

    return [ueb,rhy,epo,sch];
  }

  klassenReturn(lehrer: Lehrer, fach:Fach){

    let neuArray = this.klassenplan.grundPlanfaecher.getValue();
    let elemente = [];
    neuArray.forEach(element => {
      if (element == null) {} else {
        element.lehrer.forEach(lehr => {
          if(lehrer.kuerzel==null){}
          else
          if (lehr != null) {
            if (lehr.kuerzel == lehrer.kuerzel && fach==element.fach) {
              elemente.push(element.klasse);
            }
          }

        });

      }
    });
    return elemente;
  }

  
  constructor(public lehrerServ: LehrerService, public klassenplan: KlassenplaeneService, public loginServ : LoginService) {
    
  }

  ngOnInit(): void {}

}
