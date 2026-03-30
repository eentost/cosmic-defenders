# Cosmic Defenders

🎮 A creative arcade-style shooting game with wave-based enemy spawning, strategic power-ups, and progressive difficulty curves.

## Features

✨ **Wave-Based Combat System**
- Enemies spawn in waves with increasing complexity
- Each wave introduces new enemy types and patterns
- Boss encounters at specific wave milestones

🔋 **Strategic Power-Up System**
- Shield Generator: Temporary invulnerability
- Rapid Fire: Increased fire rate for 15 seconds
- Spread Shot: Fire multiple projectiles simultaneously
- Time Slow: Reduces enemy speed by 50%
- Health Recovery: Restore lost health points

⚡ **Dynamic Difficulty Progression**
- Enemy speed increases gradually
- Fire rate and projectile count increases per wave
- New enemy behaviors unlock at higher waves
- Score multiplier increases with wave number

🎯 **Game Mechanics**
- WASD or Arrow Keys: Movement
- Mouse or Space: Shoot
- P: Pause game
- Collect power-ups for tactical advantages
- Survive waves to earn high scores

## Score System

- Basic Enemy Kill: 100 points
- Special Enemy Kill: 250 points
- Boss Defeat: 1000 points
- Wave Complete Bonus: 500 * wave_number
- Combo Multiplier: +10% for each consecutive hit

## Game Modes

**Endless Mode**: Survive as many waves as possible
**Challenge Mode**: Complete 20 waves
**Boss Rush**: Face only boss enemies

## Technologies

- HTML5 Canvas for rendering
- Vanilla JavaScript (no frameworks)
- Pure CSS for UI
- Web Audio API for sound effects

## How to Play

1. Open `index.html` in a modern web browser
2. Click "Start Game"
3. Defeat enemies and collect power-ups
4. Survive waves to progress
5. Aim for the highest score!

## Installation

No installation required! Simply clone this repository and open the game file in your browser.

```bash
git clone https://github.com/eentost/cosmic-defenders.git
cd cosmic-defenders
open index.html
```

## File Structure

```
cosmic-defenders/
├── index.html          # Main game file
├── game.js             # Game logic
├── player.js           # Player class
├── enemy.js            # Enemy classes
├── powerup.js          # Power-up system
├── style.css           # Game styling
├── audio/              # Sound effects
└── README.md           # This file
```

## Controls

| Key | Action |
|-----|--------|
| W / ↑ | Move Up |
| A / ← | Move Left |
| S / ↓ | Move Down |
| D / → | Move Right |
| Space / Mouse | Shoot |
| P | Pause/Resume |
| ESC | Quit to Menu |

## Tips & Tricks

- 💡 Keep moving to avoid enemy projectiles
- 💡 Prioritize collecting shield generators early
- 💡 Use spread shot for crowd control
- 💡 Time slow helps with boss patterns
- 💡 Combo kills multiply your score

## License

MIT License - Feel free to use and modify for your own projects!

## Author

eentost - [@eentost](https://github.com/eentost)
