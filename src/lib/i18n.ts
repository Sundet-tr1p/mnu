export type Locale = 'kz' | 'ru' | 'en'

export const LOCALE_STORAGE_KEY = 'uniconnect-locale'

/** Cookie с тем же именем — для SSR (профиль и т.д.) */
export const LOCALE_COOKIE_NAME = LOCALE_STORAGE_KEY

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
  faculty: {
    kz: 'Факультет',
    ru: 'Факультет',
    en: 'Faculty',
  },
  filterAll: {
    kz: 'Барлығы',
    ru: 'Все',
    en: 'All',
  },
  role: {
    kz: 'Рөл',
    ru: 'Роль',
    en: 'Role',
  },
  administrator: {
    kz: 'Әкімші',
    ru: 'Администратор',
    en: 'Administrator',
  },
  feedTitle: {
    kz: 'Таспа',
    ru: 'Лента',
    en: 'Feed',
  },
  refresh: {
    kz: 'Жаңарту',
    ru: 'Обновить',
    en: 'Refresh',
  },
  writePost: {
    kz: 'Жазба жазу…',
    ru: 'Написать пост…',
    en: 'Write a post…',
  },
  postTitle: {
    kz: 'Тақырып',
    ru: 'Заголовок',
    en: 'Title',
  },
  postBody: {
    kz: 'Мәтін',
    ru: 'Текст',
    en: 'Text',
  },
  cancel: {
    kz: 'Болдырмау',
    ru: 'Отмена',
    en: 'Cancel',
  },
  publish: {
    kz: 'Жариялау',
    ru: 'Опубликовать',
    en: 'Publish',
  },
  publishing: {
    kz: 'Жариялануда…',
    ru: 'Публикация…',
    en: 'Publishing…',
  },
  noPostsYet: {
    kz: 'Әлі пост жоқ',
    ru: 'Постов пока нет',
    en: 'No posts yet',
  },
  orgPageTitle: {
    kz: 'Ұйымдар',
    ru: 'Организации',
    en: 'Organizations',
  },
  openCommunity: {
    kz: 'Қауымдастықты ашу',
    ru: 'Открыть сообщество',
    en: 'Open community',
  },
  closeForm: {
    kz: 'Жабу',
    ru: 'Закрыть',
    en: 'Close',
  },
  communityName: {
    kz: 'Атауы',
    ru: 'Название сообщества',
    en: 'Community name',
  },
  iconEmoji: {
    kz: 'Эмодзи (мысалы: 🏛️)',
    ru: 'Иконка (например: 🧑‍⚖️)',
    en: 'Icon (emoji)',
  },
  logoUpload: {
    kz: 'Логотип (сурет)',
    ru: 'Логотип (изображение)',
    en: 'Logo (image)',
  },
  uploading: {
    kz: 'Жүктелуде…',
    ru: 'Загрузка…',
    en: 'Uploading…',
  },
  remove: {
    kz: 'Алып тастау',
    ru: 'Убрать',
    en: 'Remove',
  },
  description: {
    kz: 'Сипаттама',
    ru: 'Описание',
    en: 'Description',
  },
  create: {
    kz: 'Құру',
    ru: 'Создать',
    en: 'Create',
  },
  saving: {
    kz: 'Сақталуда…',
    ru: 'Сохранение…',
    en: 'Saving…',
  },
  save: {
    kz: 'Сақтау',
    ru: 'Сохранить',
    en: 'Save',
  },
  edit: {
    kz: 'Өңдеу',
    ru: 'Редактировать',
    en: 'Edit',
  },
  noOrgsYet: {
    kz: 'Ұйымдар әлі жоқ',
    ru: 'Организаций пока нет',
    en: 'No organizations yet',
  },
  saveError: {
    kz: 'Сақтау қатесі',
    ru: 'Ошибка сохранения',
    en: 'Save failed',
  },
  networkErrorShort: {
    kz: 'Желі қатесі',
    ru: 'Ошибка сети',
    en: 'Network error',
  },
  createFailed: {
    kz: 'Құру қатесі',
    ru: 'Ошибка создания',
    en: 'Create failed',
  },
  uploadFailed: {
    kz: 'Жүктеу қатесі',
    ru: 'Ошибка загрузки',
    en: 'Upload failed',
  },
  faqPageTitle: {
    kz: 'ЖҚС',
    ru: 'FAQ',
    en: 'FAQ',
  },
  faqAdd: {
    kz: 'Сұрақ қосу',
    ru: 'Добавить вопрос',
    en: 'Add question',
  },
  question: {
    kz: 'Сұрақ',
    ru: 'Вопрос',
    en: 'Question',
  },
  answer: {
    kz: 'Жауап',
    ru: 'Ответ',
    en: 'Answer',
  },
  order: {
    kz: 'Рет',
    ru: 'Порядок',
    en: 'Order',
  },
  noFaqYet: {
    kz: 'Сұрақтар әлі жоқ',
    ru: 'Вопросов пока нет',
    en: 'No questions yet',
  },
  surveysPageTitle: {
    kz: 'Сауалнамалар',
    ru: 'Опросы',
    en: 'Surveys',
  },
  surveyAdd: {
    kz: 'Сауалнама қосу',
    ru: 'Добавить опрос',
    en: 'Add survey',
  },
  surveyName: {
    kz: 'Атауы',
    ru: 'Название',
    en: 'Title',
  },
  surveyLink: {
    kz: 'Сілтеме (https://…)',
    ru: 'Ссылка (https://…)',
    en: 'Link (https://…)',
  },
  surveyOpen: {
    kz: 'Ашу →',
    ru: 'Открыть →',
    en: 'Open →',
  },
  noSurveysYet: {
    kz: 'Сауалнамалар жоқ',
    ru: 'Опросов пока нет',
    en: 'No surveys yet',
  },
  profilePageTitle: {
    kz: 'Профиль',
    ru: 'Профиль',
    en: 'Profile',
  },
  profileNotFound: {
    kz: 'Профиль табылмады',
    ru: 'Профиль не найден',
    en: 'Profile not found',
  },
  postsStat: {
    kz: 'Жазбалар',
    ru: 'Посты',
    en: 'Posts',
  },
  likesStat: {
    kz: 'Лайктар',
    ru: 'Лайки',
    en: 'Likes',
  },
  schoolShort: {
    kz: 'Факультет:',
    ru: 'Факультет:',
    en: 'Faculty:',
  },
  specialtyShort: {
    kz: 'Мамандық:',
    ru: 'Специальность:',
    en: 'Specialty:',
  },
  bioShort: {
    kz: 'Өзі туралы:',
    ru: 'О себе:',
    en: 'Bio:',
  },
  registeredShort: {
    kz: 'Тіркелді:',
    ru: 'Регистрация:',
    en: 'Joined:',
  },
  notificationsPageTitle: {
    kz: 'Хабарламалар',
    ru: 'Уведомления',
    en: 'Notifications',
  },
  noNotificationsYet: {
    kz: 'Хабарламалар жоқ',
    ru: 'Уведомлений пока нет',
    en: 'No notifications yet',
  },
  notifTypeNewOrganization: {
    kz: 'Жаңа қауымдастық',
    ru: 'Новое сообщество',
    en: 'New community',
  },
  notifTypeFaqUpdated: {
    kz: 'ЖҚС жаңартылды',
    ru: 'Обновление FAQ',
    en: 'FAQ updated',
  },
  notifTypeSurveyUpdated: {
    kz: 'Сауалнамалар',
    ru: 'Опросы',
    en: 'Surveys',
  },
  reviewsPageTitle: {
    kz: 'Пікірлер',
    ru: 'Отзывы',
    en: 'Reviews',
  },
  noReviewsYet: {
    kz: 'Пікірлер әлі жоқ',
    ru: 'Отзывов пока нет',
    en: 'No reviews yet',
  },
  reviewAboutTeacher: {
    kz: 'Оқытушы туралы:',
    ru: 'О преподавателе:',
    en: 'About teacher:',
  },
  reviewsStudentsOnly: {
    kz: 'Пікірлерді тек студенттер қалдыра алады.',
    ru: 'Отзывы могут оставлять только студенты.',
    en: 'Only students can leave reviews.',
  },
  reviewsNoTeachers: {
    kz: 'Базада оқытушылар жоқ.',
    ru: 'Нет преподавателей в базе.',
    en: 'No teachers in the database.',
  },
  reviewFormNewTitle: {
    kz: 'Жаңа пікір',
    ru: 'Новый отзыв',
    en: 'New review',
  },
  ratingLabel: {
    kz: 'Баға',
    ru: 'Оценка',
    en: 'Rating',
  },
  commentLabel: {
    kz: 'Пікір',
    ru: 'Комментарий',
    en: 'Comment',
  },
  reviewSend: {
    kz: 'Жіберу',
    ru: 'Отправить',
    en: 'Submit',
  },
  reviewSending: {
    kz: 'Жіберілуде…',
    ru: 'Отправка…',
    en: 'Sending…',
  },
  errorGeneric: {
    kz: 'Қате',
    ru: 'Ошибка',
    en: 'Error',
  },
  emDash: {
    kz: '—',
    ru: '—',
    en: '—',
  },
} as const

export type TranslationKey = keyof typeof translations

/** Тег для `toLocaleDateString` (kz → kk-KZ). */
export function dateLocaleTag(locale: Locale): string {
  if (locale === 'kz') return 'kk-KZ'
  if (locale === 'en') return 'en-US'
  return 'ru-RU'
}

