import { AuthService } from './auth.service';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(user: {
        email: string;
        password: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    login(user: {
        email: string;
        password: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    signinAnonymously(res: Response): Response<any, Record<string, any>>;
}
