import {Component, OnInit} from '@angular/core';
import * as Raphael from 'raphael';
import {NCube} from './NCube';
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
  cube: NCube;
  loop: Subscription;
  animate: boolean;
  velocityMult: number;
  reversed: boolean;
  lastTime: number;
  axonometric: boolean;

  constructor(public dialog: MatDialog) {
    this.lastTime = Date.now();
  }

  ngOnInit() {
    this.dimensions = 3;
    this.animate = true;
    this.reversed = false;
    this.velocityMult = 1;
    this.axonometric = true;

    const container = document.getElementById('canvas_container');
    this.paper = Raphael(container, container.offsetWidth, container.offsetHeight);
    this.reset();

    this.loop = interval(1000.0 / SvgComponent.FPS)
      .subscribe(() => {
        this.resizeSvg();
        if (this.animate) {
          this.updateRotations();
          this.redraw();
          const timeDiff = Date.now() - this.lastTime;
          this.lastTime = Date.now();
          this.paper.text(25, 5, 'FPS: ' + (1000 / timeDiff).toFixed(1));
        }
      });
  }

  resizeSvg() {
    const container = document.getElementById('canvas_container');
    this.paper.setSize(container.offsetWidth, container.offsetHeight);
  }

  reset() {
    this.getRotations();
    this.cube = new NCube(this.dimensions);
    this.redraw();
  }

  redraw() {
    this.paper.clear();
    this.cube.draw(this.paper, this.rotations, this.axonometric);
  }

  toDegrees(rad: number) {
    return rad * 180 / Math.PI;
  }

  getRotations() {
    if (typeof(this.rotations) === 'undefined') {
      this.rotations = [];
    }
    const oldDimensions = this.rotations.reduce((max, rot) => Math.max(max, rot.basis2), 0);
    if (this.dimensions > oldDimensions) {
      for (let i = 1; i < this.dimensions; i++) {
        for (let j = i + 1; j <= this.dimensions; j++) {
          if (this.rotations.find((val) => val.basis1 === i && val.basis2 === j) === undefined) {
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
    }

    this.rotations = this.rotations.filter((rot) => rot.basis1 <= this.dimensions && rot.basis2 <= this.dimensions);
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
