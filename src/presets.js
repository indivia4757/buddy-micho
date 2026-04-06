// Named buddy presets organized by theme (all original names and descriptions)

export const THEMES = {
  cute: {
    name: { en: 'Cute & Cuddly', ko: '귀여운 친구들', zh: '可爱萌宠', ja: 'かわいい仲間' },
    description: {
      en: 'Adorable companions with sparkly eyes',
      ko: '반짝이는 눈의 사랑스러운 친구들',
      zh: '闪闪发光的可爱伙伴',
      ja: 'キラキラおめめの愛らしい仲間',
    },
  },
  spooky: {
    name: { en: 'Midnight Hour', ko: '한밤중의 그림자', zh: '午夜时分', ja: '真夜中の影' },
    description: {
      en: 'Eerie beings from the dark side of the terminal',
      ko: '터미널 어둠 속에서 온 으스스한 존재들',
      zh: '来自终端黑暗面的诡异存在',
      ja: 'ターミナルの暗闘から来た不気味な存在',
    },
  },
  royal: {
    name: { en: 'Golden Throne', ko: '황금 왕좌', zh: '黄金王座', ja: '黄金の玉座' },
    description: {
      en: 'Noble rulers of the repository',
      ko: '레포지토리의 고귀한 지배자들',
      zh: '代码仓库的高贵统治者',
      ja: 'リポジトリの高貴なる支配者',
    },
  },
  chaos: {
    name: { en: 'Chaos Engine', ko: '카오스 엔진', zh: '混沌引擎', ja: 'カオスエンジン' },
    description: {
      en: 'Unpredictable agents of terminal mayhem',
      ko: '터미널 대혼란의 예측불가 요원들',
      zh: '终端大混乱的不可预测特工',
      ja: 'ターミナル大混乱の予測不能エージェント',
    },
  },
  zen: {
    name: { en: 'Inner Peace', ko: '내면의 평화', zh: '内心宁静', ja: '心の平和' },
    description: {
      en: 'Calm companions for mindful coding',
      ko: '마음챙김 코딩을 위한 평온한 동반자',
      zh: '专注编程的宁静伙伴',
      ja: 'マインドフルなコーディングのための穏やかな仲間',
    },
  },
  tech: {
    name: { en: 'Circuit Board', ko: '회로 기판', zh: '电路板', ja: '回路基板' },
    description: {
      en: 'Digital minds for digital times',
      ko: '디지털 시대를 위한 디지털 두뇌',
      zh: '数字时代的数字头脑',
      ja: 'デジタル時代のデジタルマインド',
    },
  },
  shiny: {
    name: { en: 'Starlight Collection', ko: '별빛 컬렉션', zh: '星光收藏', ja: '星明かりコレクション' },
    description: {
      en: 'Ultra-rare golden variants — patience required!',
      ko: '초희귀 골든 버전 — 인내가 필요합니다!',
      zh: '超稀有金色变种——需要耐心！',
      ja: '超レアな金色バージョン — 忍耐が必要！',
    },
  },
};

