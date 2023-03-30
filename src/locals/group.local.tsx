import { IGroup } from "../interfaces/IGroup.js";


export const setLocalGroup = (group:IGroup) => {
    let groups = localGroups();

    if (group.Id==="0")
        group.Id = (groups.length+1).toString();

    let newGroups = groups.filter(_=>_.Id !== group.Id);

    newGroups.push(group);

    setLocalGroups(newGroups);
}

export const localGroups = (): IGroup[] => {

    let data = localStorage.getItem('groups') as string;

    const groups = (data)?JSON.parse(data):undefined;

    return groups;
}

export const setLocalGroups = (groups: IGroup[]) => {

    localStorage.setItem('groups', JSON.stringify(groups));

}   