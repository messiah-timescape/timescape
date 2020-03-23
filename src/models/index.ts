import {FirebaseUser, User} from "./user";
import BaseModel, {BaseRepo} from "./base_model";
import { TagColors } from "./field_types";
import { Collection, CustomRepository } from "fireorm";
import {Task} from "./task"
import { getMetadataStorage } from "fireorm/lib/src/MetadataStorage";

class GenericTag extends BaseModel{
    name!: string;
    color!: TagColors;
}




@Collection('tag')
class Tag extends GenericTag{
    
}

let models = getMetadataStorage().collections;
function apply_custom_repo( ) {
    for ( let i:number = 0; i < models.length; i++) {
        let ex_model = new models[i].entity();
        type Model = typeof ex_model;

        @CustomRepository(models[i].entity)
        class ModelRepo extends BaseRepo<Model> {}
        
    }
}

apply_custom_repo();

export {FirebaseUser, User, Tag, Task};