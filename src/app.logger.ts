import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logDir = 'logs';
const logFormat = format.printf(({ level, message, meta }) => {
    const date = new Date();
    const timezoneOffset = -120; // Offset en minutos para la zona horaria de Madrid (UTC+2)
    const offset = timezoneOffset * 60 * 1000;
    const localTime = new Date(date.getTime() - offset);
    const timezone = `GMT${timezoneOffset < 0 ? '-' : '+'}${Math.abs(timezoneOffset / 60)
        .toString()
        .padStart(2, '0')}:${Math.abs(timezoneOffset % 60)
        .toString()
        .padStart(2, '0')}`;

    return `${localTime.toISOString()} ${timezone} [${level}] ${message} ${meta ? JSON.stringify(meta) : ''}`;
});

const transports = [
    new DailyRotateFile({
        level: 'info',
        format: logFormat,
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

const loggingEnabled: boolean = process.env.LOGGING_ENABLED === 'true' ? true : false;

if (loggingEnabled) {
    logger.transports.forEach((transport) => {
        transport.silent = loggingEnabled;
    });
}

export default logger;
