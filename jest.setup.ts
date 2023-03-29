beforeAll(() => {
    process.env.RUN_TEST = 'true';
});

afterAll(async () => {
    process.env.RUN_TEST = 'false';
});
