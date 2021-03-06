let worklist = require('models').worklist;

function bulldozeRoom(roomName) {
    let room = Game.rooms[roomName];
    if (room === undefined) {
        console.log(`CLI: No room with name ${roomName}.`);
        return;
    }

    room.find(FIND_MY_STRUCTURES)
        .filter(structure => [STRUCTURE_LINK, STRUCTURE_TOWER, STRUCTURE_EXTENSION].includes(structure.structureType))
        .forEach(structure => structure.destroy());

    room.find(FIND_MY_CONSTRUCTION_SITES)
        .forEach(structure => structure.remove());

    room.find(FIND_STRUCTURES)
        .filter(structure => structure.structureType === STRUCTURE_ROAD)
        .forEach(structure => structure.destroy());

    Memory.architect = Memory.architect || {};
    Memory.architect.maps = {};
    Memory.architect.buildLists = {};

    worklist.add('architecture', 'create-maps');


    console.log("CLI: Room structures have been destroyed.");
}

module.exports = bulldozeRoom;
