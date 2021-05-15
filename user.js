const users = [
	{
		username: 'admin',
		password: 'admin',
		tokens: [],
	},
];

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

module.exports = { users, isValidUser, getUserByToken };
