const pino = require("pino");

const infoLogger = pino();
infoLogger.level = 'info'

const warnLogger = pino('warn.log')
warnLogger.level = 'warn'

const errorLogger = pino('error.log')
errorLogger.level = 'error'

module.exports = { infoLogger , warnLogger , errorLogger };