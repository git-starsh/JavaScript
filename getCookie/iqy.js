// https://ssports.iqiyi.com/
// 定义函数用于生成订阅 URL http://IP:35455/iqyevent.m3u?uid=&userid=&usertoken=
function generateSubscriptionUrl() {
    // 内部函数，从 document.cookie 获取指定名称的 cookie 值
    const getCookie = (name) => {
        const value = '; ' + document.cookie;
        const parts = value.split('; ' + name + '=');
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    };

    // 获取所需的 cookie 值
    const uid = getCookie('P00010');
    const user_id = getCookie('__uuid');
    const user_token = getCookie('P00001');

    // 检查关键 cookie 是否存在
    if (user_id && user_token) {
        // 拼接订阅 URL
        const url = `http://你的IP:35455/iqyevent.m3u?uid=${uid}&userid=${user_id}&usertoken=${user_token}`;
        console.log('订阅配置:', url);
        return url;
    }
    console.log('Cookie 缺失');
}

// 调用函数生成订阅 URL
generateSubscriptionUrl();