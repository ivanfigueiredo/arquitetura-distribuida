export interface ISetTraceContext {
    set(data: Context): void
}

export interface IGetTraceContext {
    get(): Context
}


export class TraceContext implements ISetTraceContext, IGetTraceContext {
    private context: Context;

    constructor() {
        this.context = {}
    }

    set(data: Context): void {
        this.context = data;    
    }

    get(): Context {
        return this.context 
    }
}


export interface Context {
    correlationId?: string
}