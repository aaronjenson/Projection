# Projection
This is an Angular web application that displays n-dimensional cubes, and allows animating rotation on any planes.

The live site can be found [here](https://aaronjenson.github.io/Projection/).

### How it works
The points for a cube are generated, then multiplied by a [rotation matrix](https://en.wikipedia.org/wiki/Rotation_matrix) for each rotation being applied.
Each point is then converted to a 2d point, repeatedly applying a simple [perspective projection](https://en.wikipedia.org/wiki/3D_projection#Weak_perspective_projection).
Points are then drawn, and each pair of points located one unit away from each other is connected (this is equivalent to connecting each vertex).

This project is based off a Coding Challenge by The Coding Train, [4D Hypercube (aka "Tesseract")](http://thecodingtrain.com/CodingChallenges/113-hypercube.html),
and just generalizes this approach for any dimension.

Rendering is done using [Raphael](http://dmitrybaranovskiy.github.io/raphael/), the UX uses Angular-Material, and the whole page runs on Angular 6.

### Limitations
The current implementation has trouble drawing cubes in dimensions higher than about 5, and cannot even create a cube above the 12th dimension.
This is partly because each point currently calculates its rotations and projection multiple times for each frame.

### Local development instructions
Requires node / npm to be installed. After cloning, run `npm install` to install dependencies. Now run `ng serve`,
and any code changes you make will automatically be compiled, and your page will be refreshed. If you've forked this code,
`ng deploy` will publish the site to the gh-pages branch of your repository, though this will only work correctly if you
change the urls in package.json and in various locations in the html.