export const NAMED_PRESETS = [
  // ── cute ──
  {
    id: 'moonbeam',
    theme: 'cute',
    name: { en: 'Moonbeam', ko: '달빛이', zh: '月光宝贝', ja: 'ムーンビーム' },
    description: {
      en: 'A gentle axolotl glowing under moonlight',
      ko: '달빛 아래 빛나는 부드러운 아홀로틀',
      zh: '在月光下发光的温柔美西螈',
      ja: '月明かりに照らされる優しいウーパールーパー',
    },
    species: 'axolotl', eye: '✦', hat: 'halo', rarity: 'Rare',
  },
  {
    id: 'cotton_puff',
    theme: 'cute',
    name: { en: 'Cotton Puff', ko: '솜사탕', zh: '棉花糖', ja: 'わたあめ' },
    description: {
      en: 'A fluffy rabbit who hops through your code',
      ko: '코드 사이를 뛰어다니는 복슬복슬 토끼',
      zh: '在代码间蹦跳的毛茸茸兔子',
      ja: 'コードの間を跳ね回るふわふわウサギ',
    },
    species: 'rabbit', eye: '·', hat: 'beanie',
  },
  {
    id: 'pudding',
    theme: 'cute',
    name: { en: 'Pudding', ko: '푸딩이', zh: '布丁', ja: 'プリン' },
    description: {
      en: 'A wobbly blob full of sweetness',
      ko: '달콤함으로 가득 찬 흔들흔들 블롭',
      zh: '充满甜蜜的摇晃小团子',
      ja: '甘さいっぱいのぷるぷるブロブ',
    },
    species: 'blob', eye: '°', hat: 'tinyduck',
  },
  {
    id: 'whiskers',
    theme: 'cute',
    name: { en: 'Whiskers', ko: '수염이', zh: '小胡须', ja: 'おひげちゃん' },
    description: {
      en: 'A curious cat with twinkling eyes',
      ko: '반짝이는 눈의 호기심 많은 고양이',
      zh: '眼睛闪闪的好奇小猫',
      ja: 'キラキラお目目の好奇心旺盛な猫',
    },
    species: 'cat', eye: '✦', hat: 'none',
  },

  // ── spooky ──
  {
    id: 'phantom_coder',
    theme: 'spooky',
    name: { en: 'Phantom Coder', ko: '유령 코더', zh: '幽灵码农', ja: 'ファントムコーダー' },
    description: {
      en: 'A ghost that only appears in unreproducible stack traces',
      ko: '재현 불가능한 스택 트레이스에만 나타나는 유령',
      zh: '只出现在无法复现的堆栈跟踪中的幽灵',
      ja: '再現できないスタックトレースにだけ現れる幽霊',
    },
    species: 'ghost', eye: '◉', hat: 'wizard', rarity: 'Epic',
  },
  {
    id: 'sporecaster',
    theme: 'spooky',
    name: { en: 'Sporecaster', ko: '포자술사', zh: '孢子施法者', ja: '胞子キャスター' },
    description: {
      en: 'A mushroom brewing dark potions in the shadows',
      ko: '그림자 속에서 어둠의 물약을 끓이는 버섯',
      zh: '在暗处酿造黑暗药水的蘑菇',
      ja: '影の中で闇のポーションを調合するキノコ',
    },
    species: 'mushroom', eye: '×', hat: 'wizard', rarity: 'Rare',
  },
  {
    id: 'night_watcher',
    theme: 'spooky',
    name: { en: 'Night Watcher', ko: '밤의 파수꾼', zh: '暗夜守望者', ja: '夜の番人' },
    description: {
      en: 'An owl who reviews code in the dead of night',
      ko: '한밤중에 코드 리뷰하는 올빼미',
      zh: '在深夜审查代码的猫头鹰',
      ja: '真夜中にコードレビューするフクロウ',
    },
    species: 'owl', eye: '◉', hat: 'halo', rarity: 'Rare',
  },

  // ── royal ──
  {
    id: 'sovereign_flame',
    theme: 'royal',
    name: { en: 'Sovereign Flame', ko: '화염 군주', zh: '火焰君主', ja: '炎の君主' },
    description: {
      en: 'A legendary dragon ruling from the golden throne',
      ko: '황금 왕좌에서 다스리는 전설의 용',
      zh: '从黄金王座上统治的传说之龙',
      ja: '黄金の玉座から統べる伝説のドラゴン',
    },
    species: 'dragon', eye: '✦', hat: 'crown', rarity: 'Legendary',
  },
  {
    id: 'admiral_frost',
    theme: 'royal',
    name: { en: 'Admiral Frost', ko: '서리 제독', zh: '霜冻提督', ja: '霜の提督' },
    description: {
      en: 'A distinguished penguin commanding the fleet',
      ko: '함대를 이끄는 위풍당당한 펭귄',
      zh: '指挥舰队的威严企鹅',
      ja: '艦隊を率いる威厳あるペンギン',
    },
    species: 'penguin', eye: '·', hat: 'crown', rarity: 'Epic',
  },
  {
    id: 'professor_plume',
    theme: 'royal',
    name: { en: 'Professor Plume', ko: '깃털 교수', zh: '羽毛教授', ja: 'プルーム教授' },
    description: {
      en: 'A wise owl in a top hat dispensing wisdom',
      ko: '실크햇을 쓰고 지혜를 나눠주는 현명한 올빼미',
      zh: '戴着礼帽传授智慧的聪明猫头鹰',
      ja: 'シルクハットで知恵を授ける賢いフクロウ',
    },
    species: 'owl', eye: '✦', hat: 'tophat', rarity: 'Rare',
  },
  {
    id: 'duchess_mew',
    theme: 'royal',
    name: { en: 'Duchess Mew', ko: '야옹 공작부인', zh: '喵公爵夫人', ja: 'ニャン公爵夫人' },
    description: {
      en: 'An epic cat with a regal gaze',
      ko: '왕실의 눈빛을 가진 고양이',
      zh: '拥有皇家凝视的史诗级猫咪',
      ja: '気品ある眼差しのエピック猫',
    },
    species: 'cat', eye: '◉', hat: 'crown', rarity: 'Epic',
  },

  // ── chaos ──
  {
    id: 'giga_unit',
    theme: 'chaos',
    name: { en: 'Giga Unit', ko: '기가 유닛', zh: '超级单位', ja: 'ギガユニット' },
    description: {
      en: 'An absolute chonk spinning a propeller of destruction',
      ko: '파괴의 프로펠러를 돌리는 절대적 뚱보',
      zh: '旋转毁灭螺旋桨的绝对胖墩',
      ja: '破壊のプロペラを回す絶対的デカブツ',
    },
    species: 'chonk', eye: '@', hat: 'propeller', rarity: 'Epic',
  },
  {
    id: 'honk_protocol',
    theme: 'chaos',
    name: { en: 'Honk Protocol', ko: '꽥꽥 프로토콜', zh: '鸣叫协议', ja: 'ホンクプロトコル' },
    description: {
      en: 'A goose that force-pushes to main without remorse',
      ko: '양심의 가책 없이 main에 force-push하는 거위',
      zh: '毫无悔意地force-push到main的鹅',
      ja: '良心の呵責なくmainにforce-pushするガチョウ',
    },
    species: 'goose', eye: '@', hat: 'propeller', rarity: 'Rare',
  },
  {
    id: 'rubber_menace',
    theme: 'chaos',
    name: { en: 'Rubber Menace', ko: '고무 오리 위협', zh: '橡皮鸭威胁', ja: 'ラバーダック脅威' },
    description: {
      en: 'A duck wearing a tiny duck — it\'s ducks all the way down',
      ko: '작은 오리를 쓴 오리 — 거북이 아래에도 거북이',
      zh: '戴着小鸭子的鸭子——一路鸭到底',
      ja: '小さいアヒルを被ったアヒル — 亀の上に亀',
    },
    species: 'duck', eye: '×', hat: 'tinyduck',
  },
  {
    id: 'glitch_bot',
    theme: 'chaos',
    name: { en: 'Glitch Bot', ko: '글리치 봇', zh: '故障机器人', ja: 'グリッチボット' },
    description: {
      en: 'A malfunctioning robot who loves merge conflicts',
      ko: '머지 충돌을 사랑하는 고장난 로봇',
      zh: '热爱合并冲突的故障机器人',
      ja: 'マージコンフリクトを愛する故障ロボット',
    },
    species: 'robot', eye: '×', hat: 'tinyduck',
  },

  // ── zen ──
  {
    id: 'steady_shell',
    theme: 'zen',
    name: { en: 'Steady Shell', ko: '든든한 등껍질', zh: '稳壳', ja: '堅実シェル' },
    description: {
      en: 'A patient turtle who never rushes a deploy',
      ko: '배포를 서두르지 않는 인내심 있는 거북이',
      zh: '从不着急部署的耐心乌龟',
      ja: 'デプロイを急がない忍耐強いカメ',
    },
    species: 'turtle', eye: '°', hat: 'halo',
  },
  {
    id: 'drift',
    theme: 'zen',
    name: { en: 'Drift', ko: '흘러가기', zh: '漂流', ja: 'ドリフト' },
    description: {
      en: 'A snail leaving a trail of perfect commits',
      ko: '완벽한 커밋의 흔적을 남기는 달팽이',
      zh: '留下完美提交记录轨迹的蜗牛',
      ja: '完璧なコミットの軌跡を残すカタツムリ',
    },
    species: 'snail', eye: '·', hat: 'none',
  },
  {
    id: 'hot_spring',
    theme: 'zen',
    name: { en: 'Hot Spring', ko: '온천 카피바라', zh: '温泉水豚', ja: '温泉カピバラ' },
    description: {
      en: 'A capybara soaking in warm peaceful energy',
      ko: '따뜻한 평화로운 에너지에 잠긴 카피바라',
      zh: '沐浴在温暖平和能量中的水豚',
      ja: '温かく穏やかなエネルギーに浸るカピバラ',
    },
    species: 'capybara', eye: '°', hat: 'beanie',
  },

  // ── tech ──
  {
    id: 'kernel_prime',
    theme: 'tech',
    name: { en: 'Kernel Prime', ko: '커널 프라임', zh: '内核至尊', ja: 'カーネルプライム' },
    description: {
      en: 'A legendary robot running on pure logic',
      ko: '순수한 논리로 작동하는 전설의 로봇',
      zh: '以纯逻辑运行的传说机器人',
      ja: '純粋なロジックで動く伝説のロボット',
    },
    species: 'robot', eye: '◉', hat: 'propeller', rarity: 'Legendary',
  },
  {
    id: 'deep_ink',
    theme: 'tech',
    name: { en: 'Deep Ink', ko: '딥 잉크', zh: '深墨', ja: 'ディープインク' },
    description: {
      en: 'An octopus entangled in network cables',
      ko: '네트워크 케이블에 얽힌 문어',
      zh: '缠在网线里的章鱼',
      ja: 'ネットワークケーブルに絡まったタコ',
    },
    species: 'octopus', eye: '@', hat: 'tophat', rarity: 'Rare',
  },
  {
    id: 'signal_bloom',
    theme: 'tech',
    name: { en: 'Signal Bloom', ko: '신호 꽃', zh: '信号绽放', ja: 'シグナルブルーム' },
    description: {
      en: 'A cactus that doubles as a Wi-Fi antenna',
      ko: 'Wi-Fi 안테나를 겸하는 선인장',
      zh: '兼做Wi-Fi天线的仙人掌',
      ja: 'Wi-Fiアンテナを兼ねるサボテン',
    },
    species: 'cactus', eye: '°', hat: 'wizard', rarity: 'Rare',
  },

  // ── shiny ──
  {
    id: 'gilded_fang',
    theme: 'shiny',
    name: { en: 'Gilded Fang', ko: '황금 송곳니', zh: '镀金之牙', ja: '金色の牙' },
    description: {
      en: 'A shimmering dragon bathed in golden light',
      ko: '황금빛에 물든 빛나는 용',
      zh: '沐浴在金色光芒中的闪耀之龙',
      ja: '黄金の光に包まれた輝くドラゴン',
    },
    species: 'dragon', shiny: true,
  },
  {
    id: 'stardust',
    theme: 'shiny',
    name: { en: 'Stardust', ko: '별먼지', zh: '星尘', ja: 'スターダスト' },
    description: {
      en: 'A glittering axolotl from another galaxy',
      ko: '다른 은하에서 온 반짝이는 아홀로틀',
      zh: '来自另一个星系的闪亮美西螈',
      ja: '別の銀河から来たキラキラのウーパールーパー',
    },
    species: 'axolotl', shiny: true,
  },
  {
    id: 'golden_whisper',
    theme: 'shiny',
    name: { en: 'Golden Whisper', ko: '황금빛 속삭임', zh: '金色低语', ja: '黄金のささやき' },
    description: {
      en: 'A cat whose purr shimmers with golden sparks',
      ko: '골든 스파크가 빛나는 그르릉 소리의 고양이',
      zh: '咕噜声闪烁金色火花的猫',
      ja: 'ゴロゴロが黄金の火花で輝く猫',
    },
    species: 'cat', shiny: true,
  },
];

/**
 * List all themes
 */
export function listThemes() {
  return Object.entries(THEMES).map(([key, theme]) => ({ key, ...theme }));
}

/**
 * List all named presets
 */
export function listNamedPresets() {
  return NAMED_PRESETS;
}

/**
 * Get presets by theme
 */
export function getPresetsByTheme(themeKey) {
  return NAMED_PRESETS.filter(p => p.theme === themeKey);
}

/**
 * Get a single preset by id
 */
export function getPresetById(id) {
  return NAMED_PRESETS.find(p => p.id === id) || null;
}

/**
 * Legacy compat: list presets grouped by theme
 */
export function listPresets() {
  return listThemes();
}
