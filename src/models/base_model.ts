export default abstract class BaseModel<T> {
    id: string = '';

    constructor(init_fields?:Partial<T>) {
        Object.assign(this, init_fields);
    }

    to_json():string {
        return JSON.stringify(this);
    }
};