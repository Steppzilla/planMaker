import { Raum } from '../enums/raum.enum';
import { Elementt } from './elementt';
import { Lehrer } from './lehrer';

export class Stundenplan {
    ueberschrift: string; //hier möglichst Lehrer/Klasse oder Raum festlegen.
    stundenPlan:Array<Array<Array<Elementt>>>;
    klasse:number;  //Lehrer aktiv
    lehrer:Lehrer; //Klassen aktiv
    raum:Raum; //Raumplan
    epochenPlan: Array<Elementt>;
    rhythmusPlan:  Array<Elementt>;
    schienenPlan: Array<Elementt>;

    getTitel(){
        if(this.klasse!==undefined){
            return " Klasse " + this.klasse ;
        }else{
            return " " + this.lehrer.anrede + " " + this.lehrer.name;
        }

    }




}
