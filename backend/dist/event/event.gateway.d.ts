import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import 'dotenv/config';
export declare class EventGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    onModuleInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleMessage(client: Socket, message: string): string;
}
