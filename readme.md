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
