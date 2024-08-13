import { queryGetContentAllTableFile, queryGetValidateTokenAccess, queryLoadIdFoler} from "../../hooks/google.hook";
import { IUserInfo } from "../../interfaces/IUserInfo";
import { IGroup } from "../../interfaces/IGroup";

const getValidateTokenAccessFromAPI = async (user: IUserInfo) => {
    
    const resp = await queryGetValidateTokenAccess(user);

    return resp;
}

const mutationGroupToFile = async (group:IGroup) => {
    
    await mutationGroupToFile(group);
}

const getContentAllWords = async (user: IUserInfo)=> {
    await queryGetValidateTokenAccess(user);

    await queryLoadIdFoler(user);

    return await queryGetContentAllTableFile(user);
}

// public async Task loadFolder(string folder)
// {
//     if (_session.User.Drive.IdFolder == null)
//         await loadIdFoler(folder);
// }

export const Adapter = {
    getValidateTokenAccess : getValidateTokenAccessFromAPI
    , getContentAllWords
}
