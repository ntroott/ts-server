export default {
  monitoring: {
    url: 'http://localhost:8200',
    captureBody: 'all',
    ignoreUrls: ['/ping'],
  },
  dbConfig: {
    host: 'localhost',
    port: 5984,
    dbName: 'customers',
    user: 'admin',
    pass: '12345',
  },
};
