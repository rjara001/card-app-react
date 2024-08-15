import { _USER } from "../constants/constants";
import { IGroup } from "../interfaces/IGroup";
import { IUserInfo } from "../interfaces/IUserInfo";


// export const setLocalGroup = (userId: string, group: IGroup) => {
//     let groups = localGroups();

//     if (group.Id === "0")
//         group.Id = (groups.length + 1).toString();

//     let newGroups = groups.filter(_ => _.Id !== group.Id);

//     newGroups.push(group);

//     setLocalGroups(userId, newGroups);
// }

export const localGroups = (): IGroup[] => {
    const data = localStorage.getItem(_USER);

    if (!data) {
        return [];
    }

    const user = JSON.parse(data) as IUserInfo | undefined;

    return user?.Groups ?? [];
};


export const setLocalGroup = (user: IUserInfo, group: IGroup) => {
    if (!group?.Name) return;

    const existingGroup = user.Groups.find(g => g.Id === group.Id);

    if (existingGroup) {
        Object.assign(existingGroup, group);
    } else {
        
        if (group.Id === "0")
            group.Id = (user.Groups.length + 1).toString();
        user.Groups.push(group);
    }

    localStorage.setItem(_USER, JSON.stringify(user));
};
