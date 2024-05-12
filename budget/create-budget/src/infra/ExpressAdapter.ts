import express, { Response, Request } from "express";
import { HttpClient } from "./HttpClient";

export class ExpressAdapter implements HttpClient {
    private express: any;

    constructor() {
        this.express = express();
        this.express.use(express.json());
    }

    public on(method: string, url: string, callback: Function): void {
        this.express[method](url, async (req: Request, res: Response): Promise<void>  => {
            try {
                const output = await callback(req.params, req.body);
                res.json(output);
            } catch (error) {
                console.log('=============>>>>>> ERROR', error);
            }
        })
    }

    public listen(port: number, callback: Function): void {
        this.express.listen(port, callback);
    }
}