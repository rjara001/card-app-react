import { mutationPutUser, queryGetUser } from "../hooks/group.hook";
import { IGroup } from "../interfaces/IGroup";
import { IUser } from "../interfaces/IUser";
import { User } from "../models/User";
import { checkGroupConsistency, globalUserDefault } from "../util/util";
// import { localGroups, setLocalGroups } from "./group.local";
import { Group } from "../models/Group";
import { IUserInfo } from "../interfaces/IUserInfo.js";
import { groupSchema } from "../schemas/groups";
import * as yup from "yup";
import { Bugfender } from "@bugfender/sdk";


const getUserFromAPI = async (idUser: string) => {
  const resp = (await queryGetUser(idUser)).data;

  return User.newUser(resp);
};

const getGroup = async (idUser: string, idGroup: string) => {
  if (idGroup) {
    Bugfender.log("idUser:" + idUser);
    let groups = await getGroups(idUser);

    Bugfender.log("groups:" + groups.length);

    let group = groups.find((_) => _.Id.toString() === idGroup);

    Bugfender.log("group:" + JSON.stringify(group));

    return checkGroupConsistency(group);
  }

  return undefined;
};

const getGroups = async (idUser: string) => {
  const data = (getLocalGroups() as IGroup[]) || [];

    const _valid = yup.array(groupSchema).isValidSync(data);
  
    let groups = data;

    if (!_valid || data.length === 0)
        groups = (await getUserFromAPI(idUser) as IUser).Groups;

  if (data.length === 0)
    groups = ((await getUserFromAPI(idUser)) as IUser).Groups;

  return groups;
};

const setLocalGroup = (group: IGroup) => {
  if (group != null && group.Name != undefined && group.Name != "") {
    const groups = getLocalGroups().filter((_) => _.Id !== group.Id);

    group.LastModified = new Date();
    groups.push(group);

    setLocalGroups(groups);

    return true;
  }
};

const setGroup = async (
  idUser: string,
  group: IGroup,
  doCloud: boolean = false
) => {
  if (!setLocalGroup(group)) return;

  if (doCloud) {
    const groups = getLocalGroups().filter((_) => _.Id !== group.Id);
    await mutationPutUser(new User(idUser, groups));
  }
};

const setSync = async (idUser: string) => {
  let groupsFromCoud = ((await getUserFromAPI(idUser)) as IUser).Groups;

  let groupsLocal = getLocalGroups();

  if (groupsFromCoud.length >= groupsLocal.length) {
    groupsFromCoud.forEach((groupCloud) => {
      groupCloud.LastModified =
        groupCloud.LastModified === undefined
          ? new Date()
          : groupCloud.LastModified;

      const _local = groupsLocal.find((_) => _.Id === groupCloud.Id);

      if (_local === undefined) groupsLocal.push(groupCloud);
      else if (_local.LastModified < groupCloud.LastModified) {
        groupsLocal = groupsLocal.filter((_) => _.Id !== groupCloud.Id);
        groupsLocal.push(groupCloud);
      }
    });
  } else
    groupsLocal.forEach((groupLocal) => {
      const _cloud = groupsFromCoud.find((_) => _.Id === groupLocal.Id);

      if (
        _cloud !== undefined &&
        _cloud.LastModified < groupLocal.LastModified
      ) {
        groupsLocal = groupsLocal.filter((_) => _.Id !== groupLocal.Id);
        groupsLocal.push(_cloud);
      }
    });

  setLocalGroups(groupsLocal);
};

const mutationGroups = async (idUser: string) => {
  const groups = getLocalGroups();

  await mutationPutUser(new User(idUser, groups));
};

const deleteGroup = async (
  idUser: string,
  group: IGroup,
  doCloud: boolean = false
) => {
  const groups = getLocalGroups().filter((_) => _.Id !== group.Id);

  setLocalGroups(groups);

  if (doCloud) await mutationPutUser(new User(idUser, groups));
};

const historify = async (idUser: string, group: IGroup) => {
  const _HistoryGroup =
    getLocalGroups().find((_) => _.Id === Group.HISTORY_ID) ||
    Group.NewGroupHistory();
  const wordsLearned = group.Words.filter((_) => _.IsKnowed && _.Cycles === 0);

  group.Words = group.Words.filter((_) => !(_.IsKnowed && _.Cycles === 0));

  setGroup(idUser, group);

  _HistoryGroup.Words.push(...wordsLearned);

  setGroup(idUser, _HistoryGroup);
};
const setUser = (user: IUserInfo) => {
  localStorage.setItem("__user", JSON.stringify(user));
};

const getUser = () => {
  return JSON.parse(
    localStorage.getItem("__user") || JSON.stringify(globalUserDefault)
  ) as unknown as IUserInfo;
};

const cleanLocalGroups = () => {
  setLocalGroups([]);
};

const getLocalGroups = (): IGroup[] => {
    let data = localStorage.getItem('groups') as string;

    let groups = [];
    
    try {
        groups = (data)?JSON.parse(data):undefined;
    } catch (error) {
        
    }
   

  return groups;
};

const setLocalGroups = (groups: IGroup[]) => {
  localStorage.setItem("groups", JSON.stringify(groups));
};

export const Adapter = {
  getGroup,
  getGroups,
  setGroup,
  deleteGroup,
  mutationGroups: mutationGroups,
  setSync,
  historify,
  setUser,
  getUser,
  cleanLocalGroups,
  setLocalGroup,
  getLocalGroups,
  setLocalGroups,
};
