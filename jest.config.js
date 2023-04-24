require('dotenv').config();

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.ts'],
    roots: ['<rootDir>'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testMatch: ['**/*.test.ts'],
    coveragePathIgnorePatterns: [
        'app.*.ts',
        '.entity.ts',
        '.repository.ts',
        '.error.ts',
        '.constant.ts',
        '.decorator.ts'
    ],
    moduleNameMapper: {
        '^reflect-metadata$': '<rootDir>/node_modules/reflect-metadata/Reflect.js',
        '^src/(.*)$': ['<rootDir>/src/$1'],
        '^@constant/(.*)$': [
            '<rootDir>/src/shared/constant/$1',
        ],
        '^@service/(.*)$': [
            '<rootDir>/src/shared/service/$1',
            '<rootDir>/src/authApi/infrastructure/service/$1',
            '<rootDir>/src/linkApi/infrastructure/service/$1',
        ],
        '^@middleware/(.*)$': [
            '<rootDir>/src/shared/service/middleware/$1',
        ],
        '^@entity/(.*)$': [
            '<rootDir>/src/shared/entity/$1',
            '<rootDir>/src/authApi/domain/entity/$1',
            '<rootDir>/src/linkApi/domain/entity/$1',
        ],
        '^@model/(.*)$': [
            '<rootDir>/src/shared/model/$1',
            '<rootDir>/src/authApi/domain/model/$1',
            '<rootDir>/src/linkApi/domain/model/$1',
        ],
        '^@repository/(.*)$': [
            '<rootDir>/src/authApi/domain/repository/$1',
            '<rootDir>/src/linkApi/domain/repository/$1',
        ],
        '^@decorator/(.*)$': [
            '<rootDir>/src/shared/service/decorator/$1',
        ],
        '^@database/(.*)$': [
            '<rootDir>/src/shared/database/$1',
        ],
        '^@mapper/(.*)$': [
            '<rootDir>/src/authApi/domain/mapper/$1',
            '<rootDir>/src/linkApi/domain/mapper/$1',
        ],
        '^@error/(.*)$': [
            '<rootDir>/src/shared/error/$1',
        ],
        '^@app/(.*)$': ['<rootDir>/src/$1'],
        '^@testData/(.*)$': ['<rootDir>/tests/data/$1',],
    },
    reporters: [
        "default",
        [
            "jest-html-reporter", {
                "pageTitle": "Test Report",
                "outputPath": "tests/report/test_report.html",
                "expand": true,
                "openReport": true,
                "dateFormat": "dd/mm/yyyy HH:MM"
            }
        ]
    ]
};
