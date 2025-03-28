"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : "http://192.168.0.178:3000",
        credentials: true,
    });
    app.use(cookieParser());
    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0');
    console.log(`Listening on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map