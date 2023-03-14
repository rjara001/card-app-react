import axios from "axios"
import config from "../config.json"
import { IApiConfig } from "../interfaces/api.config";

function getUrl(item: IApiConfig): string {
    return item.host + item.url;
}

export const queryGroupList = async () => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },
        data: null
      };

    return await axios.get(getUrl(config.grupos), axiosConfig);
}

export const queryGroupEdit = async (id:string) => {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        },
        data: null
      };

    return await axios.get(getUrl(config.grupo) + '/' + id, axiosConfig);
}