const config = {
	env: process.env.ENV ? process.env.ENV : 'production',
	port: process.env.PORT ? process.env.PORT : 80,
};

module.exports = { config: config };
