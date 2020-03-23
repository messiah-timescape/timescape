import { InstanstiableIEntity, CustomRepository } from "fireorm";

export function HandlesTime(entity: InstanstiableIEntity): Function {
    return function(target: Function) {
        CustomRepository(entity)(target);
        return 
    };
  }