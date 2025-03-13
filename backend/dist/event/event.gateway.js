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
const cookie = require("cookie");
require("dotenv/config");
console.log(process.env.FRONTEND_URL);
let EventGateway = class EventGateway {
    onModuleInit() {
        console.log('Gateway initialized');
    }
    handleConnection(client) {
        console.log(`${client.id} connected to the server`);
        const cookies = cookie.parse(client.handshake.headers.cookie || "");
        this.server.emit('connection', `${cookies.uid} connected to the chat`);
        console.log("Cookies received:", cookies);
        if (!cookies.uid) {
            console.log("No session cookie found. Disconnecting...");
            client.disconnect();
            this.server.emit('disconnection', `${client.id} disconnected to the chat`);
            return;
        }
        console.log(`Client connected with session ID: ${cookies.uid}`);
    }
    handleDisconnect(client) {
        console.log(`${client.id} disconnected from the server`);
        const cookies = cookie.parse(client.handshake.headers.cookie || "");
        this.server.emit('disconnection', `${cookies.uid} disconnected from the chat`);
    }
    handleMessage(client, message) {
        const cookies = client.handshake.headers.cookie;
        const parsedCookies = cookie.parse(cookies);
        const uid = parsedCookies['uid'];
        this.server.emit('message', { message, clientId: uid });
        console.log(`Received message from ${uid}: ${message}`);
        console.log(`Client with uniqueId ${uid} and has ${client.id} said ${message}`);
        return "Hello world";
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
    __metadata("design:returntype", String)
], EventGateway.prototype, "handleMessage", null);
exports.EventGateway = EventGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: process.env.FRONTEND_URL, credentials: true }
    })
], EventGateway);
//# sourceMappingURL=event.gateway.js.map