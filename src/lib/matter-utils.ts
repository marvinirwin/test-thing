import * as Matter from 'matter-js';
import {ShipPlayer, ShipRoom, Wall} from "../server/rooms/Ship";

var Engine = Matter.Engine;
var Events = Matter.Events;
var World = Matter.World;
var Body = Matter.Body;
var Bodies = Matter.Bodies;

export function createWalls(e: Matter.Engine, r: ShipRoom) {
    const wallWidth = 10;
    // all calculations in this function are done assuming 0,0 is the center of the room
    r.leftWall = createWall(
        e,
        r.x - (r.width / 2),
        r.y,
        10,
        r.height
    );
    r.rightWall = createWall(
        e,

        r.x - (r.width / 2),
        r.y,
        10,
        r.height
    );
    r.topWall = createWall(
        e,
        r.x,
        r.y + (r.height / 2),
        r.width,
        10
    );
    r.bottomWall = createWall(
        e,
        r.x,
        r.y - (r.height / 2),
        r.width,
        10
    );
    return;
}

export function createCircle(e: Matter.Engine, p: ShipPlayer) {
    var body = Bodies.circle(p.x, p.y, 5);

    body.mass = 100;
    body.frictionAir = 0.15;

    body.render.fillStyle = '#79f';
    body.render.strokeStyle = body.render.fillStyle;
    World.add(e.world, [body]);
    return body;
}

export function createWall(e: Matter.Engine, x, y, w, h) {
    var body = Bodies.rectangle(x, y, w, h, {isStatic: true});
    body.render.fillStyle = '#f77';
    body.render.strokeStyle = body.render.fillStyle;
    World.add(e.world, [body]);
    return new Wall(body);
}

