import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

@Injectable()
export class SentHeaderAuthorizationBearerJWTToken implements NestMiddleware {
    use(request: Request, response: Response, next: NextFunction) {
        if (
            request.headers?.authorization &&
            request.headers.authorization.startsWith("Bearer") &&
            request.headers.authorization.split(" ")[1]
        ) {
            const token = request.headers.authorization.split(" ")[1];

            const { userId } = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

            response.locals.userId = userId;

            next();
        }

        next();
    }
}
