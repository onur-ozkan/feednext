export class SerializerService {
    public async deleteProperties(data: object, properties: string[]): Promise<object> {
        for await (const property of properties) {
            delete data[property]
        }

        return data
    }
}

const serializerService = new SerializerService()

export { serializerService }
