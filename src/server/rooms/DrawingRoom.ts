import {Room, Client} from "colyseus";
import {State} from "./State";
import {generateName} from "../utils/name_generator";
import {Ship, ShipPlayer, ShipRoom} from "./Ship";
import {MapSchema} from "@colyseus/schema/lib/types/MapSchema";
import * as Matter from 'matter-js';
import {createWalls} from "../../lib/matter-utils";
import {Bodies, Body, Engine, World} from "matter-js";

export function createRectangle(e: Engine, width= 200, height = 200) {
    let body = Bodies.rectangle(0, 0, width, height, {isStatic: true});
    World.add(e.world, [body]);
    return body;
}

export class DrawingRoom extends Room<State> {
    engine: Matter.Engine;

    createRooms(): MapSchema<ShipRoom> {
        const rooms = new MapSchema<ShipRoom>();
        var body = createRectangle(this.engine);
        rooms[0] = new ShipRoom(body);
        let room: ShipRoom = rooms[0];
        createWalls(this.engine, room);
        this.state.walls[room.bottomWall._uid] = room.bottomWall;
        this.state.walls[room.topWall._uid] = room.topWall;
        this.state.walls[room.rightWall._uid] = room.rightWall;
        this.state.walls[room.leftWall._uid] = room.leftWall;
        return rooms;
    }

    onCreate(options) {
        this.setState(new State());
        this.engine = Engine.create({});
        this.state.rooms = this.createRooms();
        // Disable gravity
        this.engine.world.gravity.y = 0;
        let lastTime = new Date();
        setInterval(() => {
            let now = new Date();
            // @ts-ignore
            let diff = lastTime - now;
            Engine.update(this.engine, diff);
            lastTime = now;
        }, 10);
        setInterval(() => {
            for (let id in this.state.players) {
                const p: ShipPlayer = this.state.players[id];
                p.refresh();
            }
        }, 10);
    }

    onJoin(client: Client, options: any) {
        const player = this.state.createPlayer(this.engine, client.sessionId);
        player.name = options.nickname || generateName();
        const room = this.state.rooms[0];
    }

    onMessage(client: Client, charCode: string) {
        /*      console.log(client.sessionId);*/
        const player: ShipPlayer = this.state.players[client.sessionId];
        /*    const [command, data] = message;*/

        function movePlayer(x, y) {
            let force = {x, y};
            console.log(force);
            Body.applyForce(player.b, player.b.position, force);
        }

        function createProjectile(startPosition, destination, speed, airResist) {

        }
        let o = {x: 0, y: 0};

        switch (charCode) {
            case "a":
                o.x -= 5;
                break;
            case "s":
                o.y -= 5;
                break;
            case "d":
                o.x += 5;
                break;
            case "w":
                o.y += 5;
                break;
        }
        console.log(player.b, player.b.position);
        Body.applyForce(player.b, player.b.position, o);

/*        switch (charCode) {
            case "a":
                movePlayer(-5, 0);
                break;
            case "s":
                movePlayer(0, -5);
                break;
            case "d":
                movePlayer(5, 0);
                break;
            case "w":
                movePlayer(0, 5);
                break;
            case "e":
                // How do we get the orientation of a body?
                // createProjectile(player.body.position, );
                break;
        }*/
        return;
    }

    onLeave(client: Client) {
        this.state.removePlayer(client.sessionId);
    }
}
