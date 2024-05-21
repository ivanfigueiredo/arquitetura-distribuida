export interface HttpClient {
    on: (method: string, url: string, callback: Function) => void;
    listen: (port: number, callback: Function) => void;
}