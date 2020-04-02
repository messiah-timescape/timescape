import moment, {Duration} from "moment";

import { Type, Transform } from "class-transformer";
import { firestore } from "firebase";
import CurrentUser from "../controllers/user";

export function date_field(target: any, propertyKey: string) {
    
    Type(() => Date)(target, propertyKey);
    Transform(value => moment(value), { toClassOnly: true })(target, propertyKey);
    Transform(value => value.toDate(), { toPlainOnly: true })(target, propertyKey);
}

export function duration_field(target: any, propertyKey: string) {
    Type(() => String)(target, propertyKey);
    Transform(value => moment.duration(value), { toClassOnly: true })(target, propertyKey);
    Transform((value:Duration) => value.toISOString(), { toPlainOnly: true })(target, propertyKey);
}

export function usermodel_field(target: any, propertyKey:string) {
    Type(() => firestore.DocumentReference)(target, propertyKey);
    Transform(
        value => (value)?CurrentUser.get_loggedin().then(user => user.tags.findById(value)):null,
        { toClassOnly: true }    
    )(target, propertyKey);
    Transform(value => (value)?value.id:null, { toPlainOnly: true })(target, propertyKey);
}

export enum TagColors {
    red = 0xf00,
    green = 0x0f0,
    blue = 0x00f
}

