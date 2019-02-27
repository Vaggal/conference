var express = require('express'),
    expressSocketApp = express(),
    expressWebApp = express(),
    socketio = require('socket.io'),
    http = require('http'),
    socketServer = http.createServer(expressSocketApp),
    webServer = http.createServer(expressWebApp),
    uuid = require('uuid'),
    path = require('path'),
    rooms = {},
    userIds = {},
    votes = {}; // TODO: votes should handle multiple rooms

expressSocketApp.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
expressWebApp.use(express.static(__dirname + '/../public'));

expressWebApp.get('/room', function (request, response) {
    response.sendFile(path.resolve(__dirname, '..\\public\\index.html'));
});

expressWebApp.get('/room/:roomId', function (request, response) {
    response.sendFile(path.resolve(__dirname, '..\\public\\index.html'));
});

exports.run = function (config) {
    webServer.listen(80, () => {
        console.log('Web Server Listening on', 80);
    });

    socketServer.listen(config.PORT, () => {
        console.log('Socket Server Listening on', config.PORT);
    });

    socketio.listen(socketServer, {
        log: false
    }).on('connection', function (socket) {
        // The use of 'fn' callback is explained here: https://socket.io/docs/#Sending-and-getting-data-acknowledgements
        // These events are emitted by the client code that we have written
        var currentRoom, id;

        socket.on('init', function (data, fn) {
            currentRoom = (data || {}).room || uuid.v4();
            var room = rooms[currentRoom];

            if (!data) {
                rooms[currentRoom] = [socket];
                id = userIds[currentRoom] = 0;
                votes[id] = 0;
                fn(currentRoom, id); // It returns as an ack the room and user id to the client

                console.log('Room created, with #', currentRoom);
            } else {
                if (!room) {
                    return;
                }
                userIds[currentRoom] += 1;
                id = userIds[currentRoom];
                votes[id] = 0;
                fn(currentRoom, id); // It returns as an ack the room and user id to the client

                emitConnectionEvent(room);
                room[id] = socket;
                emitVotesUpdateEvent(room);

                console.log('Peer connected to room', currentRoom, 'with #', id);
            }
        });

        socket.on('msg', function (data) {
            var to = parseInt(data.to, 10);
            // TODO: how do we now the current room here?
            if (rooms[currentRoom] && rooms[currentRoom][to]) {
                console.log('Redirecting message to', to, 'by', data.by);
                rooms[currentRoom][to].emit('msg', data);
            } else {
                console.warn('Invalid user');
            }
        });

        socket.on('votes.increment', function(user){
            votes[user.id]++;
            emitVotesUpdateEvent(rooms[currentRoom]);
        });

        socket.on('disconnect', function () {
            if (!currentRoom || !rooms[currentRoom]) {
                return;
            }
            console.log('Peer disconnected from room', currentRoom);

            delete rooms[currentRoom][rooms[currentRoom].indexOf(socket)];
            // TODO: If all peers have disconnected from a room, delete whole room
            rooms[currentRoom].forEach(function (socket) {
                if (socket) {
                    socket.emit('peer.disconnected', {
                        id: id
                    });
                }
            });
        });

        function emitConnectionEvent(room) {
            room.forEach(function (socket) {
                socket.emit('peer.connected', {
                    id: id
                });
            });
        }

        function emitVotesUpdateEvent(room) {
            room.forEach(function (socket) {
                socket.emit('votes.update', votes);
            });
        }
    });
};