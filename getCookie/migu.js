//https://www.miguvideo.com/
// 定义生成订阅 URL 的函数 http://IP:35455/migu.m3u?userid=&usertoken=;http://你的IP:35455/miguevent.m3u?userid=&usertoken=
function generateSubscriptionUrl() {
    // 定义获取指定名称 Cookie 值的内部函数
    const getCookie = (name) => {
        // 为方便分割，在 cookie 字符串前添加 '; '
        const value = '; ' + document.cookie;
        // 按 '; 名称=' 分割字符串
        const parts = value.split('; ' + name + '=');
        // 若分割后数组长度为 2，说明找到对应 Cookie，返回其值
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    };

    // 获取 userInfo Cookie 并解码、解析为对象
    const user_info = JSON.parse(decodeURIComponent(getCookie('userInfo')));

    // 若 user_info 存在
    if (user_info) {
        let url;
        // 提取 userId 和 userToken
        const user_id = user_info.userId;
        const user_token = user_info.userToken;
        // 若 userId 和 userToken 都存在
        if (user_id && user_token) {
            // 生成订阅 URL
            url = `http://你的IP:35455/miguevent.m3u?userid=${user_id}&usertoken=${user_token}`;
            // 打印 URL
            console.log('你的订阅配置为：', url);
            // 返回 URL
            return url;
        } else {
            // 缺少必要信息，打印提示
            console.log('用户Cookie缺失');
        }
    } else {
        // 未找到 userInfo Cookie，打印提示
        console.log('用户Cookie找不到');
    }
}

// 调用函数生成订阅 URL
generateSubscriptionUrl();