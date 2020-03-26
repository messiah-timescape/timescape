import {FirebaseUser, User} from "./user";
import {BaseRepo} from "./base_model";
import { CustomRepository } from "fireorm";
import {Task} from "./task";
import {Tag} from "./tag";
import { getMetadataStorage } from "fireorm/lib/src/MetadataStorage";

let models = getMetadataStorage().collections;
function apply_custom_repo( ) {
    for ( let i:number = 0; i < models.length; i++) {
        let ex_model = new models[i].entity();
        type Model = typeof ex_model;

        @CustomRepository(models[i].entity)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class ModelRepo extends BaseRepo<Model> {}
        
    }
}

apply_custom_repo();

export {FirebaseUser, User, Tag, Task};