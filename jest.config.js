module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: [
        'jest-preset-angular/build/InlineFilesTransformer',
        'jest-preset-angular/build/StripStylesTransformer'
      ],
      babelConfig: {
        presets: [
          [
            '@babel/preset-env',
            { targets: { node: true }, modules: 'commonjs' }
          ]
        ],
        plugins: ['@babel/plugin-syntax-dynamic-import']
      }
    },
  },
  transform: {
    '^.+\\.(ts|html)$': 'ts-jest',
    "^.+\\.js": "babel-jest"
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^environments/(.*)$': '<rootDir>/src/environments/$1',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!@ionic-native|@ionic)',
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  coverageReporters: ['html', 'text', 'text-summary'],
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
};
