module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^@domain/(.*)$': '<rootDir>/domain/$1',
        '^@infrastructure/(.*)$': '<rootDir>/infrastructure/$1',
        '^@application/(.*)$': '<rootDir>/application/$1'
    },
    testMatch: ['**/test/**/*.test.ts'],
    setupFilesAfterEnv: ['reflect-metadata']
};
