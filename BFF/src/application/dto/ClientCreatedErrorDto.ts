export interface ClientCreatedErrorDto {
    error: {
        message: string
        statusCode: number 
        timestamp: string
    }
    data: {
        userId: string
    }
}