import { Collection } from "fireorm";
import BaseModel from "./base_model";
import { TagColors } from "./field_types";

class GenericTag extends BaseModel<GenericTag>{
    name!: string;
    color!: TagColors;
}

@Collection('user')
export class User extends BaseModel<User>{
    email!: string;
    auth!: string;
}

@Collection('tag')
export class Tag extends GenericTag{
    
}

export default {User, Tag};