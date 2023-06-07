import { group } from "console";
import { getGroupTemplate, mutationPostUser, mutationPutUser, queryGetUser } from "../hooks/group.hook";
import { IGroup } from "../interfaces/IGroup";
import { IUser } from "../interfaces/IUser";
import { User } from "../models/User";
import { checkGroupConsistency, globalUserDefault } from "../util/util";
import { localGroups, setLocalGroup, setLocalGroups } from "./group.local";
import { Group } from "../models/Group";
import { UserInfo } from "os";
import { IUserInfo } from "../interfaces/IUserInfo";
import { saveToDrive } from "./drive";
import { Word } from "../models/Word";


const getGroupFromTemplate = async () : Promise<IGroup> => {
    
    let _group = await getGroupTemplate();

    return _group.data;
}


const getUserFromAPI = async (idUser: string) => {
    const resp = (await queryGetUser(idUser)).data;

    return User.newUser(resp);
}

const getGroup = async (idUser: string, idGroup: string) => {
    if (idGroup)
    {
        let groups = await getGroups(idUser);

        let group = groups.find(_ => _.Id.toString() === idGroup);

        return checkGroupConsistency(group);
    }
    
    return undefined;
}

const getGroups = async (idUser: string) => {
    const data = localGroups(idUser);

    let groups = (data || (await getUserFromAPI(idUser) as IUser).Groups);

    return groups || [];
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

const setSync = async (idUser: string) => {
    let groupsFromCoud = (await getUserFromAPI(idUser) as IUser).Groups;

    let groupsLocal = localGroups(idUser);

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

    setLocalGroups(idUser, groupsLocal);
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
    , getGroupTemplate
}
