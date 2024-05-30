import Queue from "./Queue";

export default class QueueController {
	
	constructor (
        readonly queue: Queue,
    ) {
		queue.consume("teste1", async (input: any) => {
            console.log('=>>>>>>>>>>>>>>>>>>>>>>>>>');
		});
	}
}