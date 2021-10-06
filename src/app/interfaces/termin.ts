import { Timestamp } from "rxjs/internal/operators/timestamp";
import { Lehrjahr } from "../enums/lehrjahr.enum";

export interface Termin {
    titel:string;
    start: Date;
    ende:Date;
    klasse:Lehrjahr;
}
