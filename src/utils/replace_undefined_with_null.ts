export function replace_undefined_by_null(obj: Object): Object {
    
    for ( let prop in obj ) {
        if ( obj[prop] === undefined ) {
            obj[prop] = null;
        } else if ( typeof obj[prop] === "object" ) {
            obj[prop] = replace_undefined_by_null(obj[prop]);
        }
    }
    return obj;
}
export function replace_null_by_undefined(obj: Object): Object {
    
    for ( let prop in obj ) {
        if ( obj[prop] === null ) {
            obj[prop] = undefined;
        } else if ( typeof obj[prop] === "object" ) {
            obj[prop] = replace_null_by_undefined(obj[prop]);
        }
    }
    return obj;
}