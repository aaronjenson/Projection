import {Component, OnInit} from '@angular/core';
import * as Raphael from 'raphael';
import {Cube} from './cube';

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})
export class SvgComponent implements OnInit {
  public static ANGULAR_VEL = Math.PI / 2;

  dimensions: number;
  angle: number[];
  rotations: boolean[];
  paper: RaphaelPaper;
  cube: Cube;

  constructor() {
  }

  ngOnInit() {
    this.dimensions = 3;
    this.cube = new Cube(3);

    this.paper = Raphael('canvas_container', 500, 500);
    this.cube.draw(this.paper);
  }
}
