import { IGroup } from "../interfaces/IGroup.js";


export const setLocalGroup = (group:IGroup) => {
    let groups = localGroups();

    let newGroups = groups.filter(_=>_.Name !== group.Name);

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