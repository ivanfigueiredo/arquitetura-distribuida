import { ClientCreatedDto } from '../application/dto/ClientCreatedDto'
import { IClientCreated } from '../application/IClientCreated'
import { Queue, ILogger } from "expense-core"
import { IClientCreatedError } from '../application/IClientCreatedError'
import { ClientCreatedErrorDto } from '../application/dto/ClientCreatedErrorDto'

export default class QueueController {
   constructor(
      readonly queue: Queue,
      readonly logger: ILogger,
      readonly clientCreated: IClientCreated,
      readonly clientCreatedError: IClientCreatedError
   ) {
      queue.consume("client.registration.created.queue", "client.events", "client.registration.created", async (input: ClientCreatedDto) => {
         this.logger.info('Recebendo evento de cliente criado')
         await clientCreated.execute(input)
      })
      queue.consume("client.registration.error.queue", "client.events", "client.registration.error", async (input: ClientCreatedErrorDto) => {
         this.logger.info("Recebendo evento de erro ao criar cliente")
         await clientCreatedError.execute(input)
      })
   }
}