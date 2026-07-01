// 本地化字典:API-Football 只返回英文,这里映射成中文显示名。
// 有限集合(球队/位置/轮次/球场)人工字典精确翻译;查不到回退英文。
// URL slug 仍用英文(中文 URL 会被编码),只换显示文本。

// 球队:按 slug(slugify 后的英文名)→ 中文。覆盖五大联赛主流 + 常见欧冠球队。
export const TEAM_ZH: Record<string, string> = {
  // 英超
  'arsenal': '阿森纳', 'chelsea': '切尔西', 'liverpool': '利物浦', 'manchester-city': '曼城',
  'manchester-united': '曼联', 'tottenham': '托特纳姆热刺', 'newcastle': '纽卡斯尔', 'aston-villa': '阿斯顿维拉',
  'brighton': '布莱顿', 'west-ham': '西汉姆联', 'crystal-palace': '水晶宫', 'brentford': '布伦特福德',
  'fulham': '富勒姆', 'everton': '埃弗顿', 'bournemouth': '伯恩茅斯', 'nottingham-forest': '诺丁汉森林',
  'wolves': '狼队', 'leeds': '利兹联', 'ipswich': '伊普斯维奇', 'hull-city': '赫尔城',
  'sunderland': '桑德兰', 'coventry': '考文垂', 'leicester': '莱斯特城', 'southampton': '南安普顿',
  // 西甲
  'real-madrid': '皇家马德里', 'barcelona': '巴塞罗那', 'atletico-madrid': '马德里竞技', 'sevilla': '塞维利亚',
  'real-sociedad': '皇家社会', 'villarreal': '比利亚雷亚尔', 'real-betis': '皇家贝蒂斯', 'valencia': '瓦伦西亚',
  'athletic-club': '毕尔巴鄂竞技', 'girona': '赫罗纳', 'celta-vigo': '塞尔塔', 'osasuna': '奥萨苏纳',
  'getafe': '赫塔菲', 'rayo-vallecano': '巴列卡诺', 'mallorca': '马洛卡', 'espanyol': '西班牙人',
  'alaves': '阿拉维斯', 'las-palmas': '拉斯帕尔马斯', 'leganes': '莱加内斯', 'real-valladolid': '巴利亚多利德',
  'levante': '莱万特', 'malaga': '马拉加', 'deportivo-la-coruna': '拉科鲁尼亚', 'racing-santander': '桑坦德竞技',
  // 意甲
  'inter': '国际米兰', 'ac-milan': 'AC米兰', 'juventus': '尤文图斯', 'napoli': '那不勒斯',
  'as-roma': '罗马', 'lazio': '拉齐奥', 'atalanta': '亚特兰大', 'fiorentina': '佛罗伦萨',
  'bologna': '博洛尼亚', 'torino': '都灵', 'udinese': '乌迪内斯', 'genoa': '热那亚',
  'cagliari': '卡利亚里', 'sassuolo': '萨索洛', 'lecce': '莱切', 'verona': '维罗纳',
  'parma': '帕尔马', 'como': '科莫', 'monza': '蒙扎', 'venezia': '威尼斯', 'empoli': '恩波利',
  // 德甲
  'bayern-munich': '拜仁慕尼黑', 'borussia-dortmund': '多特蒙德', 'rb-leipzig': 'RB莱比锡', 'bayer-leverkusen': '勒沃库森',
  'vfb-stuttgart': '斯图加特', 'eintracht-frankfurt': '法兰克福', 'borussia-monchengladbach': '门兴格拉德巴赫',
  'vfl-wolfsburg': '沃尔夫斯堡', 'sc-freiburg': '弗赖堡', 'werder-bremen': '云达不莱梅', 'hoffenheim': '霍芬海姆',
  'fc-augsburg': '奥格斯堡', 'union-berlin': '柏林联合', 'mainz-05': '美因茨', 'vfl-bochum': '波鸿',
  'fc-st-pauli': '圣保利', 'heidenheim': '海登海姆', 'holstein-kiel': '基尔',
  // 法甲
  'paris-saint-germain': '巴黎圣日耳曼', 'marseille': '马赛', 'monaco': '摩纳哥', 'lille': '里尔',
  'lyon': '里昂', 'nice': '尼斯', 'rennes': '雷恩', 'lens': '朗斯', 'strasbourg': '斯特拉斯堡',
  'toulouse': '图卢兹', 'lorient': '洛里昂', 'stade-brestois-29': '布雷斯特', 'auxerre': '欧塞尔',
  'estac-troyes': '特鲁瓦', 'le-havre': '勒阿弗尔', 'paris-fc': '巴黎FC', 'angers': '昂热', 'le-mans': '勒芒',
  // 常见欧冠球队
  'porto': '波尔图', 'benfica': '本菲卡', 'sporting-cp': '葡萄牙体育', 'ajax': '阿贾克斯',
  'psv-eindhoven': 'PSV埃因霍温', 'feyenoord': '费耶诺德', 'celtic': '凯尔特人', 'club-brugge': '布鲁日',
  'galatasaray': '加拉塔萨雷', 'fenerbahce': '费内巴切', 'shakhtar-donetsk': '顿涅茨克矿工',
  'red-bull-salzburg': '萨尔茨堡红牛', 'dinamo-zagreb': '萨格勒布迪纳摩', 'sturm-graz': '格拉茨风暴',
  // 世界杯国家队(按 slug)
  'brazil': '巴西', 'argentina': '阿根廷', 'france': '法国', 'england': '英格兰', 'spain': '西班牙',
  'germany': '德国', 'portugal': '葡萄牙', 'netherlands': '荷兰', 'belgium': '比利时', 'italy': '意大利',
  'croatia': '克罗地亚', 'uruguay': '乌拉圭', 'colombia': '哥伦比亚', 'mexico': '墨西哥', 'usa': '美国',
  'united-states': '美国', 'canada': '加拿大', 'japan': '日本', 'south-korea': '韩国', 'korea-republic': '韩国',
  'australia': '澳大利亚', 'morocco': '摩洛哥', 'senegal': '塞内加尔', 'ivory-coast': '科特迪瓦',
  'nigeria': '尼日利亚', 'ghana': '加纳', 'cameroon': '喀麦隆', 'egypt': '埃及', 'algeria': '阿尔及利亚',
  'tunisia': '突尼斯', 'south-africa': '南非', 'switzerland': '瑞士', 'denmark': '丹麦', 'sweden': '瑞典',
  'norway': '挪威', 'poland': '波兰', 'austria': '奥地利', 'serbia': '塞尔维亚', 'ukraine': '乌克兰',
  'turkey': '土耳其', 'scotland': '苏格兰', 'wales': '威尔士', 'ecuador': '厄瓜多尔', 'paraguay': '巴拉圭',
  'peru': '秘鲁', 'chile': '智利', 'venezuela': '委内瑞拉', 'costa-rica': '哥斯达黎加', 'panama': '巴拿马',
  'jamaica': '牙买加', 'iran': '伊朗', 'saudi-arabia': '沙特阿拉伯', 'qatar': '卡塔尔', 'iraq': '伊拉克',
  'uzbekistan': '乌兹别克斯坦', 'jordan': '约旦', 'congo-dr': '刚果(金)', 'new-zealand': '新西兰',
  'honduras': '洪都拉斯', 'bolivia': '玻利维亚', 'greece': '希腊', 'romania': '罗马尼亚', 'hungary': '匈牙利',
  'bosnia-herzegovina': '波黑', 'czechia': '捷克', 'czech-republic': '捷克', 'turkiye': '土耳其',
  'curacao': '库拉索', 'cape-verde': '佛得角', 'cape-verde-islands': '佛得角', 'haiti': '海地', 'new-caledonia': '新喀里多尼亚',
  // 欧冠资格赛常见小队
  'kauno-zalgiris': '考纳斯日尔吉里斯', 'drita': '德里塔', 'vardar-skopje': '瓦尔达尔',
  'kups': '库普斯', 'ararat-armenia': '阿拉拉特亚美尼亚', 'riga': '里加FC',
  'lincoln-red-imps-fc': '林肯红魔', 'inter-club-descaldes': '埃斯卡尔德斯国际',
  'sabah-fa': '萨巴赫', 'the-new-saints': '新圣徒', 'borac-banja-luka': '巴尼亚卢卡',
};

