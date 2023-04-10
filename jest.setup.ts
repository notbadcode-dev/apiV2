beforeAll(() => {
    process.env.RUN_TEST = 'true';
    process.env.LOGGING_ENABLED = 'false';
});

afterAll(async () => {
    process.env.RUN_TEST = 'false';
    process.env.LOGGING_ENABLED = 'true';
});
