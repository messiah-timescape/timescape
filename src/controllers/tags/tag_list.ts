import { CollectionList } from "../model_list";
import { Tag } from "../../models";

class TagList extends CollectionList<Tag>{
  tags = this.model_array;
  static async create(change_state: Function,  initial_length?):Promise<TagList> {
    let list = super._create<Tag,TagList>(TagList, "tags", change_state, initial_length);
    return list;
  }
}

function tag_sync(change_state: Function): Promise<TagList> {
  return new Promise<TagList>(async (resolve, reject) => {
    resolve(await TagList.create(change_state));
  });
}

export default tag_sync;