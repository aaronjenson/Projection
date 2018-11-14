import {Rotation} from './rotation';
import {Matrix} from './matrix';

export class Cube {
  public static COORD_ONE = -0.05;
  public static COORD_TWO = -Cube.COORD_ONE;
  public static BASE_DIST = Cube.COORD_TWO - Cube.COORD_ONE;
  public static CAMERA_DIST = 1;

  dimension: number;
  basePoints: number[][];
  pointSet: RaphaelSet;
  lineSet: RaphaelSet;

  constructor(dim: number) {
    this.setDimensions(dim);
  }

  public setDimensions(dim: number) {
    // create matrix of points for dimension
    this.dimension = dim;
    this.basePoints = [[]];
    for (let i = 1; i <= dim; i++) {
      this.addDimension();
    }
    console.table(this.basePoints);
  }


  private addDimension() {
    const startPoints = this.basePoints.length;
    for (let i = 0; i < startPoints; i++) {
      this.basePoints.push(this.basePoints[i].slice().concat(Cube.COORD_TWO));
      this.basePoints[i].push(Cube.COORD_ONE);
    }
  }

  private rotationMatrix(rotations: Rotation[]) {
    let output = this.getRotationMatrix(rotations[0]);
    rotations.slice(1).forEach((rotation) => {
      output = Matrix.mult(output, this.getRotationMatrix(rotation));
    });
    return output;
  }

  private getRotationMatrix(rotation: Rotation) {
    const output = [];
    for (let row = 0; row < this.dimension; row++) {
      output.push([]);
      for (let col = 0; col < this.dimension; col++) {
        if (row === (rotation.basis1 - 1) && col === (rotation.basis1 - 1)) {
          output[row].push(Math.cos(rotation.angle));
        } else if (row === (rotation.basis1 - 1) && col === (rotation.basis2 - 1)) {
          output[row].push(-Math.sin(rotation.angle));
        } else if (row === (rotation.basis2 - 1) && col === (rotation.basis1 - 1)) {
          output[row].push(Math.sin(rotation.angle));
        } else if (row === (rotation.basis2 - 1) && col === (rotation.basis2 - 1)) {
          output[row].push(Math.cos(rotation.angle));
        } else if (row === col) {
          output[row].push(1);
        } else {
          output[row].push(0);
        }
      }
    }
    return output;
  }

  private project(point: number[]) {
    while (point.length > 2) {
      const scale = 1 / (Cube.CAMERA_DIST - point.pop());
      point.forEach((val, i, arr) => arr[i] *= scale);
    }
  }

  public draw(paper: RaphaelPaper, rotations: Rotation[]) {
    // apply rotations
    // project basePoints on to 2d plane
    // map basePoints to paper size
    // draw basePoints
    console.table(this.basePoints);
    // console.table(Matrix.mult(this.basePoints, this.rotationMatrix(rotations)));

    const projPoints = this.basePoints.slice();
    projPoints.forEach((point) => this.project(point));
    console.table(projPoints);

    // const self = this;
    // paper.setStart();
    // self.basePoints.forEach((point: Point) => {
    //   point.draw(paper, rotations);
    // });
    // self.pointSet = paper.setFinish();
    //
    // self.pointSet.attr('fill', '#000');
    // self.pointSet.attr('fill-opacity', 0.9);
    //
    // paper.setStart();
    // self.basePoints.forEach((point: Point) => {
    //   point.resetConnections();
    // });
    // self.basePoints.forEach((point1: Point) => {
    //   self.basePoints.forEach((point2: Point) => {
    //     if (point1.distance(point2) === Point.BASE_DIST) {
    //       point1.drawConnection(paper, point2, rotations);
    //     }
    //   });
    // });
    // self.lineSet = paper.setFinish();
    // // self.lineSet.attr('stroke-width', 10);
  }
}
