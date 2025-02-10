// Endless Runner
// Name: Josh Gioffre
// Date: 1/13/25

// Around 6-8 hours spent

// Creative Tilt - One mechanic I haven't really seen with endless runners is the ability to change the difficulty
// while you're actively playing the game. I decided to make this mechanic using the ship's engine, where going faster
// rewards the player with more points.

"use strict"

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [MainMenu, Play]
}

let game = new Phaser.Game(config)

let PLAYER_DRAG = 10;
let PLAYER_MAX_DRAG = 700;
let PLAYER_MAX_ROT = 90;
let PLAYER_ROT_SPEED = 9;
let PLAYER_FLYSPEED = 20;
let PLAYER_MOVESPEED = 10;
let PLAYER_MAX_FUEL = 10000;

let GAME_SPEED = [2, 4, 6, 8, 10];
let BLOCK_SPEED = [10, 15, 20, 35, 60];
let ENGINE_RATE = [0.6, 0.8, 1, 1.2, 1.4];

let KEY_ENGINE_UP, KEY_ENGINE_DOWN, KEY_RESET, KEY_MENU, KEY_START;

// story of game - you are a byte packet traveling through the internet trying to reach your destination.
// Starts off with a computer command being typed into a command line "GET /index.html HTTP/1.1/"
// Then the command is entered and your player is fired out onto the screen

// Controls - SPACE/MOUSE1 To fly
//            W, S To adjust speed (faster uses less power)
// Power pickups become less common as time goes on