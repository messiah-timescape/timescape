import tag_sync from "./tag_list";
import init_app from "../../init_app";
import firebase from "firebase";
import { Tag } from "../../models/tag";
import { create_tag, delete_tag } from "./tag_actions";
import { TestLoginActions } from "../user/login.test";
import CurrentUser from "../user";
import { TagColors } from "../../models/field_types";

describe("Tag List", ()=> {
    beforeAll(async () => {
        init_app();
        return await TestLoginActions.email_password();
    });

    it('should retrieve an initial list of tags when called', async done => {
        expect.assertions(2);
        let tag_list = await tag_sync(()=>{
            expect(tag_list.tags.length).toBeGreaterThan(0);
            expect(tag_list.tags[0]).toBeInstanceOf(Tag);

            done();
        });
        
    });

    it('creates tag', async ()=> {
        let tag:Tag;
        let tag_name = "Tag 1";
        try{
            tag = await create_tag({
                name: tag_name,
            });
        } catch(err) {
            throw err;
        }
        if(tag !== undefined) {
            return expect(tag.name).toBe(tag_name);
        }
        else throw new Error("\nMESSAGE from create_tag.test.ts: Tag is undefined.\n");
    });

    it('deletes the tag', async ()=> {
        let tag = await create_tag({name: "Testing Deleted", color: TagColors.red});
        await delete_tag(tag.id);
        let curr_user = await CurrentUser.get_user();
        tag = await curr_user!.tags!.findById(tag.id);
        return expect(tag).toBe(null);
    });

    afterAll(async ()=> {
        let curr_user = await CurrentUser.get_loggedin();
        let completed_tag = await curr_user.tags.whereEqualTo("name", "Testing Completed").findOne();
        let created_tag = await curr_user.tags.whereEqualTo("name", "Check off as complete").findOne();
        await delete_tag(completed_tag!.id);
        await delete_tag(created_tag!.id);
        firebase.auth().signOut();
    })
});