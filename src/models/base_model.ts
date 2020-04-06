import { BaseFirestoreRepository, IEntity } from "fireorm";
import { classToPlain } from "class-transformer";
import { replace_undefined_by_null } from "../utils/replace_undefined_with_null";

export default abstract class BaseModel {
    id: string = '';

    constructor(init_fields?) {
        this.fill_fields(init_fields);
    }

    fill_fields(init_fields?:Partial<this>) {
        Object.assign(this, init_fields);
        return this;
    }

    // static create(init_fields:Partial<T>) {

    // }

    to_json():string {
        return JSON.stringify(this);
    }
};


export class BaseRepo<T extends IEntity> extends BaseFirestoreRepository<T> {

    make_exclude_list() {
        let exclude_list:string[] = [];
        this.subColMetadata.forEach(scm => {
            if (scm.propertyKey){
                exclude_list.push(scm.propertyKey);
            }
        });
        return exclude_list;
    }

    constructor(colName: string, collectionPath?: string) {
        super(colName, collectionPath);
        this.toSerializableObject = (obj: T): Object => {
            if (obj) {
                let firestore_obj = classToPlain(obj, {excludePrefixes: this.make_exclude_list()});
                firestore_obj = replace_undefined_by_null(firestore_obj);
                return firestore_obj;
            } else {
                return obj;
            }
        }
        // let old_extractTFromDocSnap = this.extractTFromDocSnap;
        // this.extractTFromDocSnap = (doc: firestore.DocumentSnapshot): T => {
        //     return old_extractTFromDocSnap(doc);
        // }

    }
}