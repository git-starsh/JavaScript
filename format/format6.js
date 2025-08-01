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

  // 如果频道名称包含“cgtn”，则过滤掉这个频道
  if (channel.name.includes('cgtn')) {
    return undefined;
  }

  // 如果频道名称包含“-4K”，则过滤掉这个频道
  //if (channel.name.includes('-4K')) {
  //  return undefined;
  //} 
  
  // 如果频道名称包含“CGTN”，则过滤掉这个频道
  if (channel.name.includes('CGTN')) {
    return undefined;
  } 
  
  // 特殊处理频道名称
  if (channel.name === '上海东方卫视') {
    return { name: '东方卫视', groupName: '卫视频道' };
  }
  if (channel.name === 'cctv8-AVS') {
    return { name: 'cctv8', groupName: '央视频道' };
  }
  // 特殊处理名称包含“CCTV”的频道，归入“央视频道”分组
  if (channel.name.includes('CTV-16-4K') || channel.name.includes('cctv164k') || channel.name.includes('cctv4k') || channel.name.includes('cctv8k') || channel.name.includes('cctv1-4K')|| channel.name.includes('cctv3-4K')|| channel.name.includes('cctv5-4K')|| channel.name.includes('cctv16-4K-SDR')) {
    return { name: channel.name, groupName: '央视频道' };
  }

  // 特殊处理名称包含“上海”、“纪实”、“卡酷”、“茶”、“垂钓”，归入“地方频道”分组
  if (channel.name.includes('上海') || channel.name.includes('纪实') || channel.name.includes('卡酷') || channel.name.includes('茶') || channel.name.includes('垂钓')) {
    return { name: channel.name, groupName: '地方频道' };
  }

  // 特殊处理名称包含“CG”、“cg”以及“CGTNDOC”的频道，归入“其他频道”分组
  if (channel.name.includes('CG') || channel.name.includes('cg') || 
channel.name.includes('世界') || 
channel.name.includes('风云') || 
channel.name.includes('兵器') || 
channel.name.includes('球') || 
channel.name.includes('剧场') || 
channel.name.includes('电视指南') || 
channel.name.includes('文化精品') || 
channel.name.includes('女性时尚') || 
channel.name.includes('CGTNDOC') || channel.name.includes('凤凰')) {
    return { name: channel.name, groupName: '其他频道' };
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
    '黑龙江': '卫视频道',
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
    '咪咕体育': '咪咕视频',
    '其他': '其他频道',
    '4K频道': '其他频道',
    '8K频道': '其他频道',
  };
  var groupNameSort = ['央视频道', '卫视频道', '地方频道', 'NEWTV', 'IHOT', '咪咕视频', '其他频道'];

  return sortChannelsByGroupName(transformGroupNames(transformChannelList(channelList, transformChannel), groupNameMapping), groupNameSort);
}
