import { IGroup } from "../interfaces/IGroup";
import { IUser } from "../interfaces/IUser";
import { User } from "../models/User";
import { globalUserDefault } from "../util/util";

import { Group } from "../models/Group";
import { IUserInfo } from "../interfaces/IUserInfo";
import { queryGetContentAllTableFile } from "../hooks/google.hook";
import { IFileItem } from "../interfaces/Drive/IFileItem";
import { StatusChange } from "../models/Enums";
import { loadFolder, saveGroup, TokenValidation } from "./google/helper";
import { _USER } from "../constants/constants";
import { IWord } from "../interfaces/IWord";


const getUserAndAllGroupsFromAPI = async (user: IUserInfo) : Promise<IUserInfo> => {
    await TokenValidation(user);

    let _user: IUserInfo = { ...user, Groups:[]}

    await loadFolder(user);

    const fileDictionary: { [key: string]: IFileItem } = await queryGetContentAllTableFile(user);
    const files: IFileItem[] = Object.values(fileDictionary);

    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        _user.Groups.push(Group.toGroup(element.id, element.name, element.content));
    }

    Adapter.setUser(_user);

    return _user;
}

const setLocalStoreUser = (user: IUserInfo) => {
    // if (user.UserId!=='' && !user.IsInLogin)
    localStorage.setItem(_USER, JSON.stringify(user));
}

const getUser = async (): Promise<IUserInfo> => {
    let user = JSON.parse(localStorage.getItem(_USER) || JSON.stringify(globalUserDefault)) as IUserInfo;

    if (user.IsInLogin)
        if (!user || !user.Groups || user.Groups.length === 0) {
            user = await getUserAndAllGroupsFromAPI(user) as IUserInfo;
        }

    return user;
};

const setWordGroup = (group: IGroup, word: IWord) => {

    const updatedGroup = { ...group, Words: [...group.Words.filter(_=>_.Name !== word.Name), word] };

    return setGroup(group, updatedGroup);
}

const setGroup = (group: IGroup, updatedFields: Partial<IGroup>) => {
    return {
        ...group,
        ...updatedFields,                 // Override with any updated fields
        LastModified: new Date(),         // Always set the LastModified to the current date
        Status: StatusChange.Modified     // Always set the status to 'Modified'
    };

};

const downloadCloud = async (user: IUserInfo) : Promise<IUserInfo> => {
    const userUpdated = await getUserAndAllGroupsFromAPI(user) as IUserInfo;

    setLocalStoreUser(userUpdated);

    return userUpdated;
}

const uploadCloud = async (user: IUserInfo) => {

    let groupsLocal: IGroup[] = user.Groups; 

    let groupToSync = groupsLocal.filter(group => group.Status === StatusChange.Created
            || group.Status === StatusChange.Modified
            || group.Status === StatusChange.Deleted);
     
     for (const group of groupToSync) {
        await saveGroup(user, group);
    }

    setLocalStoreUser(user);
}

// const setGroups = async (idUser: string) => {
//     const groups = localGroups(idUser);

//     await mutationPutUser(new User(idUser, groups));
// }

// const deleteGroup = (user: IUserInfo, group: IGroup) => {
//     group.Status = StatusChange.Deleted;

//     return setGroup(user, group);
// };

const historify = (user: IUserInfo, group: IGroup) : IGroup => {
    // Find or create the history group
    if (group.Id===Group.HISTORY_ID)
        return group;

    const historyGroup = user.Groups.find(g => g.Id === Group.HISTORY_ID) || Group.NewGroupHistory();

    historyGroup.Words.forEach(_ => {
        _.Reveled = false;
        _.IsKnowed = false;
        _.Cycles = 0;
    })

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

    const historyGroupExisting = user.Groups.find(_=>_.Id === historyGroup.Id);
    
    if (historyGroupExisting ===undefined || historyGroupExisting === null)
        updatedGroups.push(updatedHistoryGroup);

    // Create a new user object with the updated groups
    user.Groups = [ ... updatedGroups];
    user.PlayingGroup = "0";

    const updatedUser = { ...user, Groups: updatedGroups };

    // Update the user state

    setLocalStoreUser(updatedUser);

    return updatedGroup;
};

// utils.ts or a similar utility file

export const updateUserGroups = (
    userInfo: IUserInfo,
    updatedGroup: IGroup,
    updateValue: (userInfo: IUserInfo) => void,
    Adapter: { setUser: (userInfo: IUserInfo) => void }
): IUserInfo => {
    // Update the user's groups collection
    const updatedGroups = userInfo.Groups.map(group =>
        group.Id === updatedGroup.Id ? updatedGroup : group
    );

    const updatedUserInfo = { ...userInfo, Groups: updatedGroups } as IUserInfo;

    // Update the context or state with the new user information
    updateValue(updatedUserInfo);
    Adapter.setUser(updatedUserInfo);

    return updatedUserInfo;
};

// const setDrive = ( user: IUserInfo) => {
//     const groups = localGroups(user.UserId);

//     saveToDrive(user, groups);
// }

export const Adapter = {
    uploadCloud
    , downloadCloud
    , historify
    , setUser: setLocalStoreUser
    , getUser
    // , deleteGroup
    , setGroup
    , setWordGroup
}
