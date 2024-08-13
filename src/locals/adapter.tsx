import { group } from "console";
import { mutationPostUser, mutationPutUser, queryGetUser } from "../hooks/group.hook";
import { IGroup, IUserGroup } from "../interfaces/IGroup";
import { IUser } from "../interfaces/IUser";
import { User } from "../models/User";
import { checkGroupConsistency, globalUserDefault } from "../util/util";

import { Group } from "../models/Group";
import { UserInfo } from "os";
import { IUserInfo } from "../interfaces/IUserInfo";
import { saveToDrive } from "./drive";
import { queryGetContentAllTableFile } from "../hooks/google.hook";
import { IFileItem } from "../interfaces/Drive/IFileItem";
import { StatusChange } from "../models/Enums";
import { loadFolder, saveGroup } from "./google/helper";
import { _USER } from "../constants/constants";


const getUserAndAllGroupsFromAPI = async (user:IUserInfo) => {
    
    let _user: IUser = new User(user.UserId, user.Groups);

    await loadFolder(user);

    const fileDictionary: { [key: string]: IFileItem } = await queryGetContentAllTableFile(user);
    const files: IFileItem[] = Object.values(fileDictionary);

    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        _user.Groups.push(new Group(element.content, StatusChange.Updated));
    }

    return User.newUser(_user);
}

const setUser = (user:IUserInfo) => {
    // if (user.UserId!=='' && !user.IsInLogin)
        localStorage.setItem(_USER, JSON.stringify(user));
}

const getUser = async (): Promise<IUserInfo> => {
    let user = JSON.parse(localStorage.getItem(_USER) || JSON.stringify(globalUserDefault)) as IUserInfo;

    if (!user || user.Groups.length === 0) {
        user = await getUserAndAllGroupsFromAPI(user) as IUserInfo;
    }

    return user;
};

// const getGroup = async (user: IUserInfo, idGroup: string) => {
//     if (idGroup)
//     {
//         let groups = await getGroups(user);

//         let group = groups.find(_ => _.Id.toString() === idGroup);

//         return checkGroupConsistency(group);
//     }
    
//     return undefined;
// }

// const getGroups = async (user:IUserInfo) => {
//     const data : IGroup[] | undefined = localGroups(user.UserId);

//     let groups = (data && data.length > 0) ? data : (await getUserAndAllGroupsFromAPI(user) as IUser).Groups;

//     return groups;
// }

const setGroup = async (user: IUserInfo, group: IGroup) => {
    if (group && group.Name) {
        // Create a new group object with the updated last modified date
        const updatedGroup = { ...group, LastModified: new Date() };

        // Create a new groups array with the added group
        const updatedGroups = [...user.Groups, updatedGroup];

        // Create a new user object with the updated groups
        const updatedUser = { ...user, Groups: updatedGroups };

        // Update the user state with the new user object
        setUser(updatedUser);
    }
};


const setSync = async (user:IUserInfo) => {
    // let groupsFromCoud = (await getUserAndAllGroupsFromAPI(user) as IUser).Groups;

    let groupsLocal: IGroup[] = user.Groups; //localGroups(user.UserId);

    groupsLocal.filter(group=>group.Status !== StatusChange.None 
            && group.Status === StatusChange.Created).forEach(async group => {

        await saveGroup(user, group);
    });

    // if (groupsFromCoud.length >= groupsLocal.length) {
    //     groupsFromCoud.forEach(groupCloud => {
    //         groupCloud.LastModified = groupCloud.LastModified===undefined?new Date():groupCloud.LastModified;

    //         const _local = groupsLocal.find(_ => _.Id === groupCloud.Id);

    //         if (_local === undefined)
    //             groupsLocal.push(groupCloud);
    //         else
    //             if (_local.LastModified < groupCloud.LastModified)
    //                 {
    //                     groupsLocal = groupsLocal.filter(_=>_.Id!==groupCloud.Id);
    //                     groupsLocal.push(groupCloud);
    //                 }
    //     });
    // }
    // else
    //     groupsLocal.forEach(groupLocal => {
    //         const _cloud = groupsFromCoud.find(_ => _.Id === groupLocal.Id);

    //         if (_cloud !== undefined && _cloud.LastModified < groupLocal.LastModified)
    //         {
    //             groupsLocal = groupsLocal.filter(_=>_.Id!==groupLocal.Id);
    //             groupsLocal.push(_cloud);
    //         }
    //     });

    setUser(user);
}

// const setGroups = async (idUser: string) => {
//     const groups = localGroups(idUser);

//     await mutationPutUser(new User(idUser, groups));
// }

const deleteGroup = async (user: IUserInfo, group: IGroup) => {
    // Create a new array of groups excluding the group to be deleted
    const updatedGroups = user.Groups.filter(g => g.Id !== group.Id);

    // Create a new user object with the updated groups
    const updatedUser = { ...user, Groups: updatedGroups };

    // Update the user state
    setUser(updatedUser);
};

const historify = async (user: IUserInfo, group: IGroup) => {
    // Find or create the history group
    const historyGroup = user.Groups.find(g => g.Id === Group.HISTORY_ID) || Group.NewGroupHistory();

    // Separate words that are learned (IsKnowed and Cycles === 0) from those that aren't
    const wordsLearned = group.Words.filter(word => word.IsKnowed && word.Cycles === 0);
    const remainingWords = group.Words.filter(word => !(word.IsKnowed && word.Cycles === 0));

    // Update the group with the remaining words
    const updatedGroup = { ...group, Words: remainingWords };

    // Update the history group with the learned words
    const updatedHistoryGroup = {
        ...historyGroup,
        Words: [...historyGroup.Words, ...wordsLearned]
    };

    // Replace the old group and history group in the user's groups
    const updatedGroups = user.Groups.map(g =>
        g.Id === group.Id ? updatedGroup : g.Id === historyGroup.Id ? updatedHistoryGroup : g
    );

    // Create a new user object with the updated groups
    const updatedUser = { ...user, Groups: updatedGroups };

    // Update the user state
    setUser(updatedUser);
};


// const setDrive = ( user: IUserInfo) => {
//     const groups = localGroups(user.UserId);

//     saveToDrive(user, groups);
// }

export const Adapter = {
    setSync
    , historify
    , setUser
    , getUser
    , deleteGroup
    , setGroup
}
