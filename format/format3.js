// 过滤关键词
const FILTER_KEYWORDS = ['测试', '25', '钱塘江', '开封','熊猫', '语', '洲', 'Doc', '老', '生', '发现'];

// 组名映射
const GROUP_NAME_MAPPING = {
	'央视': '央视频道',
	'卫视': '卫视频道',
	'地方': '地方频道',
	'影视': '其他频道',
	'娱乐': '其他频道',
	'少儿': '其他频道',
	'纪实': '其他频道',
	'体育': '其他频道',
	'综艺': '其他频道',
	'新闻': '其他频道',
	'教育': '其他频道',
	'其他': '其他频道',
	'8K频道': '其他频道',
	'4K频道': '其他频道',
	'咪咕体育': '其他频道'

};

// 组名排序顺序
const GROUP_NAME_SORT = [
	'央视频道',
	'卫视频道',
	'地方频道'
];

// 要过滤的分组列表
const FILTER_GROUPS = [];

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
