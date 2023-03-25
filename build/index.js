'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const routing_controllers_1 = require('routing-controllers');
const UserEntity_1 = require('./apis/auth/entity/UserEntity');
const UserService_1 = require('./apis/auth//service/UserService');
const UserController_1 = require('./apis/auth/controller/UserController');
const swagger_ui_express_1 = __importDefault(require('swagger-ui-express'));
const swagger_1 = __importDefault(require('./swagger'));
const database_1 = require('./core/database');
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        // Create database connection
        const connection = yield database_1.dataSource;
        // Create User Service instance
        const userRepository = connection.getRepository(UserEntity_1.UserEntity);
        const userService = new UserService_1.UserService(userRepository);
        // Create User Controller instance
        const userController = new UserController_1.UserController(userService);
        // Setup express to use routing-controllers
        (0, routing_controllers_1.useExpressServer)(app, {
            routePrefix: '/api/notbadcode',
            controllers: [UserController_1.UserController],
        });
        // Add Swagger UI
        app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
        app.listen(9000, () => {
            console.log('Server started on port 9000');
        });
    });
}
bootstrap();
