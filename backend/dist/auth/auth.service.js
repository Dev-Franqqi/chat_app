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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async hashpassword(password) {
        const saltRounds = 10;
        const hashedpassword = await bcrypt.hash(password, saltRounds);
        return hashedpassword;
    }
    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
    generateRandomNumber(min, max) {
        const num = Math.floor(Math.random() * (max - min)) + min;
        return num;
    }
    generateUniqueUserId() {
        const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        let uid = "";
        uid += alphabets.charAt(this.generateRandomNumber(0, alphabets.length));
        uid += numbers.charAt(this.generateRandomNumber(0, numbers.length));
        for (let i = 2; i <= 8; i++) {
            const fullCharacters = alphabets + numbers;
            uid += fullCharacters.charAt(this.generateRandomNumber(0, fullCharacters.length));
        }
        return uid;
    }
    anonymousSignin() {
        return { message: 'User created successfully' };
    }
    async signup(email, password) {
        if (!email || !password) {
            throw new common_1.BadRequestException("Email or Password missing");
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException("User with email already exists");
        }
        const hashedPassword = await this.hashpassword(password);
        const user = await this.prisma.user.create({
            data: {
                email, password: hashedPassword
            }
        });
        const token = this.jwt.sign({
            userId: user.id, email
        }, { secret: process.env.JWT_SECRET, expiresIn: "3h" });
        return { user, token };
    }
    async login(email, password) {
        if (!email || !password) {
            throw new common_1.BadRequestException("Email or Password missing");
        }
        const user = await this.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw new common_1.BadRequestException("User does not exist");
        }
        const matchpassword = await this.comparePassword(password, user.password);
        if (!matchpassword) {
            throw new common_1.BadRequestException("Incorrect Password");
        }
        const token = this.jwt.sign({ userId: user.id, email }, { secret: process.env.JWT_SECRET, expiresIn: '3h' });
        return { user, token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map