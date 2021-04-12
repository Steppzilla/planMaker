import {
  Component,
  OnInit
} from '@angular/core';
import {
  Lehrjahr
} from 'src/app/enums/lehrjahr.enum';
import {
  Elementt
} from 'src/app/interfaces/elementt';
import {
  EpochenPlaeneService
} from 'src/app/services/epochen-plaene.service';
import {
  FerientermineService
} from 'src/app/services/ferientermine.service';
import {
  KlassenplaeneService
} from 'src/app/services/klassenplaene.service';

@Component({
  selector: 'app-epoche',
  templateUrl: './epoche.component.html',
  styleUrls: ['./epoche.component.scss']
})
export class EpocheComponent implements OnInit {

  datumObj;
  freieTagederWoche;


  vorigesElement;

  klassen = Object.values(Lehrjahr);
  grundPlanfaecher: Array < Elementt > ;


  epoche8;
  epoche9;
  epoche10;
  epoche11;
  epoche12;

 


  tabellensortierung(kl) {
    let lehrerVonKlasse:Array<Elementt> = [];
  let newArray:Array<Elementt> =this.klassenplanServ.grundPlanfaecher.getValue();
  //this.klassen.forEach((klas, f) => {
    newArray.forEach(element=>{
      if ((element!=null)&&(element.klasse == kl)&&(element.epoche>0)) {
        lehrerVonKlasse.push(element);
      }
     });
    return lehrerVonKlasse;
  }

  cellKlick(e,b,klasse){
    if (e.shiftKey) { 
      let neuArray=this.epochenServ["epoche" + klasse].getValue();
      neuArray[b].unterricht=[];
      this.epochenServ["epoche" + klasse].next(neuArray);
    }
  }  

  togglezellenClick(e, b, clickedElementt: Elementt) { //wochentag/ganze Zelle/stunden zeile als Zahl, KLasse ist in Zelle.klasse
   let neuArray=this.epochenServ["epoche" + clickedElementt.klasse].getValue();
   console.log(b);
   console.log(neuArray);
   console.log(neuArray[b]);
    neuArray[b].unterricht.push(clickedElementt);
    this.epochenServ["epoche" + clickedElementt.klasse].next(neuArray);
  }

  constructor(public ferienTerminService: FerientermineService, public klassenplanServ: KlassenplaeneService, public epochenServ: EpochenPlaeneService) {
    this.datumObj = ferienTerminService.daysBetween();
//Fahrten reinschreiben:




   /// console.log(this.datumObj);
    this.klassenplanServ.grundPlanfaecher$.subscribe((data) => this.grundPlanfaecher = data);
    this.epochenServ.epoche8$.subscribe((data)=>{
      this.epoche8=data;
     // console.table(data);
    });
    this.epochenServ.epoche9$.subscribe((data)=>this.epoche9=data);
    this.epochenServ.epoche10$.subscribe((data)=>this.epoche10=data);
    this.epochenServ.epoche11$.subscribe((data)=>this.epoche11=data);
    this.epochenServ.epoche12$.subscribe((data)=>this.epoche12=data);



    

  }

  ngOnInit(): void {}

}
