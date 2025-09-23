// 获取所有的Cookie字符串
const cookies = document.cookie;
console.log("所有Cookie：", cookies);

// 拆分Cookie字符串为数组
const cookieArray = cookies.split('; ');
console.log("拆分后的Cookie数组：", cookieArray);

let userid, token;
// 遍历数组，进一步拆分每个Cookie为名称和值
cookieArray.forEach((cookie) => {
    const [name, value] = cookie.split('=');
    console.log("Cookie名称：", name);
    console.log("Cookie值：", value);
    if (name === 'UserInfo') {
        const [userIdPart, tokenPart] = value.split('|');
        userid = userIdPart;
        token = tokenPart;
    }
});