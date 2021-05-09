
import { Fach } from '../enums/fach.enum';
import { Lehrjahr } from '../enums/lehrjahr.enum';
import { Wochentag } from '../enums/wochentag.enum';


export interface Lehrer {
    id: number;
    name: string;
    kuerzel:string;
    anrede: string;
    faecher: Array<Fach>;
    aufgaben?: Array<string>;
    faecherKlassen?: Array<[Fach,Lehrjahr[]]>; //Kompentenzn, können mehr sein als zugewiesen
    sonderRegel?: {wochetage: Array<Wochentag>,  stunden: Array<number>};
    //kompetenz: Array <{fach:Fach, klassenstufe:Lehrjahr} >;
  }