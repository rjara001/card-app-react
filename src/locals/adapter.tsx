import { mutationPostUser, mutationPutUser, queryGetUser } from "../hooks/group.hook";
import { IGroup } from "../interfaces/IGroup";
import { IUser } from "../interfaces/IUser";
import { User } from "../models/User";
import { localGroups } from "./group.local";


const getUserFromAPI = async (idUser: string) => {
    const resp = (await queryGetUser(idUser)).data;

    return User.newUser(resp);
}

const getGroup = async (idUser:string, idGroup: string) => {
    if (idGroup)
        return (await getGroups(idUser)).find(_=>_.Id.toString() === idGroup);
    return undefined;
}

const getGroups = async (idUser:string) => {
    const data = localGroups();

    let groups = (data || (await getUserFromAPI(idUser) as IUser).Groups);

    return groups;
}

const setGroup = async (idUser:string, group:IGroup) => {
    const groups = localGroups().filter(_=>_.Id !==group.Id);

    groups.push(group);

    await mutationPutUser(new User(idUser, groups));
}

export const Adapter =  {
    getGroup
    , getGroups
    , setGroup
}
