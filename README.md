### Project Description:

This project was built as an attempt to kill time during a slow week. I wanted to build a simple little sandbox for testing out and visualizing some math for placing missed mortar shots and generating smooth arcs for them for the [Roguetech](https://github.com/BattletechModders/RogueTech) mod \(Nexus Page: [Link](https://www.nexusmods.com/battletech/mods/79?tab=description)\), as when I started writing this missed mortar shots tended to land right in front of the mech/turret/vehicle that fired them, often damaging defense objectives when used by the AI.

I'm not planning on actually doing anything with this code, as [@LadyAlekto](https://github.com/LadyAlekto) and her team are far more powerful than I and have probably already fixed this while I wasn't looking. I'm also not familiar enough with C# or the Battletech codebase to modify their code on my own at the moment, but I thought this would be a fun distraction to make and it was.

I highly recommend checking out Roguetech if you've played Harebrained Schemes' [Battletech](http://battletechgame.com/), if you play or used to play the Battletech table-top game, or even if you've never heard of Battletech but enjoy turn based strategy games. Lady Alekto and crew have done an incredible job of expanding on the core game and their mod is really something special.

#
#### Algorithm Details:

The webapp lets the user place a start point and target for the projectile on a bird's eye view of the 'map' it generates, then when the user clicks the fire button the algorithm calculates a max error radius based on the distance to target, and rolls the shot.

If the shot misses, the error radius is calculated by multiplying the max error radius by one minus the ratio between the roll and the toHit percentage:

```
let error = maxError * (1 - (roll / toHit));
```

Then the landing point is placed at a random point on that circle:

```
let bX = x2 + Math.cos(ø) * error;
let bY = y2 + Math.sin(ø) * error;
```

Once the simulator has calculated the landing point,
the horizon view component calculates the angle for the shot and the time to land and then uses those to values to draw an arc from the 
shooter to the destination.

#
#### Map Details

![Example Screenshot](/screenshots/North.png?raw=true)

The 'map' is generated using a simplex noise function; it's a two dimensional array of values between 0 and 1 that represent the elevation at each point, and it's drawn onto two svgs: the horizon view and the bird's eye view. 

The bird's eye view simply draws rectangles to represent each point on the noise map. It's always drawn with north at the top, and it's fairly simple.

The horizon view draws a bunch of paths from most distant to closest, where the horizontal value of each point on the path is based on the direction of the horizon view \(North, East, etc.\), and the vertical value is the value of that point on the noise map. The more distant paths have a lighter color \(which gets a bit too light towards the back\), and the closer paths have a darker color.

This creates a nice illusion of a 3D landscape, and it turned out way cooler than I expected. When I first got it working I ended up spending a long time just clicking the regenerate button to see what kind of images it could create.

It's a pretty inefficient way of drawing things since it needs to loop through a 100x100 array multiple times to calculate all the values and then draw well over a thousand svg elements, but it serves the project's purposes and I'm proud of how it turned out.

#
### Setup

If you'd like to run the project on your own machine and play around with it, you can clone the repository from your command line with:

`git clone https://github.com/Z4rkal/RT-Indirect`

You'll need to have NodeJS installed and Node Package Manager; once you do, run `npm install` in the project directory to download the dependencies, and then run `npm run build && npm start` to build and launch the project.

The server will listen on port 3000, so you can access the web app in your browser at `http://localhost:3000`.
