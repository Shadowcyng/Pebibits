const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const server = http.createServer(app);
const socketio = require('socket.io');
app.use(cors());
const io = socketio(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 5000;

app.use(bodyParser());

// functions
const { users, isValidUser, getUserByToken } = require('./user');
const socketConnections = [];
var currentSongIdx = 0;
var activeAt = null;
io.on('connection', (socket) => {
	socket.on('join', () => {
		console.log('Join');
		socketConnections.push(socket.id);
		socket.emit('event', {
			type: 'init',
			songIndex: currentSongIdx,
			activeAt: activeAt,
		});
	});
	socket.on('disconnect', () => {
		console.log('disconnect');
		socketConnections.forEach((itm, idx) => {
			if (itm == socket.id) {
				socketConnections.splice(idx, 1);
			}
		});
	});

	socket.on('event', ({ type, value, token }) => {
		switch (type) {
			case 'clientRequestChange':
				socket.broadcast.emit('event', { type: 'change', songIndex: value });
				currentSongIdx = value;
				break;
			case 'clientPlayPauseChange':
				if (value == 'play') {
					activeAt = socket.id;
					socket.broadcast.emit('event', {
						type: 'playPause',
						status: 'pause',
						activeAt: socket.id,
					});
				}
				break;
		}
		console.log(type, value, token, 'socket event');
	});
});

app.get('/', (req, res) => res.status(200).json('server is up and running'));

app.post('/login', (req, res) => {
	console.log(req.body);
	try {
		let newUser = {
			username: req.body.username,
			password: req.body.password,
		};
		const isValid = isValidUser(newUser);
		if (isValid) {
			let token = uuidv4();
			let user = users.find((user) => user.username === newUser.username);
			user.tokens.push(token);
			return res.status(200).send(token);
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	} catch (e) {
		res.status(501).json({ message: 'Something went wrong' });
	}
});

app.get('/logout/:token', (req, res) => {
	let token = req.params.token;
	let user = getUserByToken(token);
	console.log('userlogout', user);
	let index = user.tokens.findIndex((t) => t == token);
	user.tokens.splice(index, 1);
	res.status(200).json(user);
});

server.listen(PORT, () => {
	console.log(`server is running at port ${PORT}`);
});
