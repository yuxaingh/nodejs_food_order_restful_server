var winston = require('winston');
  require('winston-daily-rotate-file');
 
  var transport = new (winston.transports.DailyRotateFile)({
    filename: './logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d'
  });
 
  transport.on('rotate', function(oldFilename, newFilename) {
    // do something fun
  });
 
  var logger = winston.createLogger({
    transports: [
      transport,
      new winston.transports.Console(),
    ]
  });

  module.exports = logger;