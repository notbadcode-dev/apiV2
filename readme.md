# NotBadCode ApiV2

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](https://en.wikipedia.org/wiki/ISC_license)

## Project Description

`NotBadCode ApiV2` is an API developed for data and process management in applications. This API provides a range of features, including authorization, centralized exception handling, process logging, internationalization, and the use of TypeORM for database manipulation.

## Installation Instructions

To install `NotBadCode ApiV2`, make sure you have [Node.js](https://nodejs.org/) installed. Then, clone this repository and run the following commands:

## Key Features

-   **Authorization:** Manages access to functions and resources through authentication.
-   **Centralized Exception Handling:** Manages exceptions consistently and centrally.
-   **Process Logging:** Keeps a log of processes performed by the API.
-   **Internationalization:** Supports message and content internationalization.
-   **TypeORM:** Uses TypeORM to interact with the database.
-   **Caching:** Utilizes caching to improve performance and reduce database queries.

## Caching

`NotBadCode ApiV2` implements a caching mechanism to optimize performance and reduce the load on the database. This caching system helps in storing and retrieving frequently accessed data, such as user profiles, configuration settings, or frequently queried data.

### How Caching Works

-   Cached data is stored in a fast in-memory cache.
-   When a request is made to fetch data, the API first checks if the data is available in the cache.
-   If the data is found in the cache, it is returned without hitting the database, resulting in faster response times.
-   If the data is not in the cache or has expired, the API fetches it from the database, updates the cache, and then returns it.

### Benefits of Caching

Implementing caching in `NotBadCode ApiV2` offers several benefits, including:

-   Improved response times for frequently accessed data.
-   Reduced load on the database, leading to better overall performance.
-   Enhanced scalability, as the API can handle more concurrent requests with cached data.
-   Efficient resource utilization, especially in scenarios with high traffic or complex queries.

By utilizing caching, `NotBadCode ApiV2` ensures a smoother and more responsive experience for users while maintaining data consistency and integrity.

You can configure caching settings and eviction policies as needed to optimize the performance of your application.

## Examples

-   Performs CRUD operations (Create, Read, Update, Delete).
-   Executes automatic background processes.

## Installation and Usage

1. **Installation:** Ensure you have [Node.js](https://nodejs.org/) installed. Clone the repository and run the following commands:

    ```bash
    npm install
    ```

2. **Usage:**

    - Run the development authentication API:
        ```bash
        npm run dev:auth
        ```
    - Start the authentication API:
        ```bash
        npm run start:auth
        ```
    - Run the development link API:
        ```bash
        npm run dev:link
        ```
    - Start the link API:
        ```bash
        npm run start:link
        ```
    - Run both authentication and link APIs concurrently (development):
        ```bash
        npm run dev:link:a
        ```
    - Start both authentication and link APIs concurrently:
        ```bash
        npm run start:link:a
        ```
    - Build the project:
        ```bash
        npm run build
        ```
    - Lint the TypeScript files:
        ```bash
        npm run lint
        ```
    - Lint and fix TypeScript files:
        ```bash
        npm run lint:fix
        ```
    - Run tests:
        ```bash
        npm test
        ```
    - Run tests in watch mode:
        ```bash
        npm run test:watch
        ```
    - Format code using Prettier:
        ```bash
        npm run format
        ```
    - Verify Jest test YAML:
        ```bash
        npm run verify-jest-test-yml
        ```
    - Verify ESLint analyzer YAML:
        ```bash
        npm run verify-eslint-analyzer-yml
        ```

## License

This project is licensed under the [ISC License](https://en.wikipedia.org/wiki/ISC_license), which stands for Internet Software Consortium.

## Contact

If you have questions, comments, or suggestions, you can contact us via email: [notbadcode.dev@gmail.com](mailto:notbadcode.dev@gmail.com).
