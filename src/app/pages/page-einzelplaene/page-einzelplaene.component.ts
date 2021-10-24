import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LehrerService } from 'src/app/services/lehrer.service';

@Component({
  selector: 'app-page-einzelplaene',
  templateUrl: './page-einzelplaene.component.html',
  styleUrls: ['./page-einzelplaene.component.scss']
})
export class PageEinzelplaeneComponent implements OnInit {


  redirect(x: string) {
    this.router.navigate(['/','einzelPlaene-Planer',x]);
    this.lehrerServ.gewaehlterPlan = x;
    this.lehrerServ.ausgewaehlterModus=0; //nur anschauen
    console.log(x);
  }


  constructor(public router: Router, public lehrerServ:LehrerService) { 

  }

  ngOnInit(): void {
  }

}
