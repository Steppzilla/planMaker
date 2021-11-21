import { FunctionCall } from "@angular/compiler";
import { Fach } from "../enums/fach.enum";
import { Lehrjahr } from "../enums/lehrjahr.enum";
import { Raum } from "../enums/raum.enum";
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
    zuweisung?: 
   
        {
            uebstunde:  Array<{wochentag:string,stunde:number,lehrer?:Lehrer}>,//lehrer nur bei mittagspausen genutzt
            rhythmus:  Array<{start:Date,ende:Date}>,
            epoche: Array<{start:Date,ende:Date}>,
            schiene: Array<{start:Date,ende:Date}>,
            uebBeh?: Array<number>,
            epoBeh?: Array<number>,
            schBeh?: Array<number>,
        }; //Start-Ende, Start-Ende etc
    berechnung?: number;
}
