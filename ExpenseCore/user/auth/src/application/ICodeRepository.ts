import { Code } from "../domain/Code";

export interface ICodeRepository {
    save(code: Code): Promise<void>
}