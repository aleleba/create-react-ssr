const config = {
	env: process.env.ENV ? process.env.ENV : 'production',
	port: process.env.PORT ? process.env.PORT : 80,
	// portDev: process.env.PORT_DEV ? process.env.PORT_DEV : 3000,
	// portReloadDev: process.env.PORT_RELOAD_DEV,
};

module.exports = { config: config };
