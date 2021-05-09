
import { Fach } from '../enums/fach.enum';
import {Lehrer} from './lehrer';
import { Lehrjahr } from '../enums/lehrjahr.enum';
import {Raum} from '../enums/raum.enum';


export interface Unterrichtsstunde {

    faecher: Fach;
    klasse: Lehrjahr;
    lehrer: Array<Lehrer>;
    raum?: Raum ;
    wochenstunden?:number;

   
   
    marked?:boolean;
    halbiert: boolean;
    drittel:boolean;
}
