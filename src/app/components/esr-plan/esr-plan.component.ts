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
  selector: 'app-esr-plan',
  templateUrl: './esr-plan.component.html',
  styleUrls: ['./esr-plan.component.scss']
})
export class EsrPlanComponent implements OnInit {

  iix = Lehrjahr.acht;
  ix = Lehrjahr.neun;
  x = Lehrjahr.zehn;
  xi = Lehrjahr.elf;
  xii = Lehrjahr.zwoelf;

  esrPlan;
  grundPlanfaecher: Array < Elementt > ;

  gewaehlterPlan = "rhythmus";
  gewaehltesElement: Elementt;
  clickCount = 0;

  wahl(z) {
    this.gewaehlterPlan = z;
    this.clickCount = 0;
  }
  tabellensortierung(kl: Lehrjahr) {
    let lehrerVonKlasse: Array < Elementt > = [];
    //let newArray:Array<Elementt> =this.klassenplanServ.grundPlanfaecher.getValue();
    //this.klassen.forEach((klas, f) => {
    this.grundPlanfaecher.forEach(element => {
      if ((element != null) && (element.klasse == kl) && (element[this.gewaehlterPlan] > 0)) {
        lehrerVonKlasse.push(element);
      }
    });
    return lehrerVonKlasse;
  }

  merkeClickItems = {
    tagi: null
  };
  click(e, klasse, tagIndex, klasseString, wochentagZahl) { //wochenTagZahl So=0, Mo=1, Di=2, Mi=3, Do=4, Fr=5, Sa=6
    console.log(wochentagZahl);
    if (klasse == this.gewaehltesElement.klasse) {

      if (this.clickCount % 2 == 0) {
        //   this.merkeClickItems.klas=klasse;
        let monta= tagIndex-wochentagZahl+1//Montag auswhäln für Start
        this.merkeClickItems.tagi =monta; 
        if (e.shiftKey) {
          this.esrPlan[monta][this.gewaehlterPlan][klasseString] = [];
        } else {
          this.esrPlan[monta][this.gewaehlterPlan][klasseString].push(this.gewaehltesElement);
        }


      } else { //bei ungeraden alles füllen vom merke Item bis zum geclickten elem:
        //Freitag wählen
        let freit=tagIndex-wochentagZahl+5;
        this.esrPlan.forEach((day, d) => {
          if ((d > this.merkeClickItems.tagi) && d <= freit) {
            if (e.shiftKey) {
              day[this.gewaehlterPlan][klasseString] = [];
            } else {
              day[this.gewaehlterPlan][klasseString].push(this.gewaehltesElement);
            }
          }

        });


      }
      this.clickCount++;
    }

    console.log(tagIndex);
    console.log(this.esrPlan);

  }

  togglezellenClick(e, b, clickedElementt: Elementt) { //wochentag/ganze Zelle/stunden zeile als Zahl, KLasse ist in Zelle.klasse
    // let neuArray=this.epochenServ["epoche" + clickedElementt.klasse].getValue();
    //console.log(b);
    // console.log(neuArray);
    // console.log(neuArray[b]);
    //   neuArray[b].unterricht.push(clickedElementt);
    //  this.epochenServ["epoche" + clickedElementt.klasse].next(neuArray);
  }

  epochenWahl(ele: Elementt) {
    this.gewaehltesElement = ele;
    this.clickCount = 0;

  }

  constructor(public epochenPlanS: EpochenPlaeneService, public ferienServ: FerientermineService, public klassenplanServ: KlassenplaeneService) {
    this.epochenPlanS.esr_plan$.subscribe((data) => {this.esrPlan = data;
    console.log(data);});
    this.klassenplanServ.grundPlanfaecher$.subscribe((data) => this.grundPlanfaecher = data);
  }

  ngOnInit(): void {}

}
