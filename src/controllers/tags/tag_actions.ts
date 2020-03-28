import { Tag } from "../../models";
import CurrentUser from "../user";

export let create_tag = async (input_tag:Partial<Tag>)=> {
    let curr_user = await CurrentUser.get_loggedin();
    let tag = new Tag().fill_fields(input_tag);
    
    return await curr_user.tags!.create(tag);
} 

export let delete_tag = async (tag_id:string)=> {
    let curr_user = await CurrentUser.get_loggedin();
    return await curr_user.tags!.delete(tag_id);
}

export let update_tag = async (tag_id:string, input_tag:Partial<Tag>)=> {
    let curr_user = await CurrentUser.get_loggedin();
    let tag = await curr_user.tags!.findById(tag_id);
    
    for(let index in input_tag) {
        if(input_tag[index] !== undefined) {
            tag[index] = input_tag[index];
        }
    }
    return await curr_user.tags!.update(tag!)
}