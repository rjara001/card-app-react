import { IGroup, IUserGroup } from "../interfaces/IGroup";
import { UserGroup } from "../models/UserGroup";


export const setLocalGroup = (userId: string, group: IGroup) => {
    let groups = localGroups(userId);

    if (group.Id === "0")
        group.Id = (groups.length + 1).toString();

    let newGroups = groups.filter(_ => _.Id !== group.Id);

    newGroups.push(group);

    setLocalGroups(userId, newGroups);
}

export const localGroups = (userId: string): IGroup[] => {

    let data = (localStorage.getItem('groups') || '[]') as string;

    const groups = (data) ? JSON.parse(data) : undefined;

    return groups.find((_: IUserGroup) => _.userId === userId)?.groups;
}

export const setLocalGroups = (userId: string, groups: IGroup[]) => {

    const userGroups = JSON.parse(localStorage.getItem('groups') as string) || [];

    const userGroup = userGroups.find((_: IUserGroup) => _.userId === userId);

    if (!userGroup) {
         userGroups.push({ userId, groups }); 
        }
    else
        userGroup.groups = groups;

    localStorage.setItem('groups', JSON.stringify(userGroups));

}   