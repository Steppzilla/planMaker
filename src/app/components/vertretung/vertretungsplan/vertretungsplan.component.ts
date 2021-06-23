import { Component, OnInit } from '@angular/core';
import { VertretungServService } from 'src/app/services/vertretung-serv.service';

@Component({
  selector: 'app-vertretungsplan',
  templateUrl: './vertretungsplan.component.html',
  styleUrls: ['./vertretungsplan.component.scss']
})
export class VertretungsplanComponent implements OnInit {

  constructor(public vertretungsServ: VertretungServService) { }

  ngOnInit(): void {
  }

}
