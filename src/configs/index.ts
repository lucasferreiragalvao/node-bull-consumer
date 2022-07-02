import { env } from 'process';

export default {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || '',
    port: Number(process.env.REDIS_PORT || '6379'),
  },
  email: {
    config: {
      host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.MAIL_PORT || 2525),
      auth: {
        user: process.env.MAIL_USER || 'f6f6de68bb0ba5',
        pass: process.env.MAIL_PASS || '0223f633e1b631',
      },
    },
    default: {
      from: process.env.MAIL_FROM || 'testeprojetounifacef@gmail.com',
      to: process.env.MAIL_TO || 'anilton.francisco@gmail.com',
    },
  },
  mysql: {
    type: 'mysql',
    hostname: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT) || 3306,
    username: process.env.MYSQL_PASSWORD || 'root',
    password: process.env.MYSQL_PASSWORD || '123',
    database: process.env.MYSQL_DATABASE || 'elections',
    logging: false,
  },
};
