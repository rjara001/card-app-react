import { mutationPostUser, mutationPutUser, queryGetUser } from "../hooks/group.hook";
import { IGroup } from "../interfaces/IGroup";
import { IUser } from "../interfaces/IUser";
import { User } from "../models/User";
import { checkGroupConsistency } from "../util/util";
import { localGroups, setLocalGroup, setLocalGroups } from "./group.local";


const getUserFromAPI = async (idUser: string) => {
    const resp = (await queryGetUser(idUser)).data;

    return User.newUser(resp);
}

const getGroup = async (idUser: string, idGroup: string) => {
    if (idGroup)
        return checkGroupConsistency((await getGroups(idUser)).find(_ => _.Id.toString() === idGroup));
    return undefined;
}

const getGroups = async (idUser: string) => {
    const data = localGroups();

    let groups = (data || (await getUserFromAPI(idUser) as IUser).Groups);

    return groups;
}

const setGroup = async (idUser: string, group: IGroup, doCloud: boolean = false) => {
    if (group != null && group.Name != undefined && group.Name != '') {
        const groups = localGroups().filter(_ => _.Id !== group.Id);

        groups.push(group);

        setLocalGroups(groups);

        if (doCloud)
            await mutationPutUser(new User(idUser, groups));
    }
}

const setGroups = async (idUser: string) => {
    const groups = localGroups();

    await mutationPutUser(new User(idUser, groups));
}

const deleteGroup = async (idUser: string, group: IGroup, doCloud: boolean = false) => {
    const groups = localGroups().filter(_ => _.Id !== group.Id);

    setLocalGroups(groups);

    if (doCloud)
        await mutationPutUser(new User(idUser, groups));
}

export const Adapter = {
    getGroup
    , getGroups
    , setGroup
    , deleteGroup
    , setGroups
}
