"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserController = exports.getUserController = exports.getUsersController = void 0;
const get_user_service_1 = require("../services/user/get-user.service");
const update_user_service_1 = require("../services/user/update-user.service");
const get_users_service_1 = require("../services/user/get-users.service");
const getUsersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, get_users_service_1.getUsersService)();
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getUsersController = getUsersController;
const getUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield (0, get_user_service_1.getUserService)(id);
        res.status(200).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserController = getUserController;
const updateUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profilePicture = req.file;
        const userId = res.locals.user.id;
        const result = yield (0, update_user_service_1.updateUserService)(userId, Object.assign(Object.assign({}, req.body), { profilePicture }));
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserController = updateUserController;
