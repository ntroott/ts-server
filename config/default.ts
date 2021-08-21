export default {
  monitoring: {
    url: 'http://localhost:8200',
    captureBody: 'all',
    ignoreUrls: ['/ping'],
  },
  build: {
    outputDirs: {
      dist: 'dist',
      coverage: 'coverage',
    },
    dockerfiles: {
      main: 'dockerfiles/main',
      postgres: 'dockerfiles/postgres',
    },
  },
};
