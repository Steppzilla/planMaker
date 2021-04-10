
import { Fach } from '../enums/fach.enum';
import {Lehrer} from './lehrer';
import { Lehrjahr } from '../enums/lehrjahr.enum';
import {Raum} from '../enums/raum.enum';
import { Zeitpunkt } from './zuweisung';
import { Rubriken } from '../enums/rubriken.enum';

export interface Unterrichtsstunde {

    faecher: Fach;
    klasse: Lehrjahr;
    lehrer: Array<Lehrer>;
    raum?: Raum ;
    wochenstunden?:number;

    zeitpunkt?: Zeitpunkt[];  //Daten anders je nach epoche/schien/Ryhthm //nicht belegt bei täglicher stunde, da gilt position
   
    marked?:boolean;
    halbiert: boolean;
    drittel:boolean;
}
