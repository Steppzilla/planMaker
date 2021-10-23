import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LehrerService } from 'src/app/services/lehrer.service';

@Component({
  selector: 'app-start-auswahl',
  templateUrl: './start-auswahl.component.html',
  styleUrls: ['./start-auswahl.component.scss']
})
export class StartAuswahlComponent implements OnInit {




  redirect(x: string) {
    this.router.navigate([x]);
    this.lehrerServ.gewaehlterPlan = x;
    console.log(x);
   // console.log(this.lehrer.gewaehlterPlan);
  }


  constructor(public lehrerServ: LehrerService,  public router: Router) { }

  ngOnInit(): void {
  }

}
