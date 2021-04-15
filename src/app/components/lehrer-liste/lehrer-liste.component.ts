import { Component, OnInit } from '@angular/core';
import { LehrerService } from 'src/app/services/lehrer.service';

@Component({
  selector: 'app-lehrer-liste',
  templateUrl: './lehrer-liste.component.html',
  styleUrls: ['./lehrer-liste.component.scss']
})
export class LehrerListeComponent implements OnInit {
 

  constructor(public lehrerServ: LehrerService
  ) {
   

   }

  ngOnInit(): void {
  }

}
