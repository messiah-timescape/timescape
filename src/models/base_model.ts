import { BaseFirestoreRepository, IEntity } from "fireorm";
import moment from "moment";
import { classToPlain } from "class-transformer";

export default abstract class BaseModel {
    id: string = '';

    constructor(init_fields?) {
        this.fill_fields(init_fields);
    }

    fill_fields(init_fields?:Partial<this>) {
        Object.assign(this, init_fields);
    }

    // static create(init_fields:Partial<T>) {

    // }

    to_json():string {
        return JSON.stringify(this);
    }
};


export class BaseRepo<T extends IEntity> extends BaseFirestoreRepository<T> {
    // _time_fields?: string[];
    // get_time_fields = () : string[] => {
    //     if (!this._time_fields){
    //         this._time_fields = Object.keys(this);
    //     }
    //     return this._time_fields;
    // }

    constructor(colName: string, collectionPath?: string) {
        super(colName, collectionPath);
        this.toSerializableObject = (obj: T): Object => {
            if (obj) {
                let exclude_list:string[] = [];
                this.subColMetadata.forEach(scm => {
                    if (scm.propertyKey){
                        exclude_list.push(scm.propertyKey);
                    }
                });
                let firestore_obj = classToPlain(obj, {excludePrefixes: exclude_list});
                
                return firestore_obj;
            } else {
                return {};
            }
        }

    }
}