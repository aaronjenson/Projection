import {Rotation} from './rotation';
import {Matrix} from './matrix';

// n-dimensional cube
export class NCube {
  public static readonly COORD_ONE = -0.05;
  public static readonly COORD_TWO = -NCube.COORD_ONE;
  public static readonly CAMERA_DIST = 1;

  dimension: number;
  points: number[][];
  connections: number[][];

  constructor(dim: number) {
    this.setDimensions(dim);
  }

  public setDimensions(dim: number) {
    this.dimension = dim;
    this.points = [[]];
    this.connections = [];
    for (let i = 1; i <= dim; i++) {
      this.addDimension();
    }
    console.table(this.points);
    this.createConnections(0, 2 ** dim);
    console.table(this.connections);
  }


  private addDimension() {
    const startPoints = this.points.length;
    for (let i = 0; i < startPoints; i++) {
      this.points.push(this.points[i].slice().concat(NCube.COORD_ONE));
      this.points[i].push(NCube.COORD_TWO);
    }
  }

  private createConnections(start: number, end: number) {
    const mid = (end - start) / 2 + start;
    for (let i = 0; i < (end - start) / 2; i++) {
      this.connections.push([start + i, mid + i]);
    }
    if (end - start > 2) {
      this.createConnections(start, mid);
      this.createConnections(mid, end);
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

  private project(point: number[], axonometric: boolean) {
    let retVal = point.slice();
    if (!axonometric) {
      while (retVal.length > 2) {
      const scale = 1 / (NCube.CAMERA_DIST - retVal.pop());
      retVal.forEach((val, i, arr) => arr[i] *= scale);
      }
    } else {
      retVal = retVal.slice(0, 2);
    }
    return retVal;
  }

  public map(val: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return (((val - inMin) / (inMax - inMin)) * (outMax - outMin)) + outMin;
  }

  public draw(paper: RaphaelPaper, rotations: Rotation[], axonometric: boolean) {
    const paperPoints = Matrix.mult(this.points, this.rotationMatrix(rotations)).map((point) =>
      this.project(point, axonometric).map((val) =>
        this.map(val, NCube.COORD_ONE - 0.125, NCube.COORD_TWO + 0.125, 0, paper.width)));
    paperPoints.forEach((point) => this.drawPoint(paper, point));
    this.connections.forEach((con) => this.drawConnection(paper, paperPoints[con[0]], paperPoints[con[1]]));
  }

  public drawPoint(paper: RaphaelPaper, point: number[]) {
    paper.ellipse(point[0], point[1], 5, 5);
  }

  private drawConnection(paper: RaphaelPaper, point1: number[], point2: number[]) {
    paper.path('M' + point1.join(' ') + 'L' + point2.join(' ')).attr('stroke-width', '1');
  }
}
