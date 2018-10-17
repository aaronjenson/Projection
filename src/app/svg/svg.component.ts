import {Component, OnInit} from '@angular/core';
import * as Raphael from 'raphael';
import {Cube} from './cube';
import {Rotation} from './rotation';
import {interval, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';
import {HelpComponent} from './help/help.component';

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})
export class SvgComponent implements OnInit {
  public static DEFAULT_ANGULAR_VEL = Math.PI / 2; // rad/s
  public static FPS = 30; // frames per second

  dimensions: number;
  rotations: Rotation[];
  paper: RaphaelPaper;
  cube: Cube;
  loop: Subscription;
  animate: boolean;
  velocityMult: number;
  reversed: boolean;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.dimensions = 3;
    this.animate = true;
    this.reversed = false;
    this.velocityMult = 1;

    const container = document.getElementById('canvas_container');
    this.paper = Raphael(container, container.offsetWidth, container.offsetHeight);
    this.reset();

    this.loop = interval(1000.0 / SvgComponent.FPS)
      .subscribe(() => {
        this.resizeSvg();
        if (this.animate) {
          this.updateRotations();
          this.redraw();
        }
      });
  }

  resizeSvg() {
    const container = document.getElementById('canvas_container');
    this.paper.setSize(container.offsetWidth, container.offsetHeight);
  }

  reset() {
    this.getRotations();
    this.cube = new Cube(this.dimensions);
    this.redraw();
  }

  redraw() {
    this.paper.clear();
    this.cube.draw(this.paper, this.rotations);
  }

  toDegrees(rad: number) {
    return rad * 180 / Math.PI;
  }

  getRotations() {
    this.rotations = [];
    for (let i = 1; i < this.dimensions; i++) {
      for (let j = i + 1; j <= this.dimensions; j++) {
        this.rotations.push({
          angle: 0,
          basis1: i,
          basis2: j,
          active: (i === 1 && j === this.dimensions),
          velocity: SvgComponent.DEFAULT_ANGULAR_VEL
        });
      }
    }
  }

  updateRotations() {
    this.rotations.forEach((rot) => {
      if (rot.active) {
        const directionMult = this.reversed ? -1 : 1;
        rot.angle += directionMult * this.velocityMult * rot.velocity / SvgComponent.FPS;
        while (rot.angle > Math.PI * 2) {
          rot.angle -= Math.PI * 2;
        }
        while (rot.angle < 0) {
          rot.angle += Math.PI * 2;
        }
      }
    });
  }

  showHelpDialog() {
    this.dialog.open(HelpComponent);
  }
}
