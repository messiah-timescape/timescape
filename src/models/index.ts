import firebase from "firebase";
import { Collection, getRepository, Type, BaseFirestoreRepository } from "fireorm";
import BaseModel from "./base_model";
import { TagColors } from "./field_types";
import Weekdays from "../utils/weekdays";
import moment from "moment";

class GenericTag extends BaseModel<GenericTag>{
    name!: string;
    color!: TagColors;
}

export enum UserProvider{
    Google = "Google",
    Email = "Email"
}

export class FirebaseUser{
    uid!: string | null;
    email!: string | null;
    display_name!: string | null;
    phone_number!: string | null;
    photo_url!: string | null;
    provider: UserProvider = UserProvider.Email;
    google_access_token?: string;

    user_repo:BaseFirestoreRepository<User>;

    constructor(init_fields?:Partial<FirebaseUser>) {
        Object.assign(this, init_fields);
        this.user_repo = getRepository(User);
    }

    static create_from_firebase(user:firebase.User):FirebaseUser {
        return new FirebaseUser({
            uid: user.uid,
            email: user.email,
            display_name: user.displayName,
            phone_number: user.phoneNumber,
            photo_url: user.photoURL
        });
        
    }

    async user():Promise<User|null>{
        return this.create_or_load_user();
    }

    async create_or_load_user():Promise<User|null> {
        let user = await this.load_user();
        return (user)?user:this.create_user();
    }

    create_user():Promise<User|null> {
        return this.user_repo.create(new User({
            'user_id': this.uid!
        }));
    }

    load_user():Promise<User|null> {
        let user_repo = getRepository(User);
        return user_repo.whereEqualTo('user_id', this.uid).findOne();
    }
}


export class UserSettings {
    work_start_time: Date = moment().hours(8).toDate();
    work_stop_time: Date =  moment().hours(16).toDate();
    work_days:Weekdays[] = [Weekdays.Monday];
    sleep_start:Date = moment().hours(20).toDate();
    sleep_stop:Date =  moment().hours(7).toDate();
    overwork_limit:string = moment.duration(3, 'hours').toISOString();
}

@Collection('user')
export class User extends BaseModel<User>{
    user_id!: string;
    @Type(()=> UserSettings)
    settings: UserSettings = new UserSettings();
}


@Collection('tag')
export class Tag extends GenericTag{
    
}

export default {FirebaseUser, User, Tag};