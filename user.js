const users = [
	{
		username: 'admin',
		password: 'admin',
		songIndex: 0,
		tokens: [
			'5bf521d7-164d-4c23-a678-5e4acc9a1a54',
			'0250117f-0784-49e2-8bbd-d781f46e3a30',
			'7592a243-d628-4d40-beef-50052ee64476',
			'1cc9a34d-6e24-42ca-a6bf-53c32620633e',
		],
	},
];

const addUser = ({ username, password, songIndex = 0 }) => {
	let newUser = {
		username,
		password,
		songIndex,
	};
	users.push(newUser);
	console.log([users]);
};

const isValidUser = (user) => {
	const { username, password } = user;
	if (username && password) {
		let currentUser = users.find(
			(u) => username == u.username && password == u.password
		);
		if (currentUser) {
			return true;
		}
	} else {
		return false;
	}
};

const getUserByToken = (token) => {
	let user = users.find((u) => u.tokens.find((t) => t === token));
	return user;
};

module.exports = { addUser, users, isValidUser, getUserByToken };
