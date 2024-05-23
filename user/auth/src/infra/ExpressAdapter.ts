import { HttpClient } from "./HttpClient";
import express, { Request, Response } from 'express';
import { ISpan } from "./ISpan";
import { UnauthorizedException } from "./exceptions/UnauthorizedException";
import { InternalServerErrorException } from "./exceptions/InternalServerErrorException";

export class ExpressAdapter implements HttpClient {
    connect: any;

    constructor(private readonly context: ISpan) {
        this.connect = express();
        this.connect.use(express.json());
    }

    on(method: string, url: string, callback: Function): void {
        this.connect[method](url, async (req: Request, res: Response) => {
            try {
                const traceparent = req.headers['traceparent'] as string;
                const correlationId = req.headers['correlationid'] as string;
                this.context.setContext({correlationId, traceparent});
                this.context.startSpan('auth.service');
                const output = await callback(req.params, req.body);
                this.context.endSpan();
                res.json(output);
            } catch (error: any) {
                if (error instanceof UnauthorizedException) {
                    res.status(error.status).json({message: error.message});
                }
                if (error instanceof InternalServerErrorException) {
                    res.status(error.status).json(error.message)
                }
            }
        });
    }

    listen(port: number, callback: Function): void {
        this.connect.listen(port, callback());
    }
}