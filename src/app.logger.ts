import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const LOG_DIR = 'logs';
const LOG_FORMAT = format.printf(({ level, message, meta }) => {
    const DATE = new Date();
    const TIME_ZONE_OFFSET = -120;
    const OFFSET = TIME_ZONE_OFFSET * 60 * 1000;
    const LOCAL_TIME = new Date(DATE.getTime() - OFFSET);
    const TIME_ZONE = `GMT${TIME_ZONE_OFFSET < 0 ? '-' : '+'}${Math.abs(TIME_ZONE_OFFSET / 60)
        .toString()
        .padStart(2, '0')}:${Math.abs(TIME_ZONE_OFFSET % 60)
        .toString()
        .padStart(2, '0')}`;

    return `${LOCAL_TIME.toISOString()} ${TIME_ZONE} [${level}] ${message} ${meta ? JSON.stringify(meta) : ''}`;
});

const TRANSPORTS = [
    new DailyRotateFile({
        level: 'info',
        format: LOG_FORMAT,
        dirname: LOG_DIR,
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

const LOGGER = winston.createLogger({
    transports: TRANSPORTS,
});

const LOGGING_ENABLED: boolean = process.env.LOGGING_ENABLED?.includes('true') ? true : false;

if (LOGGING_ENABLED) {
    LOGGER.transports.forEach((transport) => {
        transport.silent = false;
    });
}

export default LOGGER;
