import {Point} from './point';
import {Rotation} from './rotation';

export class Cube {
  dimension: number;
  points: Point[];
  pointSet: RaphaelSet;
  lineSet: RaphaelSet;

  constructor(dim: number) {
    this.setDimensions(dim);
  }

  public setDimensions(dim: number) {
    this.dimension = dim;
    this.points = [new Point()];
    for (let i = 1; i <= dim; i++) {
      this.addDimension();
    }
  }

  private addDimension() {
    const self = this;
    self.points.forEach((point) => {
      self.points.push(point.from());
    });
    self.points.forEach((point, i) => {
      point.addDimension(i < this.points.length / 2 ? Point.COORD_ONE : Point.COORD_TWO);
    });
  }

  public draw(paper: RaphaelPaper, rotations: Rotation[]) {
    const self = this;
    paper.setStart();
    self.points.forEach((point: Point) => {
      point.draw(paper, rotations);
    });
    self.pointSet = paper.setFinish();

    paper.setStart();
    self.points.forEach((point: Point) => {
      point.resetConnections();
    });
    self.points.forEach((point1: Point) => {
      self.points.forEach((point2: Point) => {
        if (point1.distance(point2) === Point.BASE_DIST) {
          point1.drawConnection(paper, point2, rotations);
        }
      });
    });
    self.lineSet = paper.setFinish();
  }
}
