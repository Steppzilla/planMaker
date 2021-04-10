import { Fach } from "../enums/fach.enum";
import { Lehrjahr } from "../enums/lehrjahr.enum";
import { Raum } from "../enums/raum.enum";
import { ErstesElementPipe } from "../pipe/erstes-element.pipe";
import { Lehrer } from "./lehrer";

export interface Elementt {
    fach: Fach;
    klasse: Lehrjahr;
    wochenstunden: number;
    lehrer?: Array<Lehrer>;
    raum?: Raum;
    uebstunde: number;
    rhythmus: number;
    schiene: number;
    epoche:number;
    marked?:boolean;
    zuweisungUeb?: Array<[number,number]>,//Wochentag als Zahl 0=Sonntag bis 6 = Samstag  , - ,die wievielte Stunde an diesem Tag 
    zuweisungEpoche?: Array<Date>, //
}
