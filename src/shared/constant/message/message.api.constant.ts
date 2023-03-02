export const MESSAGE_API = {
    CONSOLE_LINE: '----------------------------------------------------------------',

    STARTED: (apiName: string, apiPort: number): string => {
        return `⚡️⚡️ Started API ${apiName} on port:${apiPort} ⚡️⚡️`;
    },
    DATA_SOURCE_INITIALIZED: (databaseName: string): string => {
        return `       💾 Data Source '${databaseName}' has been initialized!        `;
    },
};
