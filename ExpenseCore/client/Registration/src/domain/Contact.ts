export class Contact {
    private constructor(
        readonly clientId: string,
        readonly name: string,
        readonly email: string,
        readonly phoneNumber: string,
        readonly relationship: string
    ) { }

    public static create(clientId: string, name: string, email: string, phoneNumber: string, relationship: string): Contact {
        return new Contact(clientId, name, email, phoneNumber, relationship)
    }

    public static restore(clientId: string, name: string, email: string, phoneNumber: string, relationship: string): Contact {
        return new Contact(clientId, name, email, phoneNumber, relationship)
    }
}