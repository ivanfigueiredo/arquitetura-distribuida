import { IUserService } from "../../application/IUserService";
import Queue from "./Queue";

export default class QueueController {
	
	constructor (
        readonly queue: Queue,
        readonly userService: IUserService
    ) {
        queue.consume("user.created.queue", async (input: any) => {
            await userService.createUser(input);
            console.log('=============================>>>>>>>>>>>>>>>> PAYLOAD', input);
            // const dto = new ProcessPaymentDto(input.cardId, input.orderId, input.total);
			// await processPayment.execute(dto);
		});

		queue.consume("processPaymentV1", async (input: any) => {
            console.log('=========================>>>>>> RESPOSTA', input);
            
		});
	}
}