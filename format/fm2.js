// 过滤关键词
const FILTER_KEYWORDS = ['测试', '25', '钱塘江', '开封','熊猫', '语', '洲', 'Doc', '老', '生', '发现'];

// 组名映射
const GROUP_NAME_MAPPING = {
  '央视': '央视频道',
  '卫视': '卫视频道',
  '其他': '其他频道',
  '地方': '地方频道',
	'影视': '其他频道',
	'少儿': '其他频道',
	'纪实': '其他频道',
	'体育': '其他频道',
	'综艺': '其他频道',
	'教育': '其他频道'
};

// 频道名映射
const CHANNEL_NAME_MAPPING = {
  "cctv5p": "CCTV5+"
};

// 自定义分组（优先级低于组名映射）
const CUSTOM_GROUP_RULES = {
  '其他频道': ['剧场', '高尔夫', '电视指南', '风云音乐', '女性时尚', '央视', '风云', '世界', '兵器',
    '测试', '25', '钱塘江', '开封', '熊猫', '语', '洲', 'Doc', '老', '生', '发现', '咪咕视频', 'cgtn', 'CGTN', '4k', '8k'
  ],
  '央视频道': ['CHC'],
  '地方频道': ['海峡', '康巴', '安多', '农林', '三沙', '延边']
};

// 组名排序顺序
const GROUP_NAME_SORT = [
 '央视频道', '卫视频道', '地方频道',  '其他频道'
];

// 要过滤的分组列表
const FILTER_GROUPS = [];

// URL字段排序优先级
const URL_PRIORITY = {
  'mursor': 1,
  'mgtv': 2
};

// 工具函数：检查字符串是否包含关键词数组中的任意关键词
const hasAnyKeyword = (str, keywords) => keywords.some(key => str.includes(key));

// 净化频道名
const purifyChannelName = (channelName) => {
  // 移除括号及内容、数字前缀、多余修饰词
  let name = channelName
    .replace(/[\(\)\（\）].*?[\)\(\）\(]/g, '')
    .replace(/^\d+[\.\- ]?/, '')
    .replace(/高清|标清|超清|HD|-MCP|-MST|-MXW/g, '');

  // 处理CCTV频道标准化
  if (name.startsWith('CCTV')) {
    const match = name.match(/CCTV(\d+[+]?|4[Kk]|8[Kk])/);
    if (match) return `CCTV${match[1]}`;
  }

  return name.trim();
};

// 处理单个频道：净化名称+过滤
const processChannel = (channel) => {
  if (hasAnyKeyword(channel.name, FILTER_KEYWORDS)) return null;
  
  const purifiedName = purifyChannelName(channel.name);
  const mappedName = CHANNEL_NAME_MAPPING[purifiedName] || purifiedName;
  
  return { ...channel, name: mappedName, originalGroupName: channel.groupName };
};

// 确定频道最终分组
const determineGroup = (channel) => {
  // 先应用组名映射
  const mappedGroup = GROUP_NAME_MAPPING[channel.originalGroupName] || channel.originalGroupName;
  // 再检查自定义分组
  for (const [group, keywords] of Object.entries(CUSTOM_GROUP_RULES)) {
    if (hasAnyKeyword(channel.name, keywords)) return group;
  }
  
  return mappedGroup;
};

// 对CCTV频道排序的辅助函数
const getCCTVOrder = (name) => {
  if (!name.startsWith('CCTV')) return Infinity;
  if (name.includes('4K') || name.includes('4k')) return 998;
  if (name.includes('8K') || name.includes('8k')) return 999;
  
  const numMatch = name.match(/CCTV(\d+)(\+)?/);
  if (!numMatch) return 997;
  
  const base = parseInt(numMatch[1], 10);
  return numMatch[2] ? base + 0.5 : base; // 带+号的频道排在原数字后
};

// 获取URL中特定字段的优先级 - 修复版
const getUrlPriority = (url) => {
  if (!url) return 100; // 没有URL的排在最后
  
  // 将URL转为小写以便不区分大小写匹配
  const lowerUrl = url.toLowerCase();
  
  // 检查URL中是否包含指定字段
  for (const [key, priority] of Object.entries(URL_PRIORITY)) {
    // 使用正则表达式确保匹配整个单词或作为独立部分存在
    const regex = new RegExp(`(^|\\W)${key}($|\\W)`, 'i');
    if (regex.test(lowerUrl)) {
      return priority;
    }
  }
  
  // 都不包含的排在这些字段之后
  return 5;
};

// 主处理流程
const main = (channelList) => {
  // 1. 处理频道名并过滤
  const validChannels = channelList
    .map(processChannel)
    .filter(Boolean); // 过滤被标记为null的频道

  // 2. 确定最终分组
  const groupedChannels = validChannels.map(channel => ({
    ...channel,
    groupName: determineGroup(channel),
    // 预计算URL优先级以便调试和排序
    urlPriority: getUrlPriority(channel.url)
  }));

  // 3. 按组排序 + URL字段排序 + 组内排序
  const sortedChannels = [...groupedChannels]
    .sort((a, b) => {
      // 先按组排序
      const groupA = GROUP_NAME_SORT.indexOf(a.groupName);
      const groupB = GROUP_NAME_SORT.indexOf(b.groupName);
      const groupOrder = (groupA === -1 ? GROUP_NAME_SORT.length : groupA) 
                       - (groupB === -1 ? GROUP_NAME_SORT.length : groupB);
      
      if (groupOrder !== 0) return groupOrder;
      
      // 同组内按URL字段优先级排序 - 确保这一步优先于CCTV排序
      const urlPriorityA = a.urlPriority;
      const urlPriorityB = b.urlPriority;
      
      if (urlPriorityA !== urlPriorityB) {
        return urlPriorityA - urlPriorityB;
      }
      
      // URL优先级相同则按CCTV顺序排序
      return getCCTVOrder(a.name) - getCCTVOrder(b.name);
    });

  // 4. 过滤指定分组
  return sortedChannels.filter(channel => !FILTER_GROUPS.includes(channel.groupName));
};

