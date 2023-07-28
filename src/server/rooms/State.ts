import {Schema, type, MapSchema} from "@colyseus/schema";
import {Projectile, SchemaMatterSquare, Ship, ShipPlayer, ShipRoom, Wall} from './Ship';
import {Bodies, Engine} from 'matter-js';
import {createRectangle} from "./DrawingRoom";

function getSquareBody(x, y) {
    return Bodies.rectangle(0, 0, x, y, {});
}

export class State extends Schema {
    @type("string") name: string;
    @type({map: ShipPlayer}) players = new MapSchema<ShipPlayer>();
    @type({map: ShipRoom}) rooms = new MapSchema<ShipRoom>();
    @type({map: Wall}) walls = new MapSchema<Wall>();
    @type({map: Projectile}) projectiles = new MapSchema<Projectile>();
    createPlayer(e: Engine, sessionId: string) {
        this.players[sessionId] = new ShipPlayer(createRectangle(e, 50, 50));
        this.players[sessionId].x = 0;
        this.players[sessionId].y = 0;
        return this.players[sessionId];
    }

    removePlayer(sessionId: string) {
        delete this.players[sessionId];
    }
}
