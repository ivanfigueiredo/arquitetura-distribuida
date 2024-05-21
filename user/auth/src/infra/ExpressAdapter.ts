import { HttpClient } from "./HttpClient";
import express, { NextFunction, Request, Response } from 'express';
import { ISetTraceContext } from "./TraceContext";

export class ExpressAdapter implements HttpClient {
    connect: any;

    constructor(private readonly traceContext: ISetTraceContext) {
        this.connect = express();
        this.connect.use(express.json());
    }

    on(method: string, url: string, callback: Function): void {
        this.connect[method](url, async (req: Request, res: Response) => {
            try {
                const output = await callback(req.params, req.body);
                res.json(output);
            } catch (error: any) {
                console.log('============>>>> ERROR');
                res.status(500).json({message: error.message})
            }
        });
    }

    listen(port: number, callback: Function): void {
        this.connect.listen(port, callback());
    }
}