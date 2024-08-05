import { IUserInfo } from "../../interfaces/IUserInfo";
import { User } from "../../models/User";
import { Adapter } from "./adapter.google";


async function getUserFromDrive(user:IUserInfo) {
    if (user.Words.length > 0)
        return user;

    var userLoaded = await loadUserAndTables(user);

    // user.SetTables(userLoaded.TablesToList());
    // user.Drive = userLoaded.Drive;

    // await _logger.Trace($"TablesCount:{user.Tables.Count()}");

    return user;
}
async function handleTokenValidation(user:IUserInfo) {

    const isValid = await Adapter.getValidateTokenAccess(user);

    if (!User.hasRefreshToken(user) && !isValid) {
        // await logger.info("TokenExpired");
        throw new ExceptionTokenNull();
    } else if (!isValid) {
        // await logger.info("TokenExpired");
        user.AccessToken = await refreshAccessToken();
    }
}


async function refreshAccessToken(): Promise<string> {
    // Implementation of token refresh logic
    return "newAccessToken"; // Example return value
}
// function loadUserAndTables(user: IUserInfo) {
//     this._clientDrive.GetContentAllTable(Constants.DRIVE_FOLDER_NAME);
// }

