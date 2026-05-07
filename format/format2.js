// 地方频道关键词集合
const LOCAL_CHANNEL_KEYWORDS = new Set([
	'上海', '纪实', '卡通', '珠江', '延边', '炫动', '安多', '康巴', '探索', '藏语', '新海南', '农林', '卡酷', '美食', '中国', '动漫', '哒啵', '财富', '理财', '电子', '娱乐', '黑莓', '服务', '精彩',
	'环球', '漫游', '大湾区', '山东教育', '浙江教科', '厦门卫视', '茶', '垂钓'
]);

// 组名映射
const GROUP_NAME_MAPPING = {
	'央视': '央视频道',
	'求索频道': '其他频道',
	'百视通频道': '其他频道',
	'CGTN频道': '其他频道',
	'咪咕频道': '其他频道',
	'湖南频道': '其他频道',
	'4K频道': '其他频道'
};

// 组名排序顺序
const GROUP_NAME_SORT = [
	'央视频道',
	'卫视频道',
	'地方频道'
];

// 过滤分组
const FILTER_GROUPS = ['SiTV频道','NewTV频道','iHOT频道','HOT频道'];

// 检查字符串是否包含集合中的任意关键词
const includesAnyKeyword = (str, keywords) => {
	for (const keyword of keywords) {
		if (str.includes(keyword)) {
			return true;
		}
	}
	return false;
};

// 转换单个频道的信息
const transformChannel = (channel) => {
	if (includesAnyKeyword(channel.name, LOCAL_CHANNEL_KEYWORDS)) {
		return {
			name: channel.name,
			groupName: '地方频道'
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

// 对整个频道列表应用指定的转换函数
const transformChannelList = (channelList, func) => {
	return channelList.map(channel => ({
		...channel,
		...func(channel)
	}));
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