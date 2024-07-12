import { ExcludeClientDto } from "./dto/ExcludeClientDto";

export interface IExcludeClient {
    execute(dto: ExcludeClientDto): Promise<void>
}