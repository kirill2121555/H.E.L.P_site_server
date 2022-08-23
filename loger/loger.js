const { format, createLogger, transports } = require('winston');
const { timestamp, combine, printf } = format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
})

const logger = createLogger({
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
       new transports.Console()
    ],
});

module.exports = logger;