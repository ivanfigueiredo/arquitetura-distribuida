import { ILogger, Queue } from "expense-core";
import { IUserInfo } from "../application/IUserInfor";
import { UserInfoDto } from "../application/dto/UserInfoDto";

export default class QueueController {

    constructor(
        readonly queue: Queue,
        readonly logger: ILogger,
        readonly userInfo: IUserInfo
    ) {
        queue.consume("user.info.recieve.queue", "user.events", "user.info.recieve", async (input: UserInfoDto) => {
            logger.info("Recebendo evento para buscar informacoes do usuario")
            await this.userInfo.execute(input)
        });
    }
}