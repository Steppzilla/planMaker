import { StundenRaster } from "./stunden-raster";

export interface Gesamtstundenraster {
    montag:StundenRaster;
    dienstag:StundenRaster;
    mittwoch:StundenRaster;
    donnerstag:StundenRaster;
    freitag:StundenRaster;
    samstag?:StundenRaster;
    sonntag?:StundenRaster;
}
