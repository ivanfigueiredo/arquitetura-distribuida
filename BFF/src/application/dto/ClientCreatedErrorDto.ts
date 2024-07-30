export interface ClientCreatedErrorDto {
    error: {
        message: string
        statusCode: number 
        timestamp: string
    }
}