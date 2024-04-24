import winston from 'winston';

const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = 'MMM-DD-YYYY HH:mm:ss';

export const loggerFactory = (resource: string): winston.Logger => {
    return winston.createLogger({
        format: combine(
            timestamp({ format: timestampFormat }),
            json(),
            printf(({ timestamp, level, message }) => {

                return `${timestamp} - ${resource} [${level}]: ${message} `
            })
        ),
        transports: [
            new winston.transports.Console()
        ],
    });
}