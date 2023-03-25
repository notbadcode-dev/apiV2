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
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserService = void 0;
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find();
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOneBy({ id: id });
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.save(user);
        });
    }
    updateUser(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userRepository.update(id, user);
            return yield this.getUser(id);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userRepository.delete(id);
            return { message: 'User deleted' };
        });
    }
}
exports.UserService = UserService;
