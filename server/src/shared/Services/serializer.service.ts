export declare interface ISerializeResponse {
    type: string
    id?: string
    attributes: {
        [key: string]: any,
    }
}
export class SerializerService {
    public async deleteProperties(data: object, properties: string[]): Promise<object> {
        for await (const property of properties) {
            delete data[property]
        }

        return data
    }

    public serializeResponse(type: string, result: object, id?: string): ISerializeResponse {
        return {
            type,
            id,
            attributes: result,
        }
    }
}

export const serializerService = new SerializerService()
