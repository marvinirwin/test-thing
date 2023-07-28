import {client} from "../utils/networking";
import {Room} from "colyseus.js";
import {State} from "../../server/rooms/State";
import {ShipPlayer, ShipRoom, Wall} from "../../server/rooms/Ship";
import * as THREE from 'three';
import {Mesh} from 'three';

let room: Room<State>;


const WIDTH = 800;
const HEIGHT = 600;
// Set some camera attributes.
const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;
// Get the DOM element to attach to
const container =
    document.querySelector('#container');

const scene = new THREE.Scene();
/*var camera = new THREE.OrthographicCamera(WIDTH / -2, WIDTH / 2, HEIGHT / 2, HEIGHT / -2, 1, 10000);*/

// Create a WebGL renderer, camera
// and a scene
const renderer = new THREE.WebGLRenderer();
// TODO change this to orthographic camera
const camera =
    new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    );

scene.add(camera);

camera.position.set(0, 150, 400);
camera.lookAt(scene.position);

renderer.setSize(WIDTH, HEIGHT);
renderer.domElement.setAttribute('tabindex', "1000");

container.appendChild(renderer.domElement);

export async function showGameplay() {
    room = await client.joinOrCreate("default", {
        nickname: (document.getElementById('username') as HTMLInputElement).value
    });

    function makeSquare(x, y, width, height, color = 0xabcdef): THREE.Mesh {
        var geometry = new THREE.PlaneGeometry(width, height, 32);
        var material = new THREE.MeshBasicMaterial({color, side: THREE.DoubleSide});
        var plane = new THREE.Mesh(geometry, material);
        plane.position.set(x, y, 0);
        scene.add(plane);
        console.log(x, y);
        return plane;
    }

    const objMeshMap: Map<string, THREE.Mesh> = new Map();

    let renderCount = 0;

    function render() {
        renderCount++;
        let debugInfo = [];
        for (let id in room.state.rooms) {
            const shipRoom: ShipRoom = room.state.rooms[id];
            let m: Mesh = objMeshMap.get(shipRoom._uid);

            if (m) {
            } else {
                objMeshMap.set(
                    shipRoom._uid,
                    m = makeSquare(shipRoom.x, shipRoom.y, shipRoom.width, shipRoom.height)
                );
            }
            debugInfo.push('room: ' + m.position.x + ' ' + m.position.y);
        }

        let me: Mesh = undefined;
        for (let id in room.state.players) {
            const p: ShipPlayer = room.state.players[id];
            let m: Mesh = objMeshMap.get(p._uid);
            if (m) {
                m.position.set(p.x, p.y, m.position.z);
            } else {
                objMeshMap.set(p._uid, m = makeSquare(p.x, p.y, p.width, p.height, 0xabcabca));
            }
            if (!me) {
                me = m;
            }
            debugInfo.push('player: ' + m.position.x + ' ' + m.position.y);
        }
        for (let id in room.state.walls) {
            const wall: Wall = room.state.walls[id];
            let m: Mesh = objMeshMap.get(wall._uid);
            if (m) {
            } else {
                objMeshMap.set(
                    wall._uid,
                    m = makeSquare(wall.x, wall.y, wall.width, wall.height, 0xffffff)
                );
            }
            debugInfo.push('wall: ' + m.position.x + ' ' + m.position.y);
        }
        for (let id in room.state.projectiles) {

        }

        if (me) {
            camera.position.set(me.position.x, me.position.y, camera.position.z);
        }
        debugInfo.push('renderCount: ' + renderCount);

        document.getElementById('info').innerText = debugInfo.join('\n');
        renderer.render(scene, camera);
    }

    let meMesh: THREE.Mesh;
    // Assume the first render has us as the player
    room.state.players.onChange = (player: ShipPlayer, key: string) => {
        // For each player create a new player and render?
        // Yeah why not
        render();
    };


    room.state.onChange = (changes) => {

    };

    /*    room.state.paths.onAdd = function (path, index) {
        };*/

    room.onMessage((message) => {
    });
    // room.onStateChange.once(() => gameplay.classList.remove('loading'));
    // Should we have the players be separate from the room?
    // No I don't think so?  Each frame should be delivered with full coordinates, cause im lazy
}

function checkRoom() {
    return (room);
}


setInterval(() => {
    let anies = Object.entries(keys).filter(([k, v]) => v);
    anies.map(([k, v]) => {
        switch(k) {
            case "w":
            case "a":
            case "s":
            case "d":
                room.send(k);
        }
    })
}, 100);
let keys = {};
renderer.domElement.addEventListener("keyup", (e: KeyboardEvent) => {
    if (!checkRoom()) return;
    keys[e.key] = 0;
});
renderer.domElement.addEventListener("keydown", (e: KeyboardEvent) => {
    if (!checkRoom()) return;

    keys[e.key] = 1;


    // room.send(['s', point, color, brush]);
    // The first element is the command
    // All the rest is data?
    // Yeah it's all hardcoded
    // So I'll just send buttons
    // How come i can't insert KeyboardEvent
    /*    room.send(e.key);*/

    /*    clearCanvas(prevCtx);*/
    return;

    /*    isDrawing = true;
        points = [];
        points.push(...point);*/
});

