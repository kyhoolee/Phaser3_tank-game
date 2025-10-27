# Phaser Tank Game Logic Review

## Overview
- Single-scene Phaser 3 project that randomises an arena on load and drops the player-controlled tank alongside props (barrels, crates) for reactive combat.
- Matter.js physics drives movement and collisions; `phaser3-rex-plugins` raycaster powers hitscan weapons and reflective projectiles.
- Visual polish comes from render-texture decals, animated particles, audio feedback, and camera shake during explosions.

## Scene Lifecycle (`src/index.js`)
- **Preload**: registers `phaser-webpack-loader` so asset packs defined in `src/assetManifest.js` can be streamed.
- **Create**: once assets resolve, configures animation sheets (`explosion`), camera framing, and a render texture used to paint persistent track and decal marks.
  - Picks random maze dimensions, fits the camera via `fitCameraToRect`, and instantiates `Maze` to build walls/pillars as Matter static bodies.
  - Spawns one controllable `Tank` (arrow keys + `Shift`), random barrels (explosive) and crates (pickups).
  - Populates a shared `Raycaster` with every solid body so lasers/shells can reflect correctly.
  - Lays down floor grime decals, primes particle systems, and wires the reset hotkey (`R`) plus responsive camera handling on resize.
- **Update**: displays FPS diagnostics and keeps raycaster obstacle representations synced to moving actors (tanks, barrels, crates).

## Procedural Maze (`src/objects/maze.js`)
- Maze is stored as a 2D grid of `Cell` objects with four wall flags; depth-first carving (`generate`) creates a solvable layout.
- `removeWalls` runs twice to punch additional openings, blending organic and grid-aligned pathways.
- `createWallObjects` materialises Matter `Wall` sprites along the right/bottom edges of each cell (with edge guards for top/left boundaries).
- `createPillarObjects` drops static `Pillar` bodies in corners where walls meet, ensuring the raycaster sees concave obstacles that block shots.

## Player Tank (`src/objects/tank.js`)
- Container that holds a sprite body, turret, and track imprint sprite; registered as a Matter body for movement.
- Reads keyboard input each frame to apply thrust (`thrustRight`) and torque, animating engine SFX pitch/volume based on motor load.
- Every few frames, stamps faded track marks onto the shared render texture, leaving persistent movement trails.
- Turret selection is currently `LaserTurret`; the fire key triggers the turret’s `fire` routine while movement continues independently.

## Weapons & Combat Systems
- **LaserTurret / Laser**: maintains a continuous aiming beam and spawns a short-lived firing beam that bounces off raycaster obstacles. Impacts trigger `Explosion` effects and particle bursts along the laser path.
- **Shell / StandardTurret / FatTurret**: projectile weapons (not currently enabled) use reflective shells with audio doppler effects and exhaust trails; collisions create explosions unless they strike walls immediately after spawn.
- **Explosion (`src/objects/explosion.js`)**: sensor sprite that applies radial knockback to collided bodies, chains into nearby barrels, and paints craters onto the floor texture while shaking the camera and emitting particles/audio.
- **Barrel (`src/objects/barrel.js`)**: Matter dynamic body that, when triggered by damage, animates, spawns a large explosion, drops an oil spill decal, and self-destructs.
- **Crate (`src/objects/crate.js`)**: pick-up that lerps into colliding tanks, plays a sound, and disappears (hook for future upgrades).
- **Trail (`src/objects/trail.js`)**: lightweight graphics helper for projectile contrails with fade-out over time.

## Supporting Systems
- **Raycaster upkeep**: every moving entity updates its obstacle primitive in `Scene.update`, keeping laser/shell reflections accurate frame-to-frame.
- **Render textures & decals**: both tanks and explosions draw sprites into `floorRenderTexture`, generating long-lived environmental wear without extra Matter bodies.
- **Audio layering**: engine idle loops, weapon effects, and ambient noises (laser hum, ricochet pings) auralise player feedback.
- **Input & reset**: keyboard mapping lives beside spawn logic, and pressing `R` disposes all inputs/audio/tweens before restarting the scene cleanly.

## Key Extension Points
- Swap turret class in `Tank` to enable shell-based weaponry or mix weapon types per tank.
- Hook crate collection to upgrade logic (e.g., change `Tank.tankTurret`).
- Introduce AI tanks by instantiating additional `Tank` objects with custom input controllers.
- Persist maze seed or expose RNG parameters for deterministic arenas.
