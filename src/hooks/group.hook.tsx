import axios from "axios"
import config from "./config.json"
import { IApiConfig } from "../interfaces/api.config";
import { IUser } from "../interfaces/IUser";
import { Group } from "../models/Group";

function getUrl(item: IApiConfig): string {
    return item.host + item.url;
}

export const queryGetUser = async (id: string) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },
        data: null
    };

    return await axios.get(getUrl(config.getUser) + '/' + id, axiosConfig);
}

export const mutationPutUser = async (user:IUser) => {
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },

    };

    const data = {... user, Groups: user.Groups?.map(_=>Group.toFlatGroup(_))}

    await axios.put(getUrl(config.postUser) + '/' + user.IdUser, data, axiosConfig);
}

export const mutationPostUser = async (user:IUser) => {
    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },

    };

    const data = {... user, Groups: user.Groups?.map(_=>Group.toFlatGroup(_))}

    await axios.post(getUrl(config.postUser) + '/' + user.IdUser, data, axiosConfig);
}