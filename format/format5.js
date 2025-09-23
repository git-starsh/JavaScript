function transformGroupNames(channelList, mapping) {
  return channelList.map(function (channel) {
    var newGroupName = mapping[channel.groupName] || channel.groupName;
    return Object.assign({}, channel, { groupName: newGroupName });
  });
}
function sortChannelsByGroupName(channelList, sort) {
  return channelList
    .map(function (channel, index) {
      return { channel: channel, originalIndex: index };
    })
    .sort(function (a, b) {
      var indexA = sort.indexOf(a.channel.groupName);
      var indexB = sort.indexOf(b.channel.groupName);

      indexA = indexA === -1 ? sort.length : indexA;
      indexB = indexB === -1 ? sort.length : indexB;

      return indexA - indexB || a.originalIndex - b.originalIndex;
    })
    .map(function (item) {
      return item.channel;
    });
}
function transformChannel(channel) {
  // 如果频道名称包含“测试”，则过滤掉这个频道
  if (channel.name.includes('测试')) {
    return undefined;
  }
  if (channel.name.includes('-')) {
    return undefined;
  }
  // 创建新的频道对象，直接使用原始名称
  return { name: channel.name, groupName: channel.groupName };
}
function transformChannelList(channelList, func) {
  return channelList.map(function (channel) {
    var transformedChannel = func(channel);
    return transformedChannel !== undefined ? Object.assign({}, channel, transformedChannel) : undefined;
  }).filter(function (channel) {
    // 过滤掉undefined项
    return channel !== undefined;
  });
}

function main(channelList) {
  var groupNameMapping = {
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
	'熊猫': '其他频道',
	'教育': '其他频道'
  };
  var groupNameSort = ['央视频道','卫视频道','地方频道','其他频道'];

  return sortChannelsByGroupName(transformGroupNames(transformChannelList(channelList, transformChannel), groupNameMapping), groupNameSort);
}
