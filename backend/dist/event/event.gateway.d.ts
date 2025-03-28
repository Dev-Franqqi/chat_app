import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import 'dotenv/config';
import { JwtService } from "@nestjs/jwt";
export declare class EventGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwt;
    server: Server;
    constructor(jwt: JwtService);
    onModuleInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleMessage(client: Socket, message: string): void;
}
