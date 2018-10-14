import {Matrix} from './matrix';

export class Point {
  public static COORD_ONE = 1;
  public static COORD_TWO = -Point.COORD_ONE;
  public static BASE_DIST = Point.COORD_ONE - Point.COORD_TWO;
  public static CAMERA_DIST = 3;
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
    // setup projection matrix
    const mat = [];
    for (let i = 0; i < this.coordinates.length - 1; i++) {
      mat.push([]);
      for (let j = 0; j < this.coordinates.length; j++) {
        mat[i].push(i === j ? scale : 0);
      }
    }
    this.coordinates = Matrix.vectorMult(mat, this.coordinates);
  }

  public from() {
    return new Point(...this.coordinates);
  }

  public rotate(theta: number, basis1: number[], basis2: number[]) {
    // create rotation matrix
    // const rotBas = [[Math.cos(theta), -Math.sin(theta)],
    //   [Math.sin(theta), Math.cos(theta)]];
    // const basMat = Matrix.from(basis1, basis2);
    // const basMatFlip = Matrix.flip(basMat);
    // const rotMat = Matrix.mult(Matrix.mult(basMat, rotBas), basMatFlip);

    const rotMat = [[Math.cos(theta), 0, -Math.sin(theta)],
      [0, 1, 0],
      [Math.sin(theta), 0, Math.cos(theta)]];

    this.coordinates = Matrix.vectorMult(rotMat, this.coordinates);
  }

  public distance(point: Point) {
    let squareSum = 0;
    for (let i = 0; i < point.coordinates.length; i++) {
      squareSum += Math.pow(point.coordinates[i] - this.coordinates[i], 2);
    }
    return Math.sqrt(squareSum);
  }

  public get2DCoords() {
    const point = this.from();
    point.rotate(Math.PI / 7, [1, 0, 0], [0, 0, 1]);
    while (point.coordinates.length > 2) {
      point.removeDimension();
    }
    return point.coordinates;
  }

  public getPaperCoords(paper: RaphaelPaper) {
    return Matrix.vectorMult([[paper.width / (Point.BASE_DIST * 2 * Point.SCALE), 0], [0, paper.height /
    (Point.BASE_DIST * 2 * Point.SCALE)]], this.get2DCoords().map((num) => num + Point.BASE_DIST * Point.SCALE));
  }

  public draw(paper: RaphaelPaper) {
    const point2D = this.getPaperCoords(paper);
    paper.circle(point2D[0], point2D[1], 5);
  }

  public drawConnection(paper: RaphaelPaper, point: Point) {
    if (this.connections.includes(point)) {
      return;
    }
    if (this.distance(point) !== Point.BASE_DIST) {
      return;
    }
    this.addConnection(point);
    point.addConnection(this);

    const pathString = 'M' + this.getPaperCoords(paper).join(' ') + 'L' + point.getPaperCoords(paper).join(' ');
    paper.path(pathString);
  }

  public addConnection(point: Point) {
    this.connections.push(point);
  }
}
