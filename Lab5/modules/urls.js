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

    getUltimate(user_id) {
        return `${this.url}/users.get?user_ids=${user_id}&fields=`
            + 'photo_200,photo_400,photo_max_orig,'  // качественные фото
            + 'first_name,last_name,nickname,maiden_name,'  // имя и его вариации
            + 'sex,bdate,city,country,domain,'  // основная информация
            + 'online,last_seen,status,'  // активность
            + 'relation,relatives,can_write_private_message,'  // социальные связи
            + 'education,universities,schools,occupation,career,'  // образование и работа
            + 'activities,interests,music,movies,tv,books,games,about,'  // интересы
            + 'counters,contacts,site,skype,facebook,twitter,instagram'  // контакты и соцсети
            + `&${this.commonInfo}`;
    }
    
    getLocalHostData(){
        return `http://localhost:8000/data/get`;
    }
}

export const urls = new Urls()