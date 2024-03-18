import { createLogger, format, transports } from 'winston';

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        debug: 3,
        info: 4,
    },
    colors: {
        fatal: "red",
        error: "orange",
        warning: "yellow",
        info: "blue",
        debug: "white"
    }
}

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level} : ${message}`;
});


//esta confi es solo para nivel console info y archivo warning 
// export const logger = createLogger({
//     levels: customLevelsOptions.levels,
//     format: combine(
//         timestamp(),
//         myFormat
//     ),
//     transports: [
//         new transports.Console({
//             level: "info",
//             format: combine(
//                 format.colorize({ colors: customLevelsOptions.colors }),
//                 format.simple()
//             )
//         }),
//         new transports.File({
//             filename: "./errors.log",
//             level: 'warning',
//             format: format.simple()
//         })
//     ]
// });

export const logger = createLogger({
    levels: customLevelsOptions.levels,
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console({
            level: "debug", // Mostrar todos los niveles en la consola
            format: combine(
                format.colorize({ colors: customLevelsOptions.colors }),
                format.simple()
            )
        }),
        new transports.File({
            filename: "./errors.log",
            level: 'debug', // Registrar todos los niveles en el archivo
            format: format.simple()
        })
    ]
});

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
}