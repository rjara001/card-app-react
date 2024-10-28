import { IUserInfo } from "../interfaces/IUserInfo";
import { isNullOrUndefinedOrBlank } from "../util/util";

export class Navigation {
    static getLastTrackingPage(user: IUserInfo) : Page {
        if (isNullOrUndefinedOrBlank(user.Navigation))
            user.Navigation = new Navigation();

        if (user.Navigation.Pages.length>0)
        { 
            return user.Navigation.Pages[user.Navigation.Pages.length-1];
        }

        return new Page("", "");
    }
    static TrackingAction(user: IUserInfo, page: string, action: string) : IUserInfo {
        if (isNullOrUndefinedOrBlank(user.Navigation))
            user.Navigation = new Navigation();

        if (user.Navigation.Pages.length>0)
        {
            const _page : Page = user.Navigation.Pages[user.Navigation.Pages.length-1];

            if (_page===null)
                user.Navigation.Pages.push(new Page(page, action));
            else
            {
                if (_page.Action.length)
                {
                    const action = _page.Action[_page.Action.length-1];
                    if (isNullOrUndefinedOrBlank(action))
                        _page.Action.push(action);
                }
            }
        }
        
        return user;
    }

    Pages: Page[]

    constructor() {
        this.Pages = [];
    }
}

export class Page {
    Action: string[]
    Name: string;

    constructor(name:string, action:string) {
        this.Name = name;
        
        this.Action = [];
        this.Action.push(action);
    }
}