// プロフィール情報
export const PROFILE = {
  nameJa: '小松﨑 博人',
  nameEn: 'Hiroto Komatsuzaki',
  title: '不動産投資家',
  subtitle: '一都三県・名古屋エリア中心に収益不動産へ投資しています',
  company: 'HARUKAZE株式会社 代表取締役',
  location: '名古屋',
  property: 'La Pesca（名古屋市中村区）',
  phone: '080-6432-6297',
  email: 'kohiro805@gmail.com',
  bio: {
    engineer: 'ネットワークエンジニアとして5年以上の実務経験を持つ。企業ネットワークの設計・構築・運用を担当し、高可用性インフラの実現に取り組む。',
    investor: 'HARUKAZE株式会社を設立し、不動産投資・法人運営に従事。名古屋市中村区に物件「La Pesca」を保有。',
  },
};

// SNSリンク
export const SOCIAL_LINKS = [
  {
    service: 'LINE',
    url: 'https://line.me/ti/p/4wqUPgZU27#~',
    label: 'LINEで友だち追加',
    color: '#06C755',
    icon: 'line',
  },
  {
    service: 'Instagram',
    url: 'https://www.instagram.com/kohiro805',
    label: '@kohiro805',
    color: '#E1306C',
    icon: 'instagram',
  },
  {
    service: 'X',
    url: 'https://x.com/kohiro805',
    label: '@kohiro805',
    color: '#000000',
    icon: 'x',
  },
] as const;
