import { Timestamp } from "rxjs";
import { Ferientermin } from "./ferientermin";
import { Pruefungstermin } from "./pruefungstermin";
import { Termin } from "./termin"

export interface TagesObjekt {

    tag:   Date;
    frei?:boolean, //ob schulfrei, nur bei Ferien + Feiertagen? siehe ferientermine push am ende
    notiz: string, //z.B. Herbstferien, Heiligabend
    unterricht: [],
    fahrten?: Array<Termin>,
    pruefungen?: Array<Pruefungstermin>,
    ferien?: Array<Ferientermin>,
    rhytmus?: {neun: [], zehn: [], elf:[], zwoelf:[]},
    epoche?: {neun: [], zehn: [], elf:[], zwoelf:[]},
    schiene?: {neun: [], zehn: [], elf:[], zwoelf:[]}

    

}
