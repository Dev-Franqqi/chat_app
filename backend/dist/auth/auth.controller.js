"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signup(user, res) {
        try {
            const payload = await this.authService.signup(user.email, user.password);
            res.cookie('uid', user.email, {
                httpOnly: false,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
                path: '/',
            });
            res.cookie('token', payload.token, {
                httpOnly: false,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
                path: '/',
            });
            return res.status(200).json({ payload });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async login(user, res) {
        try {
            const payload = await this.authService.login(user.email, user.password);
            res.cookie('uid', user.email, {
                httpOnly: false,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
                path: '/',
            });
            return res.status(200).json({ payload });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    signinAnonymously(res) {
        try {
            const success = this.authService.anonymousSignin();
            const uniqueId = this.authService.generateUniqueUserId();
            res.cookie('uid', uniqueId, {
                httpOnly: false,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
                path: '/',
            });
            return res.status(200).json({ message: success.message, uid: uniqueId });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('loginAnonymously'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signinAnonymously", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map