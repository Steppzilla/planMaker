import {
  Injectable
} from '@angular/core';
import addDays from 'date-fns/addDays';


@Injectable({
  providedIn: 'root'
})
export class FerientermineService {
  datumHeute2: Date = new Date(); //achtung hat aktuelle Zeit
  datumHeute=addDays(this.datumHeute2,30);
    
  tagZuString(tag: Date) {
    switch (tag.getDay()) {
      case 0:
        return "So";
      case 1:
        return "Mo";
      case 2:
        return "Di";
      case 3:
        return "Mi";
      case 4:
        return "Do";
      case 5:
        return "Fr";
      case 6:
        return "Sa";
    }
  }

  zahlZuString(zahl) {
    switch (zahl) {
      case 0:
        return "So";
      case 1:
        return "Mo";
      case 2:
        return "Di";
      case 3:
        return "Mi";
      case 4:
        return "Do";
      case 5:
        return "Fr";
      case 6:
        return "Sa";
    }
  }

  monatZuString(tag: Date) {
    switch (tag.getMonth()) {
      case 0:
        return "Jan";
      case 1:
        return "Feb";
      case 2:
        return "März";
      case 3:
        return "April";
      case 4:
        return "Mai";
      case 5:
        return "Juni";
      case 6:
        return "Juli";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "Oktober";
      case 10:
        return "November";
      case 11:
        return "Dezember";
    }
  }

  

  constructor() {
   
  }
}
