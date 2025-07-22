//https://sports.qq.com/
// 生成腾讯体育订阅链接的函数 http://IP:35455/txevent.m3u?main_login=qq&vqq_appid=&vqq_openid=&vqq_access_token=;http://IP:35455/txevent.m3u?main_login=wx&appid=&openid=&access_token=&vuserid=&refresh_token=
function generateSubscriptionUrl() {
    // 获取指定名称的 cookie 值
    const getCookie = (name) => {
        const str = '; ' + document.cookie;
        const parts = str.split('; ' + name + '=');
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    };

    // 获取登录方式的 cookie
    const mainLogin = getCookie('main_login');

    if (mainLogin) {
        let url;
        if (mainLogin === 'qq') {
            // 获取 QQ 登录所需 cookie
            const appId = getCookie('vqq_appid');
            const openId = getCookie('vqq_openid');
            const token = getCookie('vqq_access_token');
            if (appId && openId && token) {
                // 拼接 QQ 登录订阅链接
                url = `http://你的IP:35455/txevent.m3u?main_login=${mainLogin}&vqq_appid=${appId}&vqq_openid=${openId}&vqq_access_token=${token}`;
                console.log('腾讯体育订阅链接:', url);
                return url;
            }
            console.log('缺少 QQ 登录 Cookie');
        } else if (mainLogin === 'wx') {
            // 获取微信登录所需 cookie
            const appId = getCookie('appid');
            const openId = getCookie('openid');
            const token = getCookie('access_token');
            const userId = getCookie('vuserid');
            const refreshToken = getCookie('refresh_token');
            const session = getCookie('vusession');
            if (appId && openId && token && userId && refreshToken) {
                // 拼接微信登录订阅链接
                url = `http://你的IP:35455/txevent.m3u?main_login=${mainLogin}&appid=${appId}&openid=${openId}&access_token=${token}&vuserid=${userId}&refresh_token=${refreshToken}&vusession=${session}`;
                console.log('腾讯体育订阅链接:', url);
                return url;
            }
            console.log('缺少微信登录 Cookie');
        }
    } else {
        console.log('缺少 main_login Cookie');
    }
}

// 调用函数生成链接
generateSubscriptionUrl();