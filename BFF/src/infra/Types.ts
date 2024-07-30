export const typeDefs = () => {
    return `
        scalar Any
        type Error {
            message: String!
            statusCode: Int!
        }
        type Event {
            eventName: String
            timestamp: String!
            data: Any
            error: Error
        }
        type Subscription {
            events: Event!
        }

        type Query {
            result: String
        }
    `;
}