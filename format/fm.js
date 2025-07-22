// 过滤关键词
const FILTER_KEYWORDS = ['测试', '25', '咪咕'];

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
  'GPTV-央视': '央视频道',
  'GPTV-卫视': '卫视频道',
  'GPTV-其他': '其他频道',
  'GPTV-北京': '其他频道',
  'YHYX-央视': '央视频道',
  'YHYX-卫视': '卫视频道',
  'YHYX-河北': '其他频道',
  'YHYX-其他': '其他频道',
  'YHYX-北京': '其他频道',
  'BST-央视': '央视频道',
  'BST-卫视': '卫视频道',
  'BST-其他': '其他频道',
  '8K频道': '其他频道'
};

// 频道名映射规则，可以批量修改频道名
const CHANNEL_NAME_MAPPING = {
  "CCTV-新闻": "CCTV13",
  "CCTV-少儿": "CCTV14",
  "CCTV-音乐": "CCTV15"
};

// 自定义分组规则 - 根据频道名关键词将频道分配到指定分组
// 格式: { 目标分组名: [关键词列表] }
// 匹配优先级低于组名映射
const CUSTOM_GROUP_RULES = {
  '其他频道': ['剧场', '高尔夫', '电视指南', '风云音乐', '女性时尚', '央视', '风云', '世界', '兵器',
    '测试', '25', '钱塘江', '开封', '熊猫', '语', '洲', 'Doc', '老', '生', '发现', '咪咕视频', 'cgtn', 'CGTN', '4k', '8k'
  ],
  '央视频道': ['CHC'],
  '地方频道': ['海峡', '康巴', '安多', '农林', '三沙', '延边']
};

// 组名排序顺序
const GROUP_NAME_SORT = [
  '央视频道',
  '卫视频道',
  '地方频道',
  // 自定义分组排序
  '体育频道',
  '电影频道',
  '纪录片频道',
  '其他频道'
];

// 要过滤的分组列表
const FILTER_GROUPS = [];

// 净化频道名，只保留基本频道名
const purifyChannelName = (channelName) => {
  // 移除括号及其中的内容（包括中英文括号）
  let cleanedName = channelName.replace(/[\(\)\（\）].*?[\)\(\）\(]/g, '');
  // 移除数字前缀（如"1. "、"01-"等）
  cleanedName = cleanedName.replace(/^\d+[\.\- ]?/, '');
  // 移除常见的多余修饰词
  const redundantWords = ['高清', '标清', '-GPTV', '-BST', '-YHYX', '超清', 'HD', '-NPTV'];
  redundantWords.forEach(word => {
    cleanedName = cleanedName.replace(new RegExp(word, 'g'), '');
  });

  // 处理CCTV频道：保留数字部分以及5+、4K、8K（包含大小写）
  if (cleanedName.startsWith('CCTV')) {
    // 提取数字部分和特殊标识(5+、4K、8K)
    const match = cleanedName.match(/CCTV(\d+[+]?|4[Kk]|8[Kk])/);
    if (match) {
      return `CCTV${match[1]}`;
    }
  }

  // 去除首尾空格
  return cleanedName.trim();
};

// 应用频道名映射规则
const applyChannelNameMapping = (channelName) => {
  // 如果映射规则中存在该频道名，则使用映射后的值
  if (CHANNEL_NAME_MAPPING.hasOwnProperty(channelName)) {
    return CHANNEL_NAME_MAPPING[channelName];
  }
  // 否则返回原名称
  return channelName;
};

// 检查字符串是否包含集合中的任意关键词
const includesAnyKeyword = (str, keywords) => {
  for (const keyword of keywords) {
    if (str.includes(keyword)) {
      return true;
    }
  }
  return false;
};

// 检查频道是否匹配自定义分组规则
const getCustomGroupName = (channelName) => {
  for (const [groupName, keywords] of Object.entries(CUSTOM_GROUP_RULES)) {
    if (includesAnyKeyword(channelName, keywords)) {
      return groupName;
    }
  }
  return null;
};

// 过滤包含特定关键词的频道
const shouldFilterChannel = (channel) => {
  return includesAnyKeyword(channel.name, FILTER_KEYWORDS);
};

// 转换单个频道的信息（包含频道名净化和映射）
const transformChannel = (channel) => {
  if (shouldFilterChannel(channel)) {
    return undefined;
  }

  // 先净化频道名，再应用映射规则
  const purifiedName = purifyChannelName(channel.name);
  const mappedName = applyChannelNameMapping(purifiedName);

  return {
    name: mappedName, // 使用映射后的频道名
    groupName: channel.groupName // 先保留原始组名，后续会应用组名映射
  };
};

// 转换频道列表中每个频道的组名
const transformGroupNames = (channelList, mapping) => {
  return channelList.map(channel => {
    // 先应用组名映射
    const mappedGroupName = mapping[channel.groupName] || channel.groupName;

    // 再检查是否匹配自定义分组（仅在组名映射后应用）
    const customGroupName = getCustomGroupName(channel.name);

    return {
      ...channel,
      groupName: customGroupName || mappedGroupName // 组名映射优先于自定义分组
    };
  });
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
  // 先按组名排序
  const sortedByGroup = channelList
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

  // 在相同组内，对CCTV频道按数字排序
  return sortWithinGroup(sortedByGroup);
};

// 在相同组内对CCTV频道按数字排序
const sortWithinGroup = (channelList) => {
  // 按组名分组
  const groups = {};
  channelList.forEach(channel => {
    if (!groups[channel.groupName]) {
      groups[channel.groupName] = [];
    }
    groups[channel.groupName].push(channel);
  });

  // 对每个组内的频道进行排序
  Object.keys(groups).forEach(groupName => {
    groups[groupName].sort((a, b) => {
      // 提取CCTV频道的数字
      const aIsCCTV = a.name.startsWith('CCTV');
      const bIsCCTV = b.name.startsWith('CCTV');

      // 两个都是CCTV频道，按数字排序
      if (aIsCCTV && bIsCCTV) {
        // 提取数字部分，处理带+号和K的情况
        const aNum = extractCCTVNumber(a.name);
        const bNum = extractCCTVNumber(b.name);
        return aNum - bNum;
      }

      // CCTV频道排在前面
      if (aIsCCTV) return -1;
      if (bIsCCTV) return 1;

      // 都不是CCTV频道，保持原有顺序
      return 0;
    });
  });

  // 重新组合所有组
  return Object.keys(groups).flatMap(groupName => groups[groupName]);
};

// 提取CCTV频道的数字用于排序
// 4K/8K频道排序值放到最后
const extractCCTVNumber = (channelName) => {
  // 处理4K/8K频道，赋予最高排序值，让它们排在最后
  if (channelName.includes('4K') || channelName.includes('4k')) return 998;
  if (channelName.includes('8K') || channelName.includes('8k')) return 999;

  // 处理带+号的频道，如CCTV5+
  const plusMatch = channelName.match(/CCTV(\d+)\+/);
  if (plusMatch) return parseInt(plusMatch[1], 10) + 0.5;

  // 普通数字频道
  const numMatch = channelName.match(/CCTV(\d+)/);
  return numMatch ? parseInt(numMatch[1], 10) : 997;
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
