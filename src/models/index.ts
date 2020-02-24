import { Collection, Type } from "fireorm";
import BaseModel from "./base_model";
import { TagColors } from "./field_types";

class GenericTag {
    name: string;
    @Type(() => TagColors)
    color: TagColors;
}

@Collection('user')
export class User extends BaseModel{
    email: string;
    auth: string;
}

@Collection('tag')
export class Tag extends BaseModel implements GenericTag{

}

export default {User, Tag};