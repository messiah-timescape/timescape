import {FirebaseUser, User} from "./user";
import BaseModel from "./base_model";
import { TagColors } from "./field_types";
import { Collection } from "fireorm";

class GenericTag extends BaseModel<GenericTag>{
    name!: string;
    color!: TagColors;
}




@Collection('tag')
class Tag extends GenericTag{
    
}

export {FirebaseUser, User, Tag};