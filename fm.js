// 过滤关键词
const FILTER_KEYWORDS = ['测试', '25', '钱塘江', '开封','熊猫', '语', '洲', 'Doc', '老', '生', '发现'];
// 特殊频道名称映射
const SPECIAL_CHANNEL_MAPPING = {
    'CCTV-新闻HD-BST': {
        name: 'CCTV13',
        groupName: 'BST-央视'
    }
};
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
	'咪咕体育': '其他频道',
    'BST-央视': '央视频道' // 新增：特殊频道映射后的组名转换
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
	// 处理空字符串情况
	if (!str) return false;
	for (const keyword of keywords) {
		if (str.includes(keyword)) {
			return true;
		}
	}
	return false;
};

// 过滤包含特定关键词的频道
const shouldFilterChannel = (channel) => {
	// 确保channel和name存在
	if (!channel || !channel.name) return true;
	return includesAnyKeyword(channel.name, FILTER_KEYWORDS);
};

// 移除频道名中的后缀（如-HD、-BST等）
const removeChannelSuffix = (channelName) => {
	if (!channelName) return '';
	// 更精确的正则：匹配以-开头的常见后缀（HD、4K、8K、BST等）
	return channelName.replace(/-+(HD|4K|8K|BST|高清|标清|测试|数字)/gi, '');
};

// 转换单个频道的信息
const transformChannel = (channel) => {
	// 过滤无效频道
	if (!channel || typeof channel !== 'object') return undefined;
	
	if (shouldFilterChannel(channel)) {
		return undefined;
	}
	
	// 处理特殊频道映射
	let transformedName = channel.name;
	let transformedGroupName = channel.groupName || '';
	
	if (SPECIAL_CHANNEL_MAPPING[transformedName]) {
		transformedName = SPECIAL_CHANNEL_MAPPING[transformedName].name;
		transformedGroupName = SPECIAL_CHANNEL_MAPPING[transformedName].groupName;
	}
	
	// 去除后缀
	transformedName = removeChannelSuffix(transformedName);
	
	return {
		name: transformedName,
		groupName: transformedGroupName
	};
};

// 转换频道列表中每个频道的组名
const transformGroupNames = (channelList, mapping) => {
	if (!Array.isArray(channelList)) return [];
	return channelList.map(channel => ({
		...channel,
		groupName: mapping[channel.groupName] || channel.groupName || '未分类'
	}));
};

// 对整个频道列表应用指定的转换函数
const transformChannelList = (channelList, func) => {
	if (!Array.isArray(channelList)) return [];
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
	if (!Array.isArray(channelList)) return [];
	return [...channelList] // 避免修改原数组
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
	if (!Array.isArray(channelList)) return [];
	return channelList.filter(channel => !FILTER_GROUPS.includes(channel.groupName));
};

// 主函数，处理频道列表
const processChannels = (channelList) => {
	const transformedList = sortChannelsByGroupName(
		transformGroupNames(
			transformChannelList(channelList, transformChannel),
			GROUP_NAME_MAPPING
		),
		GROUP_NAME_SORT
	);
	return filterOtherChannels(transformedList);
};

// 测试用例
const testChannels = [
	{ name: 'CCTV-1HD-BST', groupName: '央视' },
	{ name: '浙江卫视-HD', groupName: '卫视' },
	{ name: '杭州电视台', groupName: '地方' },
	{ name: '测试频道', groupName: '其他' }, // 应被过滤
	{ name: 'CCTV-新闻HD-BST', groupName: '新闻' }, // 特殊映射
	{ name: '熊猫频道', groupName: '其他' }, // 应被过滤
	{ name: '东方卫视-4K', groupName: '卫视' },
	{ name: '体育频道', groupName: '体育' },
	{ name: '未知频道' } // 缺少groupName
];

// 执行测试
const result = processChannels(testChannels);
console.log('处理结果:', result);
