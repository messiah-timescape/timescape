import moment, {Duration} from "moment";

import { Type, Transform } from "class-transformer";
import CurrentUser from "../controllers/user";

export function date_field(target: any, propertyKey: string) {
    
    Type(() => Date)(target, propertyKey);
    Transform(value => (value)?moment(value):null, { toClassOnly: true })(target, propertyKey);
    Transform(value => (value)?value.toDate():null, { toPlainOnly: true })(target, propertyKey);
}

export function duration_field(target: any, propertyKey: string) {
    Type(() => String)(target, propertyKey);
    Transform(value => moment.duration(value), { toClassOnly: true })(target, propertyKey);
    Transform((value:Duration) => value.toISOString(), { toPlainOnly: true })(target, propertyKey);
}

export class UsermodelDto<T>{
    model?: T;
    promise: Promise<T>;
    constructor(promise: Promise<T> | T) {
        if (promise instanceof Promise) {
            let that = this;
            promise.then((model) => {
                that.model = model;
            });
            this.promise = promise;
        } else {
            this.model = promise;
            this.promise = new Promise<T>( resolve => resolve(promise) );
        }
    }
}

// export type UsermodelDto<T> = UsermodelDtoCls<T> | T

export function usermodel_field(collection_name?:string){
    return function (target: any, propertyKey:string) {
        Type(() => String)(target, propertyKey);
        
        let prop = target[propertyKey];
        Transform(
            (value) => {
                return (value)?(new UsermodelDto<typeof prop>(CurrentUser.get_loggedin().then(
                    user => user[collection_name || propertyKey].findById(value))
                )):null;
            },
            { toClassOnly: true } 
        )(target, propertyKey);
        Transform(value => {
            if (!value) {
                return null;
            }
            if (value.model) {
                return value.model.id;
            } else {
                console.error(value, target, propertyKey);
                throw new Error("Make sure to wait for " + typeof target + "." + propertyKey + " to resolve first");
            }
        }, { toPlainOnly: true })(target, propertyKey);
    }
}

export enum TagColors {
    red = 'red',
    green = 'green',
    blue = 'blue',
    purple = 'purple',
    gray = 'gray'
}

