import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logDir = 'logs';
const logFormat = format.printf(({ level, message, timestamp, meta }) => {
    return `${timestamp} [${level}] ${message} ${meta ? JSON.stringify(meta) : ''}`;
});

const transports = [
    new DailyRotateFile({
        level: 'info',
        format: format.combine(format.timestamp(), logFormat),
        dirname: logDir,
        filename: '%DATE%-app.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
    }),
    new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
];

const logger = winston.createLogger({
    transports,
});

export default logger;
