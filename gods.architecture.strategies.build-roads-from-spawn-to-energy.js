let mappingHelpers = require('mapping.helpers');

function run(room, structureMap, buildList) {
    let spawns = room.find(FIND_MY_SPAWNS);
    let sources = room.find(FIND_SOURCES);

    spawns.forEach(spawn => {
        sources.forEach(source => {
            let obstacles = mappingHelpers.find(
                structureMap,
                tile => tile !== 0 && tile.type !== STRUCTURE_ROAD && tile.type !== STRUCTURE_WALL);

            let avoid = obstacles.map(o => new RoomPosition(o.x, o.y, room.name));

            let path = room.findPath(
                spawn.pos,
                source.pos,
                {
                    ignoreCreeps: true,
                    ignoreRoads: true,
                    costCallback: (roomName, costMatrix) => {
                        avoid.forEach(location => costMatrix.set(location.x, location.y, 255));
                    }
                });

            for (let i = 0; i < path.length; i++) {
                let location = path[i];

                if (!mappingHelpers.isObstacle(structureMap[location.y][location.x])) {
                    structureMap[location.y][location.x] = {
                        type: STRUCTURE_ROAD,
                        state: 'planned'
                    };

                    buildList.push({
                        type: STRUCTURE_ROAD,
                        pos: {
                            x: location.x,
                            y: location.y
                        }
                    });
                }
            }
        });
    });
}

module.exports = {
    run: run
};