// 位置
export const POSITION_ZH: Record<string, string> = {
  Goalkeeper: '门将', Defender: '后卫', Midfielder: '中场', Attacker: '前锋',
};

// 球场(主流;查不到回退英文)
export const VENUE_ZH: Record<string, string> = {
  'Emirates Stadium': '酋长球场', 'Stamford Bridge': '斯坦福桥', 'Old Trafford': '老特拉福德',
  'Anfield': '安菲尔德', 'Etihad Stadium': '伊蒂哈德球场', 'Tottenham Hotspur Stadium': '托特纳姆热刺球场',
  'St. James\' Park': '圣詹姆斯公园', 'Villa Park': '维拉公园', 'Goodison Park': '古迪逊公园',
  'Santiago Bernabéu': '伯纳乌', 'Spotify Camp Nou': '诺坎普', 'Riyadh Air Metropolitano': '大都会球场',
  'San Siro': '圣西罗', 'Allianz Stadium': '安联球场(尤文)', 'Allianz Arena': '安联球场',
  'Signal Iduna Park': '威斯特法伦球场', 'Parc des Princes': '王子公园球场',
};

// 球员(开放集合,无权威来源;此处只种少量名将,其余回退英文。
// 长尾球员名建议用 AI 翻译脚本批量填充后人工校对 —— 球员页默认 noindex。)
export const PLAYER_ZH: Record<number, string> = {
  19465: '大卫·拉亚', 2273: '凯帕',
};

// 小组名:Group A → A 组
export function localizeGroup(g: string): string {
  if (!g) return '';
  const m = g.match(/^Group\s+(.+)$/i);
  return m ? `${m[1]} 组` : g;
}

// 轮次:正则归一化
export function localizeRound(round: string): string {
  if (!round) return round;
  let m: RegExpMatchArray | null;
  if ((m = round.match(/^Regular Season - (\d+)$/))) return `第 ${m[1]} 轮`;
  if ((m = round.match(/^Group Stage - (\d+)$/))) return `小组赛第 ${m[1]} 轮`;
  if ((m = round.match(/^League Stage - (\d+)$/))) return `联赛阶段第 ${m[1]} 轮`;
  if ((m = round.match(/^(\d+)\w* Qualifying Round$/))) return `资格赛第 ${m[1]} 轮`;
  const fixed: Record<string, string> = {
    'Knockout Round Play-offs': '淘汰赛附加赛', 'Play-offs': '附加赛',
    'Round of 32': '32 强', 'Round of 16': '16 强',
    'Quarter-finals': '1/4 决赛', 'Semi-finals': '半决赛', 'Final': '决赛',
    'Preliminary Round': '预选赛', '3rd Place Final': '季军赛',
  };
  return fixed[round] ?? round;
}
