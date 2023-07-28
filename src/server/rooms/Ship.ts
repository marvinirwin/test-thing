import {Schema, type, MapSchema, ArraySchema} from "@colyseus/schema";
import {Body, Engine} from 'matter-js';
import {uniqueId, round} from "lodash";

export class SchemaMatterSquare extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") width: number;
    @type("number") height: number;
    b: Body;
    @type("string") _uid: string;
    constructor(b: Body) {
        super();
        this._uid = uniqueId();
        this.b = b;
        this.x = this.b.position.x;
        this.y = this.b.position.y;
        const { min, max } = b.bounds;
        this.width = max.x - min.x;
        this.height = max.y - min.y;
    }

    refresh() {
        let x1 = round(this.b.position.x, 1);
        if (this.x !== x1) {
            console.log('change')
            this.x = x1;
        }
        let y1 = round(this.b.position.y, 1);
        if (this.y !== y1) {
            this.y = y1;
        }
    }
}

export class ShipPlayer extends SchemaMatterSquare {
    @type("string") name: string;
    @type("number") health: number;
    @type("number") experience: number;
    @type(["string"]) upgrades: string[];
}


export class Wall extends SchemaMatterSquare {
    constructor(b: Body) {
        super(b);
    }
}
export class Projectile extends SchemaMatterSquare {
    constructor(b: Body) {
        super(b);
    }
}

export class ShipRoom extends SchemaMatterSquare {
    topWall: Wall;
    bottomWall: Wall;
    leftWall: Wall;
    rightWall: Wall;

    constructor(b: Body) {
        super(b);
    }
}

export class Ship extends Schema {
}
