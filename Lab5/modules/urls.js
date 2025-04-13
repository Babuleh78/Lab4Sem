import { ACCESS_TOKEN, VK_API_VERSION } from './consts.js';

class Urls {
    constructor() {
        this.url = 'https://api.vk.com/method'
        this.commonInfo = `access_token=${ACCESS_TOKEN}&v=${VK_API_VERSION}`
    }

    getUsersInfo(userIds) {
        return `${this.url}/users.get?user_ids=${userIds.join(',')}&fields=photo_400,first_name,last_name,city,last_seen,status,sex&${this.commonInfo}`;
    }

    getGroupMembers(GROUP_ID) {
        return `${this.url}/groups.getMembers?group_id=${GROUP_ID}&${this.commonInfo}`
    }
}

export const urls = new Urls()