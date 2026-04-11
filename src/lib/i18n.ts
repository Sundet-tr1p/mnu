export type Locale = 'kz' | 'ru' | 'en'

export const LOCALE_STORAGE_KEY = 'uniconnect-locale'

// Admin note: edit this file to change app text in KZ/RU/EN.
export const localeLabels: Record<Locale, string> = {
  kz: 'KZ',
  ru: 'RU',
  en: 'EN',
}

export const translations = {
  appTitle: {
    kz: 'UniConnect',
    ru: 'UniConnect',
    en: 'UniConnect',
  },
  appSubtitle: {
    kz: 'MNU',
    ru: 'MNU',
    en: 'MNU',
  },
  loginTitle: {
    kz: 'UniConnect-ке киру',
    ru: 'Вход в UniConnect',
    en: 'Sign in to UniConnect',
  },
  loginButton: {
    kz: 'Кiру',
    ru: 'Войти',
    en: 'Sign in',
  },
  registerTitle: {
    kz: 'UniConnect-ке тiркелу',
    ru: 'Регистрация в UniConnect',
    en: 'Create UniConnect account',
  },
  registerButton: {
    kz: 'Тiркелу',
    ru: 'Зарегистрироваться',
    en: 'Sign up',
  },
  email: {
    kz: 'Email',
    ru: 'Email',
    en: 'Email',
  },
  password: {
    kz: 'құпия сөз',
    ru: 'Пароль',
    en: 'Password',
  },
  name: {
    kz: 'Аты',
    ru: 'Имя',
    en: 'Name',
  },
  surname: {
    kz: 'Тегi',
    ru: 'Фамилия',
    en: 'Surname',
  },
  noAccount: {
    kz: 'Аккаунт жок па?',
    ru: 'Нет аккаунта?',
    en: "Don't have an account?",
  },
  haveAccount: {
    kz: 'Аккаунт бар ма?',
    ru: 'Уже есть аккаунт?',
    en: 'Already have an account?',
  },
  registerLink: {
    kz: 'Тiркелу',
    ru: 'Зарегистрируйся',
    en: 'Register',
  },
  loginLink: {
    kz: 'Кiру',
    ru: 'Войди',
    en: 'Log in',
  },
  menu: {
    kz: 'Menu',
    ru: 'Меню',
    en: 'Menu',
  },
  account: {
    kz: 'Account',
    ru: 'Аккаунт',
    en: 'Account',
  },
  feed: {
    kz: 'Лента',
    ru: 'Лента',
    en: 'Feed',
  },
  organizations: {
    kz: 'Ұйымдар',
    ru: 'Организации',
    en: 'Organizations',
  },
  chats: {
    kz: 'Чаттар',
    ru: 'Чаты',
    en: 'Chats',
  },
  reviews: {
    kz: 'Пiкiрлер',
    ru: 'Отзывы',
    en: 'Reviews',
  },
  faq: {
    kz: 'FAQ',
    ru: 'FAQ',
    en: 'FAQ',
  },
  surveys: {
    kz: 'Сауалнамалар',
    ru: 'Опросы',
    en: 'Surveys',
  },
  notifications: {
    kz: 'Хабарламалар',
    ru: 'Уведомления',
    en: 'Notifications',
  },
  profile: {
    kz: 'Профиль',
    ru: 'Профиль',
    en: 'Profile',
  },
  logout: {
    kz: 'Шығу',
    ru: 'Выйти',
    en: 'Log out',
  },
  student: {
    kz: 'Оқушы',
    ru: 'Студент',
    en: 'Student',
  },
  teacher: {
    kz: 'Окытушы',
    ru: 'Преподаватель',
    en: 'Teacher',
  },
  connectingError: {
    kz: 'Серверге косылу катесi',
    ru: 'Ошибка подключения к серверу',
    en: 'Connection error',
  },
  loginError: {
    kz: 'Кiру катесi',
    ru: 'Ошибка логина',
    en: 'Login error',
  },
  registerError: {
    kz: 'Тiркелу катесi',
    ru: 'Ошибка регистрации',
    en: 'Registration error',
  },
} as const

export type TranslationKey = keyof typeof translations

