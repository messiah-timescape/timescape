import firebase from "firebase";
import { Collection, getRepository, BaseFirestoreRepository, SubCollection, ISubCollection } from "fireorm";
import {Type} from "class-transformer"
import Weekdays from "../utils/weekdays";
import moment, { Moment, Duration } from "moment";
import BaseModel from "./base_model";
import { Task } from "./task";
import { date_field, duration_field } from "./field_types";

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
    constructor(init_fields?:object) {
        Object.assign(this, init_fields);
    }
    
    @date_field
    work_start_time!: Moment;
    
    @date_field
    work_stop_time!: Moment;
    
    work_days!:Weekdays[];

    @date_field
    sleep_start!:Moment;
    
    @date_field
    sleep_stop!:Moment;

    @duration_field
    overwork_limit!:Duration;
}


@Collection('user')
export class User extends BaseModel{
    constructor(init_fields?:Partial<User>) {
        super();
        Object.assign(this, init_fields);

    }
    id!: string;
    email!: string;
    display_name!: string;

    @Type(() => UserSettings)
    settings: UserSettings = {
        work_start_time:moment().hours(8),
        work_stop_time: moment().hours(16),
        work_days:[Weekdays.Monday],
        sleep_start:moment().hours(20),
        sleep_stop:moment().hours(7),
        overwork_limit: moment.duration(3, 'hours')
    };
    @SubCollection(Task)
    tasks!: ISubCollection<Task>;

    static create_from_json(json_str:string): User {
        let user_obj = JSON.parse(json_str);
        return new User(user_obj);
    }
}