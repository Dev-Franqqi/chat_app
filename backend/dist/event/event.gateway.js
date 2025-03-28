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
exports.EventGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
require("dotenv/config");
const jwt_1 = require("@nestjs/jwt");
console.log(process.env.FRONTEND_URL);
let EventGateway = class EventGateway {
    constructor(jwt) {
        this.jwt = jwt;
    }
    onModuleInit() {
        console.log('Gateway initialized');
    }
    handleConnection(client) {
        const token = `${client.handshake.query.token}`;
        try {
            const validToken = this.jwt.verify(token, { secret: process.env.JWT_SECRET });
            this.server.emit('connection', `${validToken.uid} connected to the chat`);
        }
        catch (error) {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        console.log(`${client.id} disconnected from the server`);
        const token = `${client.handshake.query.token}` || "";
        try {
            const validToken = this.jwt.verify(token, { secret: process.env.JWT_SECRET });
            this.server.emit('disconnection', `${validToken.uid} disconnected from the chat`);
        }
        catch (error) {
            console.log("Invalid user disconnected");
        }
    }
    handleMessage(client, message) {
        const token = `${client.handshake.query.token}`;
        try {
            const validToken = this.jwt.verify(token, { secret: process.env.JWT_SECRET });
            this.server.emit('message', { message, clientId: validToken.uid });
            console.log(`Received message from {uid: ${validToken.uid}, clientId: ${client.id}}: ${message}`);
        }
        catch (error) {
            console.log('Unauthenticated user cannot send message');
        }
    }
};
exports.EventGateway = EventGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], EventGateway.prototype, "handleMessage", null);
exports.EventGateway = EventGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: process.env.FRONTEND_URL, credentials: true }
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], EventGateway);
//# sourceMappingURL=event.gateway.js.map