# Projection
This is an Angular web application that displays n-dimensional cubes, and allows animating rotation on any planes.

The live site can be found [here](https://aaronjenson.github.io/Projection/).

### How it works
The points for a cube are generated, then multiplied by a [rotation matrix](https://en.wikipedia.org/wiki/Rotation_matrix) for each rotation being applied. Each point is then converted to a 2d point, repeatedly applying a simple [perspective projection](https://en.wikipedia.org/wiki/3D_projection#Weak_perspective_projection). Using the projected points, each edge and vertex of the cube is then drawn.

This project is based off a Coding Challenge by The Coding Train, [4D Hypercube (aka "Tesseract")](http://thecodingtrain.com/CodingChallenges/113-hypercube.html), generalizing his project for any dimension.

Rendering is done using [Raphael](http://dmitrybaranovskiy.github.io/raphael/), the UI uses Angular-Material, and the whole page runs on Angular 6.

### Limitations
The current implementation has trouble drawing cubes in dimensions higher than about 5, and cannot create a cube above the 12th dimension. Performance issues exist in updating the sliders for each possible rotation, as well as some complex computations with large matrix multiplication.
