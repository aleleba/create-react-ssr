require('dotenv').config();

const config = {
    portDev: process.env.PORT_DEV ? process.env.PORT_DEV : 3000,
    portReloadDev: process.env.PORT_RELOAD_DEV,
}

module.exports = { config: config };