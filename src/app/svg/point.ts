import {Matrix} from './matrix';
import {Rotation} from './rotation';

export class Point {
  public static COORD_ONE = -0.05;
  public static COORD_TWO = -Point.COORD_ONE;
  public static BASE_DIST = Point.COORD_TWO - Point.COORD_ONE;
  public static CAMERA_DIST = 1;
  public static SCALE = 1;

  coordinates: number[];
  connections: Point[];

  constructor(...coords: number[]) {
    const self = this;
    self.coordinates = [];
    self.connections = [];
    coords.forEach((num) => {
      self.coordinates.push(num);
    });
  }

  public addDimension(val: number) {
    this.coordinates.push(val);
  }

  /**
   * Projects point onto the next lower dimension
   */
  private removeDimension() {
    const scale = 1 / (Point.CAMERA_DIST - this.coordinates[this.coordinates.length - 1]);
    this.coordinates = this.coordinates.map((val) => val * scale);
    this.coordinates.pop();
  }

  public from() {
    return new Point(...this.coordinates);
  }

  public rotate(theta: number, basis1: number, basis2: number) {
    const rotMat = this.getRotationMatrix(theta, basis1, basis2);
    this.coordinates = Matrix.vectorMult(rotMat, this.coordinates);
  }

  public distance(point: Point) {
    let squareSum = 0;
    for (let i = 0; i < point.coordinates.length; i++) {
      squareSum += Math.pow(point.coordinates[i] - this.coordinates[i], 2);
    }
    return Math.sqrt(squareSum);
  }

  public map(val: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return (((val - inMin) / (inMax - inMin)) * (outMax - outMin)) + outMin;
  }

  public get2DCoords(rotations: Rotation[]) {
    const point = this.from();

    rotations.forEach((rotation) => {
      point.rotate(rotation.angle, rotation.basis1, rotation.basis2);
    });

    while (point.coordinates.length > 2) {
      point.removeDimension();
    }
    return point.coordinates;
  }

  public getPaperCoords(paper: RaphaelPaper, rotations: Rotation[]) {
    const self = this;
    const coords2D = this.get2DCoords(rotations);
    const coords = coords2D.map((val) => self.map(val, Point.COORD_ONE - 0.125, Point.COORD_TWO + 0.125, 0, paper.width));
    return coords;
  }

  public draw(paper: RaphaelPaper, rotations: Rotation[]) {
    const point2D = this.getPaperCoords(paper, rotations);
    paper.circle(point2D[0], point2D[1], 5);
  }

  public drawConnection(paper: RaphaelPaper, point: Point, rotations: Rotation[]) {
    if (this.connections.includes(point)) {
      return;
    }
    if (this.distance(point) !== Point.BASE_DIST) {
      return;
    }
    this.addConnection(point);
    point.addConnection(this);

    const pathString = 'M' + this.getPaperCoords(paper, rotations).join(' ') + 'L' +
      point.getPaperCoords(paper, rotations).join(' ');
    paper.path(pathString);
  }

  public addConnection(point: Point) {
    this.connections.push(point);
  }

  public resetConnections() {
    this.connections = [];
  }

  public getRotationMatrix(theta: number, basis1: number, basis2: number) {
    const output = [];
    for (let row = 0; row < this.coordinates.length; row++) {
      output.push([]);
      for (let col = 0; col < this.coordinates.length; col++) {
        if (row === (basis1 - 1) && col === (basis1 - 1)) {
          output[row].push(Math.cos(theta));
        } else if (row === (basis1 - 1) && col === (basis2 - 1)) {
          output[row].push(-Math.sin(theta));
        } else if (row === (basis2 - 1) && col === (basis1 - 1)) {
          output[row].push(Math.sin(theta));
        } else if (row === (basis2 - 1) && col === (basis2 - 1)) {
          output[row].push(Math.cos(theta));
        } else if (row === col) {
          output[row].push(1);
        } else {
          output[row].push(0);
        }
      }
    }
    return output;
  }
}
