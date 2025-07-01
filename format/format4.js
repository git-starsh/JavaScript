// 要过滤的分组列表
const FILTER_GROUPS = ['4K频道', '列表更新时间'];

// 过滤指定分组的频道
const filterOtherChannels = (channelList) => {
	return channelList.filter(channel => !FILTER_GROUPS.includes(channel.groupName));
};

// 主函数，过滤指定分组的频道列表
const main = (channelList) => {
	return filterOtherChannels(channelList);
};