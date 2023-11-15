import { IGroup } from "../interfaces/IGroup";
import { Adapter } from "./adapter";


export const setLocalGroup = (group:IGroup) => {
    Adapter.setLocalGroup(group);
    // let groups = localGroups();

    // if (group.Id==="0")
    //     group.Id = (groups.length+1).toString();

    // let newGroups = groups.filter(_=>_.Id !== group.Id);

    // newGroups.push(group);

    // setLocalGroups(newGroups);
}

export const getLocalGroups = (): IGroup[] => {

    return Adapter.getLocalGroups();
}

export const setLocalGroups = (groups: IGroup[]) => {

    Adapter.setLocalGroups(groups);

}   