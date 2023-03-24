import { queryGroupEdit, queryGroupList } from "../hooks/group.hook";
import { IGroup } from "../interfaces/IGroup";
import { localGroups } from "./group.local";

const getGroup = async (idGroup: string) => {
    const data = (localGroups() || []).find(_=>_.Id.toString() === idGroup);

    let group = (data || (await queryGroupEdit(idGroup))?.data) as IGroup;

    return group;
    // const { data } = await queryGroupEdit(userInfo.PlayingGroup.toString());
}

const getGroups = async () => {
    const data = localGroups();
        
    let groups = (data || (await queryGroupList())?.data) as IGroup[];

    return groups;
}

export const Adapter = {
    getGroup
    , getGroups
}
