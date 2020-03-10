import firebase from "firebase";
import { Collection, getRepository, BaseFirestoreRepository, SubCollection, ISubCollection } from "fireorm";

import Weekdays from "../utils/weekdays";
import moment from "moment";
import BaseModel from "./base_model";
import { Task } from "./task";

export enum UserProvider{
    Google = "Google",
    Email = "Email"
}

export class FirebaseUser{
    uid!: string | null;
    email!: string | null;
    password!: string | null;
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

    async user():Promise<User>{
        return (await this.create_or_load_user()).user;
    }

    async create_or_load_user():Promise<{user:User,new:boolean}> {
        let org_user = await this.load_user();
        
        let user:User = (org_user)?org_user:await this.create_user();
        return {
            user: user,
            new: !org_user
        };
    }

    create_user():Promise<User> {
        let new_user = new User({
            id: this.uid + '',
            email: this.email + '',
            display_name: this.display_name!
        });
        return this.user_repo.create(new_user);
    }

    load_user():Promise<User|null> {
        let user_repo = getRepository(User);
        if (!this.uid) {
            throw new Error("No user");
        }
        return user_repo.findById(this.uid);
    }
}


export class UserSettings {
    work_start_time!: Date;
    work_stop_time!: Date;
    work_days!:Weekdays[];
    sleep_start!:Date;
    sleep_stop!:Date;
    overwork_limit!:string;
}


@Collection('user')
export class User extends BaseModel<User>{
    constructor(init_fields?:Partial<User>) {
        super();
        Object.assign(this, init_fields);

    }
    id!: string;
    email!: string;
    display_name!: string;
    settings: UserSettings = {
        work_start_time:moment().hours(8).toDate(),
        work_stop_time: moment().hours(16).toDate(),
        work_days:[Weekdays.Monday],
        sleep_start:moment().hours(20).toDate(),
        sleep_stop:moment().hours(7).toDate(),
        overwork_limit: moment.duration(3, 'hours').toISOString()
    };
    @SubCollection(Task)
    tasks!: ISubCollection<Task>;

    static create_from_json(json_str:string): User {
        let user_obj = JSON.parse(json_str);
        return new User(user_obj);
    }
}