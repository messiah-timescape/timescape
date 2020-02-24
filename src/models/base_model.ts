export default class BaseModel {
    id: string;

    constructor(...args: any[]) {
        for (const key in args) {
            this[key] = args[key];
        }
    }
}