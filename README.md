# Tank Game 🕹️
A fun little Tank Game made with Phaser 

<div align="center">
<img src="https://user-images.githubusercontent.com/34353377/192890110-9cf31dbd-0336-4473-83e8-05ffb96a1bd0.png" width="100%%"/>

<img src="https://user-images.githubusercontent.com/34353377/192890105-ec844350-889c-4b33-906a-562a4bb43db0.png" width="100%"/>
</div>

## How to Play

| Input | Action | Notes |
| ----- | ------ | ----- |
| `↑` | Drive forward | Hold to build momentum; tank keeps rolling via Matter physics. |
| `↓` | Drive in reverse | Useful for braking or backing out of tight alleys. |
| `← / →` | Pivot chassis | Applies torque, letting you swing the turret body before shooting. |
| `Shift` | Fire turret | Fires the laser instantly on key press; beam can ricochet off walls and pillars. |
| `R` | Restart scene | Flushes audio, tweens, and key bindings, then rolls a fresh maze. |

All bindings are defined when the player tank is spawned in `src/index.js`; switch to other keys or add gamepad listeners there if needed.

## Here are some buzzwords that have something to do with this repo:

- Phaser 3
- WebGL
- webpack
- Kenney
- npm
- ESLint
- Prettier

## The game is WIP. I plan on implementing multiplayer using Peer.js

[![forthebadge](https://forthebadge.com/images/badges/powered-by-electricity.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/oooo-kill-em.svg)](https://forthebadge.com)
