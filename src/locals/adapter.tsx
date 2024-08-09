import { group } from "console";
import { mutationPostUser, mutationPutUser, queryGetUser } from "../hooks/group.hook";
import { IGroup } from "../interfaces/IGroup";
import { IUser } from "../interfaces/IUser";
import { User } from "../models/User";
import { checkGroupConsistency, globalUserDefault } from "../util/util";
import { localGroups, setLocalGroup, setLocalGroups } from "./group.local";
import { Group } from "../models/Group";
import { UserInfo } from "os";
import { IUserInfo } from "../interfaces/IUserInfo";
import { saveToDrive } from "./drive";
import { queryGetContentAllTableFile } from "../hooks/google.hook";
import { IFileItem } from "../interfaces/Drive/IFileItem";
import { StatusChange } from "../models/Enums";
import { loadFolder } from "./google/helper";


const getUserFromAPI = async (user:IUserInfo) => {
    
    // const resp = (await queryGetUser(idUser, token)).data;

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

const getGroup = async (user: IUserInfo, idGroup: string) => {
    if (idGroup)
    {
        let groups = await getGroups(user);

        let group = groups.find(_ => _.Id.toString() === idGroup);

        return checkGroupConsistency(group);
    }
    
    return undefined;
}

const getGroups = async (user:IUserInfo) => {
    const data : IGroup[] | undefined = localGroups(user.UserId);

    let groups = (data && data.length > 0) ? data : (await getUserFromAPI(user) as IUser).Groups;

    return groups;
}

const setGroup = async (idUser: string, group: IGroup, doCloud: boolean = false) => {
    if (group != null && group.Name != undefined && group.Name != '') {
        const groups = localGroups(idUser).filter(_ => _.Id !== group.Id);

        group.LastModified = new Date();
        groups.push(group);

        setLocalGroups(idUser, groups);

        if (doCloud)
            await mutationPutUser(new User(idUser, groups));
    }
}

const setSync = async (user:IUserInfo) => {
    let groupsFromCoud = (await getUserFromAPI(user) as IUser).Groups;

    let groupsLocal = localGroups(user.UserId);

    if (groupsFromCoud.length >= groupsLocal.length) {
        groupsFromCoud.forEach(groupCloud => {
            groupCloud.LastModified = groupCloud.LastModified===undefined?new Date():groupCloud.LastModified;

            const _local = groupsLocal.find(_ => _.Id === groupCloud.Id);

            if (_local === undefined)
                groupsLocal.push(groupCloud);
            else
                if (_local.LastModified < groupCloud.LastModified)
                    {
                        groupsLocal = groupsLocal.filter(_=>_.Id!==groupCloud.Id);
                        groupsLocal.push(groupCloud);
                    }
        });
    }
    else
        groupsLocal.forEach(groupLocal => {
            const _cloud = groupsFromCoud.find(_ => _.Id === groupLocal.Id);

            if (_cloud !== undefined && _cloud.LastModified < groupLocal.LastModified)
            {
                groupsLocal = groupsLocal.filter(_=>_.Id!==groupLocal.Id);
                groupsLocal.push(_cloud);
            }
        });

    setLocalGroups(user.UserId, groupsLocal);
}

const setGroups = async (idUser: string) => {
    const groups = localGroups(idUser);

    await mutationPutUser(new User(idUser, groups));
}

const deleteGroup = async (idUser: string, group: IGroup, doCloud: boolean = false) => {
    const groups = localGroups(idUser).filter(_ => _.Id !== group.Id);

    setLocalGroups(idUser, groups);

    if (doCloud)
        await mutationPutUser(new User(idUser, groups));
}

const historify = async (idUser:string, group: IGroup) => {
    const _HistoryGroup = localGroups(idUser).find(_ => _.Id === Group.HISTORY_ID) || Group.NewGroupHistory();
    const wordsLearned = group.Words.filter(_=>_.IsKnowed && _.Cycles === 0);

    group.Words = group.Words.filter(_=>!(_.IsKnowed && _.Cycles === 0));

    setGroup(idUser, group);

    _HistoryGroup.Words.push(... wordsLearned);

    setGroup(idUser, _HistoryGroup);

}
const setUser = (user:IUserInfo) => {
    // if (user.UserId!=='' && !user.IsInLogin)
        localStorage.setItem('__user', JSON.stringify(user));
}

const getUser = () => {
    return JSON.parse(localStorage.getItem('__user') || JSON.stringify(globalUserDefault)) as unknown as IUserInfo;
}

const setDrive = ( user: IUserInfo) => {
    const groups = localGroups(user.UserId);

    saveToDrive(user, groups);
}

export const Adapter = {
    getGroup
    , getGroups
    , setGroup
    , deleteGroup
    , setGroups
    , setDrive
    , setSync
    , historify
    , setUser
    , getUser
}
