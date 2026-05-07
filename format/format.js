// 过滤关键词
const FILTER_KEYWORDS = ['测试'];
// 特殊频道名称映射
const SPECIAL_CHANNEL_MAPPING = {
    '上海五星体育': {
        name: '五星体育',
        groupName: '卫视频道'
    }
};
// 4K 频道关键词集合
const CCT4K_KEYWORDS = new Set(['cctv4k', 'cctv8k','cctv16-4K-HLG']);
// 地方频道关键词集合
const LOCAL_CHANNEL_KEYWORDS = new Set([
    '上海-', '财经', '影视', '都市', '哈哈', '新闻综合', '纪实', '法治', '卡酷', '茶', '垂钓', 'BTV', '淘', '北京体育', '北京新闻', '萌宠'
]);
// 其他频道关键词集合
const OTHER_CHANNEL_KEYWORDS = new Set([
    'CG', 'cg', '世界', '风云', '兵器', '球', '剧场', '电视指南', '文化精品', '女性时尚', 'CGTNDOC', '凤凰'
]);
// 央视频道关键词集合
const CCTV_CHANNEL_KEYWORDS = new Set(['CCTV-16', 'cctv16']);
// 组名映射
const GROUP_NAME_MAPPING = {
    '北京': '卫视频道',
    '东方': '卫视频道',
    '上海': '卫视频道',
    '重庆': '卫视频道',
    '江苏': '卫视频道',
    '浙江': '卫视频道',
    '安徽': '卫视频道',
    '东南': '卫视频道',
    '福建': '卫视频道',
    '江西': '卫视频道',
    '山东': '卫视频道',
    '河南': '卫视频道',
    '湖北': '卫视频道',
    '湖南': '卫视频道',
    '河北': '卫视频道',
    '山西': '卫视频道',
    '辽宁': '卫视频道',
    '吉林': '卫视频道',
    '广东': '卫视频道',
    '海南': '卫视频道',
    '四川': '卫视频道',
    '云南': '卫视频道',
    '贵州': '卫视频道',
    '陕西': '卫视频道',
    '甘肃': '卫视频道',
    '青海': '卫视频道',
    '新疆': '卫视频道',
    '宁夏': '卫视频道',
    '广西': '卫视频道',
    '西藏': '卫视频道',
    '香港': '卫视频道',
    '卫视': '卫视频道',
    '央视': '央视频道',
    '其他': '其他频道',
    '4K频道': '高清频道',
    '8K频道': '其他频道',
    '黑龙江': '卫视频道',
    '咪咕体育': '咪咕视频'
};
// 组名排序顺序
const GROUP_NAME_SORT = [
    '央视频道',
    '卫视频道',
    '地方频道'
];

// 过滤分组
const FILTER_GROUPS = ['咪咕视频', 'NEWTV', 'IHOT'];

// 检查字符串是否包含集合中的任意关键词
const includesAnyKeyword = (str, keywords) => {
    for (const keyword of keywords) {
        if (str.includes(keyword)) {
            return true;
        }
    }
    return false;
};

// 过滤包含特定关键词的频道
const shouldFilterChannel = (channel) => {
    return includesAnyKeyword(channel.name, FILTER_KEYWORDS);
};

// 转换单个频道的信息
const transformChannel = (channel) => {
    if (shouldFilterChannel(channel)) {
        return undefined;
    }
    if (SPECIAL_CHANNEL_MAPPING[channel.name]) {
        return SPECIAL_CHANNEL_MAPPING[channel.name];
    }
    if (includesAnyKeyword(channel.name, CCT4K_KEYWORDS)) {
        return {
            name: channel.name,
            groupName: '高清频道'
        };
    }
    if (includesAnyKeyword(channel.name, LOCAL_CHANNEL_KEYWORDS)) {
        return {
            name: channel.name,
            groupName: '地方频道'
        };
    }
    if (includesAnyKeyword(channel.name, OTHER_CHANNEL_KEYWORDS)) {
        return {
            name: channel.name,
            groupName: '其他频道'
        };
    }
    if (includesAnyKeyword(channel.name, CCTV_CHANNEL_KEYWORDS)) {
        return {
            name: channel.name,
            groupName: '央视频道'
        };
    }
    return {
        name: channel.name,
        groupName: channel.groupName
    };
};

// 转换频道列表中每个频道的组名
const transformGroupNames = (channelList, mapping) => {
    return channelList.map(channel => ({
        ...channel,
        groupName: mapping[channel.groupName] || channel.groupName
    }));
};

// 对整个频道列表应用指定的转换函数，并过滤掉转换后为 undefined 的频道
const transformChannelList = (channelList, func) => {
    return channelList
       .map(channel => {
            const transformedChannel = func(channel);
            return transformedChannel ? {
                ...channel,
                ...transformedChannel
            } : undefined;
        })
       .filter(channel => channel);
};

// 根据指定的排序顺序对频道列表按组名进行排序
const sortChannelsByGroupName = (channelList, sort) => {
    return channelList
       .map((channel, index) => ({
            channel,
            originalIndex: index
        }))
       .sort((a, b) => {
            const indexA = sort.indexOf(a.channel.groupName);
            const indexB = sort.indexOf(b.channel.groupName);
            const finalIndexA = indexA === -1 ? sort.length : indexA;
            const finalIndexB = indexB === -1 ? sort.length : indexB;
            return finalIndexA - finalIndexB || a.originalIndex - b.originalIndex;
        })
       .map(item => item.channel);
};

// 过滤指定分组的频道
const filterOtherChannels = (channelList) => {
    return channelList.filter(channel => !FILTER_GROUPS.includes(channel.groupName));
};

// 主函数，将一系列转换和排序操作组合起来处理频道列表
const main = (channelList) => {
    const transformedList = sortChannelsByGroupName(
        transformGroupNames(
            transformChannelList(channelList, transformChannel),
            GROUP_NAME_MAPPING
        ),
        GROUP_NAME_SORT
    );
    return filterOtherChannels(transformedList);
};