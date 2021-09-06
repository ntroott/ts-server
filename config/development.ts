export default {
  monitoring: {
    url: 'http://localhost:8200',
    captureBody: 'all',
    ignoreUrls: ['/ping'],
  },
  dbConfig: {
    username: 'admin',
    password: '12345',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
  },
};