/*export function hideGameplay() {
    gameplay.classList.add('hidden');
}*/

/*
ctx.lineWidth = 1;
ctx.lineJoin = ctx.lineCap = 'round';

var isDrawing, color = 0x000000, brush = DEFAULT_BRUSH, points = [];
*/


/*prevCanvas.addEventListener("mousedown", (e) => startPath(e.offsetX, e.offsetY));
prevCanvas.addEventListener("mousemove", (e) => movePath(e.offsetX, e.offsetY));
prevCanvas.addEventListener("mouseup", (e) => endPath());

prevCanvas.addEventListener("touchstart", (e) => {
    var rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();
    var x = e.touches[0].pageX - (rect.left - bodyRect.left);
    var y = e.touches[0].pageY - (rect.top - bodyRect.top);
    return startPath(x, y);
});
prevCanvas.addEventListener("touchmove", (e) => {
    var rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();
    var x = e.touches[0].pageX - (rect.left - bodyRect.left);
    var y = e.touches[0].pageY - (rect.top - bodyRect.top);
    movePath(x, y)
});
prevCanvas.addEventListener("touchend", (e) => endPath());*/

/**
 * Tools: colorpicker
 */
/*gameplay.querySelector('.colorpicker').addEventListener("change", (e) => {
    color = parseInt("0x" + (e.target as HTMLInputElement).value);
});*/

/**
 * Tools: brush
 */
/*Array.from(document.querySelectorAll('input[type=radio][name="brush"]')).forEach(radioButton => {
    radioButton.addEventListener('change', (e) => {
        brush = (e.target as HTMLInputElement).value as BRUSH;
    });
});*/

/*function startPath(x, y) {
    if (!checkRoom()) {
        return;
    }

    const point = [x, y];
    room.send(['s', point, color, brush]);

    clearCanvas(prevCtx);

    isDrawing = true;
    points = [];
    points.push(...point);
}*/

/*function movePath(x, y) {
    if (!checkRoom()) {
        return;
    }
    if (!isDrawing) {
        return;
    }

    const point = [x, y];
    room.send(['p', point]);

    points.push(...point);
    brushFunctions[brush](prevCtx, color, points, true);
}*/

/*function endPath() {
    room.send(['e']);

    isDrawing = false;
    points.length = 0;

    clearCanvas(prevCtx);
}*/


/*function millisecondsToStr(_seconds) {
    let temp = _seconds;
    const years = Math.floor(temp / 31536000),
        days = Math.floor((temp %= 31536000) / 86400),
        hours = Math.floor((temp %= 86400) / 3600),
        minutes = Math.floor((temp %= 3600) / 60),
        seconds = temp % 60;

    if (days || hours || seconds || minutes) {
        return (years ? years + "y " : "") +
            (days ? days + "d " : "") +
            (hours ? hours + "h " : "") +
            (minutes ? minutes + "m " : "") +
            seconds + "s";
    }

    return "< 1s";
}*/
/*chatEl.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = chatEl.querySelector('input[type=text]') as HTMLInputElement;
    room.send(['chat', input.value]);
    input.value = "";
});*/

/*gameplay.querySelector('.info a').addEventListener("click", (e) => {
    e.preventDefault();

    if (room) {
        room.leave();
    }

    location.hash = "#";
});*/

/*  room.state.players.onAdd = (player, sessionId) => {
    const playerEl = document.createElement("li");

/!*    if (sessionId === room.sessionId) { playerEl.classList.add('you'); }*!/

    playerEl.innerText = player.name;
    playerEl.id = `p${sessionId}`;
    peopleEl.appendChild(playerEl);
  }*/
/*    room.state.players.onRemove = (player, sessionId) => {
        const playerEl = peopleEl.querySelector(`#p${sessionId}`);
        peopleEl.removeChild(playerEl);
    };*/
/*        changes.forEach(change => {
            if (change.field === "countdown") {
/!*                countdownEl.innerHTML = (change.value > 0)
                    ? millisecondsToStr(change.value)
                    : "Time is up!";*!/
            }
        });*/
/*        brushFunctions[path.brush](ctx, path.color, path.points, false);*/
/*        const [cmd, data] = message;
        if (cmd === "chat") {
            const message = document.createElement("li");
            message.innerText = data;
            chatMessagesEl.appendChild(message);
            chatEl.scrollTop = chatEl.scrollHeight;
        }*/
