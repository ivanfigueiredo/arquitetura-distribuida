import { ISpan } from 'expense-core';
import { HttpClient } from "./HttpClient";
import express, { Request, Response } from 'express';
import { DomainException } from "../domain/exception/DomainException";
import { InternalServerErrorException } from "./exceptions/InternalServerErrorException";
import { randomUUID } from "crypto";

export class ExpressAdapter implements HttpClient {
    connect: any;

    constructor(private readonly context: ISpan) {
        this.connect = express();
        this.connect.use(express.json());
    }

    on(method: string, url: string, callback: Function): void {
        this.connect[method](url, async (req: Request, res: Response) => {
            try {
                // const traceparent = req.headers['traceparent'] ?? randomUUID();
                // const correlationId = req.headers['correlationid'] ?? randomUUID();
                this.context.setContext({ correlationId: randomUUID(), traceparent: randomUUID() });
                this.context.startSpan("create.user.service")
                const output = await callback(req.params, req.body);
                this.context.endSpan()
                res.json(output);
            } catch (error: any) {
                if (error instanceof DomainException) {
                    res.status(error.status).json(error.message);
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