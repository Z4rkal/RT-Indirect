import SimplexNoise from 'simplex-noise';
import Alea from 'alea';

//Builds an elavation map using simplex-noise
function buildGrid(size) {
    var random = new Alea();
    const simplex = new SimplexNoise(random);

    function noise(nx, ny) {
        return ((simplex.noise2D(nx, ny) / 2) + 0.5);
    }

    let grid = [];

    //https://www.redblobgames.com/maps/terrain-from-noise/#demo used as an example
    for (let y = 0; y < size; y++) {
        grid[y] = [];
        for (let x = 0; x < size; x++) {
            let nx = x / size - 0.5, ny = y / size - 0.5;
            
            let e1 = 0.80,
                e2 = 0.45,
                e3 = 0.14,
                e4 = 0.07,
                e5 = 0.03,
                e6 = 0.01;

            let e = (e1 * noise(1 * nx, 1 * ny)
                + e2 * noise(2 * nx, 2 * ny)
                + e3 * noise(4 * nx, 4 * ny)
                + e4 * noise(8 * nx, 8 * ny)
                + e5 * noise(16 * nx, 16 * ny)
                + e6 * noise(32 * nx, 32 * ny)) / (e1 + e2 + e3 + e4 + e5 + e6);
            grid[y][x] = Math.pow(e, 1.38);
        }
    }

    return grid;
}

/* Values that I had initially, for memory/reference
let e = (0.39 * noise(1 * nx, 1 * ny)
    + 0.24 * noise(2 * nx, 2 * ny)
    + 0.17 * noise(4 * nx, 4 * ny)
    + 0.11 * noise(8 * nx, 8 * ny)
    + 0.06 * noise(16 * nx, 16 * ny)
    + 0.03 * noise(32 * nx, 32 * ny));
grid[y][x] = Math.pow(e, 1.5);
*/

module.exports = buildGrid;