const def = {
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

export const getDockerfilePath = (dockerfile: keyof typeof def.build.dockerfiles): string =>
  def.build.dockerfiles[dockerfile];
export default def;
