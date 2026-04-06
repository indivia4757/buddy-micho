// Internationalization support

const STRINGS = {
  en: {
    // General
    title: 'Buddy Micho',
    subtitle: 'Claude Code Buddy Manager',
    version: 'Version',

    // Menu
    menu_current: 'View Current Buddy',
    menu_roll: 'Roll New Buddy',
    menu_presets: 'Browse Presets',
    menu_collection: 'My Collection',
    menu_achievements: 'Achievements',
    menu_apply: 'Apply to Claude Code',
    menu_restore: 'Restore Original',
    menu_settings: 'Settings',
    menu_exit: 'Exit',

    // Buddy info
    species: 'Species',
    rarity: 'Rarity',
    eyes: 'Eyes',
    hat: 'Hat',
    shiny: 'SHINY',
    stats: 'Stats',
    salt: 'Salt',

    // Finder
    searching: 'Searching for your buddy...',
    search_progress: '{attempts} attempts | {rate}/s | {elapsed}s | found: {found}',
    found: 'Found a match!',
    matches_found: 'match(es) found',
    search_complete: 'Search complete: {attempts} attempts in {elapsed}s — {found} match(es) found',
    not_found: 'No match found after {attempts} attempts',
    difficulty: 'Estimated difficulty: {difficulty}',
    expected_attempts: 'Expected attempts: ~{count}',

    // Collection
    collection_title: 'My Collection',
    collection_empty: 'No buddies collected yet. Roll your first one!',
    total: 'Total',
    favorites: 'Favorites',
    completion: 'Completion',

    collected: 'Collected',
    best_rarity: 'Best',

    // Achievements
    achievements_title: 'Achievements',
    achievement_first_roll: 'First Steps - Roll your first buddy',
    achievement_collector_10: 'Collector - Collect 10 buddies',
    achievement_collector_50: 'Enthusiast - Collect 50 buddies',
    achievement_collector_100: 'Hoarder - Collect 100 buddies',
    achievement_all_species: 'Gotta Catch Em All - Collect all species',
    achievement_first_shiny: 'Golden Touch - Find your first shiny',
    achievement_first_legend: 'Legendary - Find a legendary buddy',
    achievement_shiny_legend: 'Myth - Find a shiny legendary',
    achievement_hat_trick: 'Hat Collector - Collect all hat types',
    achievement_all_eyes: 'All Seeing - Collect all eye types',
    achievement_applied_5: 'Makeover - Apply 5 different buddies',

    // Patcher
    patching: 'Patching Claude Code binary...',
    patch_success: 'Patched successfully! Restart Claude Code to see your new buddy.',
    patch_positions: 'Patched {count} location(s)',
    backup_at: 'Backup saved at: {path}',
    restore_success: 'Restored original binary from backup.',
    binary_not_found: 'Could not find Claude Code binary.',

    // Presets
    presets_title: 'Buddy Presets',
    select_preset: 'Select a theme:',
    select_buddy: 'Select a buddy:',
    browse_by_theme: 'Browse by Theme',
    browse_all: 'Browse All Presets',

    // Nickname & Personality
    nickname: 'Nickname',
    enter_nickname: 'Give your buddy a nickname (enter to skip):',
    nickname_set: 'Nickname set to: {name}',
    nickname_cleared: 'Nickname cleared.',
    menu_rename: 'Rename Buddy',
    personality: 'Personality',
    enter_personality: 'Set a custom personality (enter to skip):',
    personality_set: 'Custom personality set!',
    personality_cleared: 'Custom personality cleared. Using default.',
    menu_customize: 'Customize Buddy',

    // Errors
    invalid_input: 'is not a valid option. Please enter a number in range.',
    error_userid: 'Could not determine user ID. Please provide it manually.',
  },

  ko: {
    title: 'Buddy Micho',
    subtitle: 'Claude Code 버디 매니저',
    version: '버전',

    menu_current: '현재 버디 보기',
    menu_roll: '새 버디 뽑기',
    menu_presets: '프리셋 둘러보기',
    menu_collection: '내 컬렉션',
    menu_achievements: '업적',
    menu_apply: 'Claude Code에 적용',
    menu_restore: '원래대로 복원',
    menu_settings: '설정',
    menu_exit: '종료',

    species: '종류',
    rarity: '등급',
    eyes: '눈',
    hat: '모자',
    shiny: '빛나는',
    stats: '스탯',
    salt: '솔트',

    searching: '버디를 찾는 중...',
    search_progress: '{attempts}회 시도 | {rate}/초 | {elapsed}초',
    found: '찾았습니다!',
    matches_found: '마리 발견',
    search_complete: '검색 완료: {attempts}회 시도, {elapsed}초 — {found}마리 발견',
    not_found: '{attempts}회 시도 후 찾지 못했습니다',
    difficulty: '예상 난이도: {difficulty}',
    expected_attempts: '예상 시도 횟수: ~{count}',

    collection_title: '내 컬렉션',
    collection_empty: '아직 수집한 버디가 없습니다. 첫 번째 버디를 뽑아보세요!',
    total: '전체',
    favorites: '즐겨찾기',
    completion: '완성도',

    collected: '수집됨',
    best_rarity: '최고 등급',

    achievements_title: '업적',
    achievement_first_roll: '첫 걸음 - 첫 버디 뽑기',
    achievement_collector_10: '수집가 - 버디 10마리 수집',
    achievement_collector_50: '열성팬 - 버디 50마리 수집',
    achievement_collector_100: '수장가 - 버디 100마리 수집',
    achievement_all_species: '컴플리트 - 모든 종류 수집',
    achievement_first_shiny: '황금 손 - 첫 빛나는 버디 발견',
    achievement_first_legend: '전설 - 전설 등급 버디 발견',
    achievement_shiny_legend: '신화 - 빛나는 전설 버디 발견',
    achievement_hat_trick: '모자 수집가 - 모든 모자 종류 수집',
    achievement_all_eyes: '천리안 - 모든 눈 종류 수집',
    achievement_applied_5: '변신 - 5가지 다른 버디 적용',

    patching: 'Claude Code 바이너리 패치 중...',
    patch_success: '패치 완료! Claude Code를 재시작하면 새 버디가 나타납니다.',
    patch_positions: '{count}개 위치 패치됨',
    backup_at: '백업 저장: {path}',
    restore_success: '백업에서 원본 바이너리를 복원했습니다.',
    binary_not_found: 'Claude Code 바이너리를 찾을 수 없습니다.',

    presets_title: '버디 프리셋',
    select_preset: '테마를 선택하세요:',
    select_buddy: '버디를 선택하세요:',
    browse_by_theme: '테마별 둘러보기',
    browse_all: '전체 프리셋 보기',

    nickname: '닉네임',
    enter_nickname: '버디에게 닉네임을 지어주세요 (건너뛰려면 엔터):',
    nickname_set: '닉네임 설정: {name}',
    nickname_cleared: '닉네임이 삭제되었습니다.',
    menu_rename: '버디 이름 변경',
    personality: '성격',
    enter_personality: '커스텀 성격을 설정하세요 (건너뛰려면 엔터):',
    personality_set: '커스텀 성격이 설정되었습니다!',
    personality_cleared: '커스텀 성격이 삭제되었습니다. 기본값을 사용합니다.',
    menu_customize: '버디 꾸미기',

    invalid_input: '은(는) 올바른 번호가 아닙니다. 범위 내 숫자를 입력해주세요.',
    error_userid: '사용자 ID를 확인할 수 없습니다. 직접 입력해주세요.',
  },

  zh: {
    title: 'Buddy Micho',
    subtitle: 'Claude Code 伙伴管理器',
    version: '版本',

    menu_current: '查看当前伙伴',
    menu_roll: '抽取新伙伴',
    menu_presets: '浏览预设',
    menu_collection: '我的收藏',
    menu_achievements: '成就',
    menu_apply: '应用到 Claude Code',
    menu_restore: '恢复原始版本',
    menu_settings: '设置',
    menu_exit: '退出',

    species: '种类',
    rarity: '稀有度',
    eyes: '眼睛',
    hat: '帽子',
    shiny: '闪光',
    stats: '属性',
    salt: '盐值',

    searching: '正在搜索你的伙伴...',
    search_progress: '{attempts}次尝试 | {rate}/秒 | {elapsed}秒',
    found: '找到了！',
    matches_found: '个匹配',
    search_complete: '搜索完成：{attempts}次尝试，{elapsed}秒 — 找到{found}个',
    not_found: '{attempts}次尝试后未找到',
    difficulty: '预计难度：{difficulty}',
    expected_attempts: '预计尝试次数：~{count}',

    collection_title: '我的收藏',
    collection_empty: '还没有收集到伙伴。抽取你的第一个吧！',
    total: '总计',
    favorites: '收藏',
    completion: '完成度',

    collected: '已收集',
    best_rarity: '最高稀有度',

    achievements_title: '成就',
    achievement_first_roll: '第一步 - 抽取第一个伙伴',
    achievement_collector_10: '收藏家 - 收集10个伙伴',
    achievement_collector_50: '爱好者 - 收集50个伙伴',
    achievement_collector_100: '囤积者 - 收集100个伙伴',
    achievement_all_species: '全部收集 - 收集所有种类',
    achievement_first_shiny: '金手指 - 找到第一个闪光伙伴',
    achievement_first_legend: '传说 - 找到传说级伙伴',
    achievement_shiny_legend: '神话 - 找到闪光传说伙伴',
    achievement_hat_trick: '帽子收藏家 - 收集所有帽子种类',
    achievement_all_eyes: '全视之眼 - 收集所有眼睛种类',
    achievement_applied_5: '变装 - 应用5个不同的伙伴',

    patching: '正在修补 Claude Code 二进制文件...',
    patch_success: '修补成功！重启 Claude Code 即可看到新伙伴。',
    patch_positions: '已修补{count}个位置',
    backup_at: '备份保存在：{path}',
    restore_success: '已从备份恢复原始二进制文件。',
    binary_not_found: '找不到 Claude Code 二进制文件。',

    presets_title: '伙伴预设',
    select_preset: '选择主题：',
    select_buddy: '选择伙伴：',
    browse_by_theme: '按主题浏览',
    browse_all: '浏览所有预设',

    nickname: '昵称',
    enter_nickname: '给你的伙伴起个昵称（按回车跳过）：',
    nickname_set: '昵称已设为：{name}',
    nickname_cleared: '昵称已清除。',
    menu_rename: '重命名伙伴',
    personality: '性格',
    enter_personality: '设置自定义性格（按回车跳过）：',
    personality_set: '自定义性格已设置！',
    personality_cleared: '自定义性格已清除。使用默认值。',
    menu_customize: '自定义伙伴',

    invalid_input: '不是有效选项。请输入范围内的数字。',
    error_userid: '无法确定用户ID，请手动输入。',
  },

  ja: {
    title: 'Buddy Micho',
    subtitle: 'Claude Code バディマネージャー',
    version: 'バージョン',

    menu_current: '現在のバディを見る',
    menu_roll: '新しいバディを引く',
    menu_presets: 'プリセットを見る',
    menu_collection: 'マイコレクション',
    menu_achievements: '実績',
    menu_apply: 'Claude Codeに適用',
    menu_restore: '元に戻す',
    menu_settings: '設定',
    menu_exit: '終了',

    species: '種類',
    rarity: 'レア度',
    eyes: '目',
    hat: '帽子',
    shiny: 'シャイニー',
    stats: 'ステータス',
    salt: 'ソルト',

    searching: 'バディを探しています...',
    search_progress: '{attempts}回試行 | {rate}/秒 | {elapsed}秒',
    found: '見つかりました！',
    matches_found: '匹発見',
    search_complete: '検索完了：{attempts}回試行、{elapsed}秒 — {found}匹発見',
    not_found: '{attempts}回試行後、見つかりませんでした',
    difficulty: '推定難易度：{difficulty}',
    expected_attempts: '推定試行回数：~{count}',

    collection_title: 'マイコレクション',
    collection_empty: 'まだバディがいません。最初の一匹を引きましょう！',
    total: '合計',
    favorites: 'お気に入り',
    completion: '完成度',

    collected: '収集済み',
    best_rarity: '最高レア度',

    achievements_title: '実績',
    achievement_first_roll: '第一歩 - 最初のバディを引く',
    achievement_collector_10: 'コレクター - バディを10匹集める',
    achievement_collector_50: '愛好家 - バディを50匹集める',
    achievement_collector_100: '収集家 - バディを100匹集める',
    achievement_all_species: 'コンプリート - 全種類を集める',
    achievement_first_shiny: 'ゴールデンタッチ - 初のシャイニーを見つける',
    achievement_first_legend: 'レジェンド - 伝説級バディを見つける',
    achievement_shiny_legend: '神話 - シャイニー伝説バディを見つける',
    achievement_hat_trick: '帽子コレクター - 全帽子種類を集める',
    achievement_all_eyes: '千里眼 - 全目種類を集める',
    achievement_applied_5: '変身 - 5種類のバディを適用する',

    patching: 'Claude Codeバイナリをパッチ中...',
    patch_success: 'パッチ完了！Claude Codeを再起動すると新しいバディが現れます。',
    patch_positions: '{count}箇所をパッチしました',
    backup_at: 'バックアップ保存先：{path}',
    restore_success: 'バックアップから元のバイナリを復元しました。',
    binary_not_found: 'Claude Codeバイナリが見つかりません。',

    presets_title: 'バディプリセット',
    select_preset: 'テーマを選択：',
    select_buddy: 'バディを選択：',
    browse_by_theme: 'テーマ別で見る',
    browse_all: '全プリセットを見る',

    nickname: 'ニックネーム',
    enter_nickname: 'バディにニックネームをつけましょう（スキップはEnter）：',
    nickname_set: 'ニックネーム設定：{name}',
    nickname_cleared: 'ニックネームを削除しました。',
    menu_rename: 'バディの名前変更',
    personality: '性格',
    enter_personality: 'カスタム性格を設定（スキップはEnter）：',
    personality_set: 'カスタム性格を設定しました！',
    personality_cleared: 'カスタム性格を削除しました。デフォルトを使用します。',
    menu_customize: 'バディカスタマイズ',

    invalid_input: 'は有効な番号ではありません。範囲内の数字を入力してください。',
    error_userid: 'ユーザーIDを特定できません。手動で入力してください。',
  },
};

let currentLang = 'en';

export function setLanguage(lang) {
  if (STRINGS[lang]) {
    currentLang = lang;
  }
}

export function getLanguage() {
  return currentLang;
}

export function t(key, params = {}) {
  const str = STRINGS[currentLang]?.[key] || STRINGS.en[key] || key;
  return str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
}

export function getSupportedLanguages() {
  return Object.keys(STRINGS);
}

export { STRINGS };
