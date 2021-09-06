export default {
  monitoring: {
    url: 'http://localhost:8200',
    captureBody: 'all',
    ignoreUrls: ['/ping'],
  },
  dbConfig: {
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: '12345',
    //database: 'database_development',
    //dialect: 'mysql',
  },
};
