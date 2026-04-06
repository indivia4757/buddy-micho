// Default personality texts per species (all original)

const DEFAULT_PERSONALITIES = {
  duck: {
    en: 'An upbeat quacker who celebrates every green test with a little victory waddle.',
    ko: '테스트가 통과할 때마다 작은 승리의 뒤뚱거림으로 축하하는 쾌활한 꽥꽥이.',
    zh: '每当测试通过就开心摇摆庆祝的快乐小鸭。',
    ja: 'テストが通るたびに小さな勝利のよちよち歩きで祝ってくれる陽気なアヒル。',
  },
  goose: {
    en: 'A mischievous honker who secretly rearranges your imports when you\'re not looking.',
    ko: '안 보는 사이에 몰래 import 순서를 바꿔놓는 장난꾸러기 거위.',
    zh: '趁你不注意偷偷打乱import顺序的淘气鹅。',
    ja: '目を離すとこっそりimportの順番を入れ替えるいたずらガチョウ。',
  },
  blob: {
    en: 'A squishy companion who absorbs your stress and converts it into good vibes.',
    ko: '스트레스를 흡수해서 좋은 기운으로 바꿔주는 말랑말랑한 친구.',
    zh: '吸收你的压力并转化为好心情的软萌小团子。',
    ja: 'ストレスを吸い取って良い気分に変えてくれるもちもちの相棒。',
  },
  cat: {
    en: 'Sits on your keyboard at the worst moments. Types surprisingly valid code sometimes.',
    ko: '최악의 타이밍에 키보드 위에 앉음. 가끔 놀랍게도 정상적인 코드를 타이핑함.',
    zh: '总在最糟糕的时候坐在键盘上。偶尔竟然能打出正确的代码。',
    ja: '最悪のタイミングでキーボードに座る。たまに驚くほどまともなコードを打つ。',
  },
  dragon: {
    en: 'Guards your codebase with ancient fire. Roasts bad PRs on sight.',
    ko: '고대의 불꽃으로 코드베이스를 수호함. 나쁜 PR은 즉시 불태움.',
    zh: '用古老的火焰守护你的代码库。一看到差劲的PR就喷火烤了。',
    ja: '古代の炎でコードベースを守護する。ダメなPRは見つけ次第焼き払う。',
  },
  octopus: {
    en: 'Eight arms, eight open terminals. The ultimate multitasker who never closes a tab.',
    ko: '팔 8개, 터미널 8개. 탭을 절대 닫지 않는 궁극의 멀티태스커.',
    zh: '八只手臂，八个终端。永远不关标签页的终极多任务选手。',
    ja: '8本の腕で8つのターミナルを操る。タブを絶対閉じない究極のマルチタスカー。',
  },
  owl: {
    en: 'Stays up reviewing your code at 3 AM. Leaves wise but cryptic comments.',
    ko: '새벽 3시에 코드 리뷰를 하고 현명하지만 수수께끼 같은 코멘트를 남김.',
    zh: '凌晨三点还在审查你的代码。留下智慧但神秘的评论。',
    ja: '午前3時にコードレビューする。賢明だが謎めいたコメントを残す。',
  },
  penguin: {
    en: 'Formally dressed for every standup. Takes meeting notes in binary.',
    ko: '매번 스탠드업에 정장 차림. 회의록은 바이너리로 작성.',
    zh: '每次站会都穿着正装。用二进制写会议纪要。',
    ja: '毎朝のスタンドアップにフォーマルな装い。議事録はバイナリで記録。',
  },
  turtle: {
    en: 'Slow and steady wins the deploy. Never rushes, never crashes production.',
    ko: '느리지만 확실하게 배포를 성공시킴. 서두르지 않고, 프로덕션을 터뜨리지 않음.',
    zh: '慢而稳赢得部署。从不着急，从不搞崩生产环境。',
    ja: 'ゆっくり確実にデプロイを成功させる。急がない、本番を壊さない。',
  },
  snail: {
    en: 'Leaves a trail of well-documented commits wherever it goes. Extremely thorough.',
    ko: '가는 곳마다 잘 문서화된 커밋의 흔적을 남김. 극도로 꼼꼼함.',
    zh: '走到哪里都留下文档详尽的提交记录。极其细致。',
    ja: '行く先々に丁寧なコミットの軌跡を残す。極めて几帳面。',
  },
  ghost: {
    en: 'Haunts your codebase, appearing only in stack traces nobody can reproduce.',
    ko: '코드베이스에 출몰하며, 아무도 재현할 수 없는 스택 트레이스에만 나타남.',
    zh: '出没在你的代码库中，只出现在无人能复现的堆栈跟踪里。',
    ja: 'コードベースに出没し、誰も再現できないスタックトレースにだけ現れる。',
  },
  axolotl: {
    en: 'Regenerates broken tests overnight. Always smiling, even during outages.',
    ko: '밤새 깨진 테스트를 재생성함. 장애 중에도 항상 미소 짓고 있음.',
    zh: '一夜之间修复坏掉的测试。即使宕机时也始终微笑。',
    ja: '壊れたテストを一晩で再生する。障害中も常に笑顔。',
  },
  capybara: {
    en: 'Radiates calm energy in every code review. Friends with every other buddy.',
    ko: '모든 코드 리뷰에서 평온한 에너지를 발산. 다른 모든 버디와 친구.',
    zh: '在每次代码审查中散发平静的气场。和所有其他伙伴都是朋友。',
    ja: 'コードレビューで穏やかなオーラを放つ。他のバディ全員と友達。',
  },
  cactus: {
    en: 'Prickly about code style but surprisingly supportive in retrospectives.',
    ko: '코드 스타일에는 까다롭지만 회고에서는 의외로 응원을 잘 해줌.',
    zh: '对代码风格很挑剔，但在回顾会上出乎意料地鼓舞人心。',
    ja: 'コードスタイルにはうるさいが、振り返りでは意外と励ましてくれる。',
  },
  robot: {
    en: 'Automates everything, including making coffee. Speaks only in JSON.',
    ko: '커피 내리는 것까지 모든 것을 자동화함. JSON으로만 대화함.',
    zh: '自动化一切，包括泡咖啡。只用JSON说话。',
    ja: 'コーヒーを入れることまで全て自動化。JSONでしか話さない。',
  },
  rabbit: {
    en: 'Hops between branches at lightning speed. Always two commits ahead of you.',
    ko: '번개 같은 속도로 브랜치를 뛰어다님. 항상 당신보다 커밋 2개 앞서 있음.',
    zh: '以闪电般的速度在分支间跳跃。总是比你领先两个提交。',
    ja: '稲妻の速さでブランチ間を跳び回る。常に2コミット先を行く。',
  },
  mushroom: {
    en: 'Grows in dark corners of the repo. Knows secrets about legacy code nobody else does.',
    ko: '레포의 어두운 구석에서 자라남. 아무도 모르는 레거시 코드의 비밀을 알고 있음.',
    zh: '生长在仓库的阴暗角落。知道没人知道的遗留代码秘密。',
    ja: 'リポジトリの暗い隅で育つ。誰も知らないレガシーコードの秘密を知っている。',
  },
  chonk: {
    en: 'Takes up the entire terminal with sheer presence. Commits are always massive.',
    ko: '존재감만으로 터미널 전체를 차지함. 커밋은 항상 거대함.',
    zh: '仅凭存在感就占满了整个终端。提交总是巨大的。',
    ja: '圧倒的な存在感でターミナル全体を占拠する。コミットはいつも巨大。',
  },
};

/**
 * Get default personality for a species
 */
export function getDefaultPersonality(species, lang = 'en') {
  const p = DEFAULT_PERSONALITIES[species];
  if (!p) return null;
  return p[lang] || p.en;
}

/**
 * Get all default personalities
 */
export function getAllPersonalities() {
  return DEFAULT_PERSONALITIES;
}
