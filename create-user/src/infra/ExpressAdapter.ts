import { HttpClient } from "./HttpClient";
import express, { Request, Response } from 'express';

export class ExpressAdapter implements HttpClient {
    connect: any;

    constructor() {
        this.connect = express();
        this.connect.use(express.json());
    }

    on(method: string, url: string, callback: Function): void {
        this.connect[method](url, async function (req: Request, res: Response) {
            try {
                console.log('===================>>>>> HEADERS', req.headers);
                const output = await callback(req.params, req.body);
                res.json(output);
            } catch (error: unknown) {
                console.log('============>>>> ERROR');
            }
        });
    }

    listen(port: number, callback: Function): void {
        this.connect.listen(port, callback());
    }
}