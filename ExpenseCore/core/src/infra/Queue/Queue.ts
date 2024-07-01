export interface Queue {
	connect(): Promise<void>;
	consume(queueName: string, exchange: string, routeKey: string, callback: Function): Promise<void>;
	publish(exchange: string, routeKey: string, data: any): Promise<void>;
}