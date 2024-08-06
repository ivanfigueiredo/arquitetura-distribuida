import { IResolvers } from "@graphql-tools/utils";
import { IPubSub } from "./PubSub";

export class Resolver implements IResolvers {
    [key: string]: any;
    Subscription: any;
    Query: QueryType = { result: async () => await this.result() }

    constructor(pubSub: IPubSub) {
        this.Subscription = {
            events: {
                resolve: (payload: any, args: any, ctx: {userId: string}, info: any) => {
                    const output = JSON.parse(payload)
                    if (output.data.userId === ctx.userId) {
                        return output
                    }
                },
                subscribe: () => pubSub.subscribe('PAYMENT'),
            }
        }
    }

    public async result(): Promise<string> {
        return "Ivan Figueiredo"
    }
}

export type SubscriptionType = {
    events: {
        resolve: Function
        subscribe: Function
    }
}

export type QueryType = {
    result: Function
}