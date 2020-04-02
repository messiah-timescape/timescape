import moment, {Duration} from "moment";

import { Type, Transform } from "class-transformer";

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

export enum TagColors {
    red = 'red',
    green = 'green',
    blue = 'blue',
    purple = 'purple'
}

