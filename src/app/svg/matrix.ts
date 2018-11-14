export class Matrix {
  /**
   * Transforms point by given matrix
   * @param matrix matrix with output dimension rows and input point dimension columns
   * @param point input point
   * @return number[] point with [matrix rows] dimensions
   */
  public static vectorMult(matrix: number[][], point: number[]) {
    if (matrix.length === 0 || matrix[0].length !== point.length) {
      throw new Error('matrix/point dimensions invalid');
    }

    const output = [];

    for (let i = 0; i < matrix.length; i++) {  // row
      let sum = 0;
      for (let j = 0; j < point.length; j++) { // col
        sum += matrix[i][j] * point[j];
      }
      output.push(sum);
    }
    return output;
  }

  /**
   * Multiplies two matrices using dot product
   * @param matrix1 first matrix
   * @param matrix2 second matrix
   */
  public static mult(matrix1: number[][], matrix2: number[][]) {
    if (matrix1.length === 0 || matrix2.length === 0 || matrix1[0].length !== matrix2.length) {
      throw new Error('matrix dimensions invalid');
    }
    const output = [];

    for (let i = 0; i < matrix1.length; i++) {
      output.push([]);
      for (let j = 0; j < matrix2[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < matrix2.length; k++) {
          sum += matrix1[i][k] * matrix2[k][j];
        }
        output[i].push(sum);
      }
    }

    return output;
  }

  /**
   * Creates matrix from the columns given
   * @param vectors columns of matrix
   * @return number[][] matrix
   */
  public static from(...vectors: number[][]) {
    const output = [];
    for (let i = 0; i < vectors[0].length; i++) {
      output.push([]);
      for (let j = 0; j < vectors.length; j++) {
        output[i].push(vectors[j][i]);
      }
    }
    return output;
  }

  /**
   * Turns rows into columns
   * @param mat matrix
   * @return number[][] matrix
   */
  public static flip(mat: number[][]) {
    return Matrix.from(...mat);
  }
}
