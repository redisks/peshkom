export const places = [
  {
    id: 1,
    name: "Красная площадь",
    coordinates: {
      lat: 55.7539,
      lng: 37.6208,
    },
    description:
      "Главная площадь Москвы, исторический и культурный центр, окруженный знаковыми памятниками архитектуры. Здесь проходят важные государственные события, праздники и концерты.",
    address: "Красная пл., Москва, 109012",
    tags: [
      "историческое место",
      "культурный центр",
      "архитектура",
      "символ Москвы",
    ],
    rating: 4.8,
    reviews: [
      {
        author: "Анна Петрова",
        date: "2024-03-15",
        rating: 5,
        text: "Невероятное место с богатой историей! Обязательно к посещению в Москве.",
      },
      {
        author: "Иван Сидоров",
        date: "2024-03-10",
        rating: 4,
        text: "Красиво, но очень многолюдно. Лучше приходить рано утром.",
      },
    ],
    image: "data:image/jpeg;base64,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",
  },
  {
    id: 2,
    name: "Московский Кремль",
    coordinates: {
      lat: 55.7517,
      lng: 37.6178,
    },
    description:
      "Исторический укрепленный комплекс в центре Москвы, официальная резиденция президента России. Включает дворцы, соборы, музеи и окружен крепостной стеной с башнями.",
    address: "Московский Кремль, Москва, 103132",
    tags: ["история", "архитектура", "музей", "резиденция президента"],
    rating: 4.9,
    reviews: [
      {
        author: "Екатерина Смирнова",
        date: "2024-03-12",
        rating: 5,
        text: "Величественное место! Столько истории в одном месте. Экскурсия была очень информативной.",
      },
      {
        author: "Андрей Попов",
        date: "2024-03-08",
        rating: 5,
        text: "Обязательно к посещению. Особенно впечатлили соборы и царь-пушка.",
      },
    ],
    image: "data:image/jpeg;base64,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",
  },
  {
    id: 3,
    name: "Собор Василия Блаженного",
    coordinates: {
      lat: 55.7525,
      lng: 37.623,
    },
    description:
      "Яркий и узнаваемый православный храм на Красной площади, построенный в XVI веке по приказу Ивана Грозного. Известен своими разноцветными куполами и уникальной архитектурой.",
    address: "Красная пл., 2, Москва, 109012",
    tags: ["храм", "архитектура", "история", "религия"],
    rating: 4.7,
    reviews: [
      {
        author: "Сергей Иванов",
        date: "2024-03-14",
        rating: 5,
        text: "Невероятной красоты собор! Внутри ещё интереснее, чем снаружи.",
      },
      {
        author: "Елена Кузнецова",
        date: "2024-03-09",
        rating: 4,
        text: "Очень красиво снаружи, но внутри показалось немного тесновато.",
      },
    ],
    image: "https://kudamoscow.ru/uploads/3de770b8e5adc14585a3d8bf9155989d.jpg",
  },
  {
    id: 4,
    name: "Третьяковская галерея",
    coordinates: {
      lat: 55.7415,
      lng: 37.6208,
    },
    description:
      "Крупнейший музей русского искусства в мире, основанный в 1856 году купцом Павлом Третьяковым. В коллекции представлены произведения искусства с XI по XX век.",
    address: "Лаврушинский пер., 10, Москва, 119017",
    tags: ["музей", "искусство", "история", "культура"],
    rating: 4.7,
    reviews: [
      {
        author: "Антон Сидоров",
        date: "2024-03-11",
        rating: 5,
        text: "Обязательна к посещению всем ценителям искусства! Коллекция впечатляет.",
      },
      {
        author: "Марина Козлова",
        date: "2024-03-07",
        rating: 4,
        text: "Очень богатая коллекция, но немного утомительно из-за размеров музея.",
      },
    ],
    image: "https://moskultura.ru/wp-content/uploads/2021/11/tretgalereya.jpeg",
  },
  {
    id: 5,
    name: "Большой театр",
    coordinates: {
      lat: 55.7602,
      lng: 37.6186,
    },
    description:
      "Один из ведущих театров оперы и балета в России и мире, основанный в 1776 году. Здание театра является памятником архитектуры и символом русской культуры.",
    address: "Театральная пл., 1, Москва, 125009",
    tags: ["театр", "культура", "опера", "балет"],
    rating: 4.8,
    reviews: [
      {
        author: "Александра Ковалева",
        date: "2024-03-13",
        rating: 5,
        text: "Безусловный шедевр мирового уровня! Посещение балета оставило незабываемые впечатления.",
      },
      {
        author: "Владимир Петров",
        date: "2024-03-06",
        rating: 4,
        text: "Великолепный театр с богатой историей. Билеты дорогие, но того стоит.",
      },
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Moscow-Bolshoi-Theare-1.jpg/330px-Moscow-Bolshoi-Theare-1.jpg",
  },
  {
    id: 6,
    name: "Парк Горького",
    coordinates: {
      lat: 55.728,
      lng: 37.601,
    },
    description:
      "Центральный парк культуры и отдыха им. Горького, одно из самых популярных общественных пространств Москвы. Включает зоны для отдыха, спортивные площадки, набережную Москвы-реки.",
    address: "Крымский Вал, 9, Москва, 119049",
    tags: ["парк", "отдых", "развлечения", "спорт"],
    rating: 4.5,
    reviews: [
      {
        author: "Денис Борисов",
        date: "2024-03-10",
        rating: 4,
        text: "Отличное место для прогулок и активного отдыха. Много молодежи, летом работают фонтаны.",
      },
      {
        author: "Ирина Захарова",
        date: "2024-03-05",
        rating: 5,
        text: "Люблю этот парк! Всегда чисто, ухоженно, много мероприятий.",
      },
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxgwO66S3LPBNV7l5hpbv7_4f3ufXz6f3v9g&s",
  },
  {
    id: 7,
    name: "ВДНХ",
    coordinates: {
      lat: 55.827,
      lng: 37.638,
    },
    description:
      "Крупнейший выставочный, музейный и рекреационный комплекс в мире, основанный в 1939 году. На территории расположены павильоны, представляющие различные отрасли и регионы.",
    address: "пр-т Мира, 119, Москва, 129223",
    tags: ["выставка", "парк", "музей", "архитектура"],
    rating: 4.6,
    reviews: [
      {
        author: "Сергей Куликов",
        date: "2024-03-12",
        rating: 5,
        text: "Огромная территория с богатой историей. Можно провести целый день.",
      },
      {
        author: "Анастасия Попова",
        date: "2024-03-08",
        rating: 4,
        text: "Интересное место, но немного устаревшее. Некоторые павильоны на реконструкции.",
      },
    ],
    image: "https://a.travelcdn.mts.ru/travel-media/VDNH_Zaglavnaya_2eb8e7f522.webp",
  },
  {
    id: 8,
    name: "Храм Христа Спасителя",
    coordinates: {
      lat: 55.7445,
      lng: 37.605,
    },
    description:
      "Кафедральный собор Русской православной церкви, воссозданный в 1990-х годах на месте одноименного храма, разрушенного в 1931 году. Крупнейший храм Русской православной церкви.",
    address: "ул. Волхонка, 15, Москва, 119019",
    tags: ["храм", "религия", "архитектура", "история"],
    rating: 4.6,
    reviews: [
      {
        author: "Ольга Николаева",
        date: "2024-03-11",
        rating: 5,
        text: "Величественный и красивый храм. Внутри потрясающая роспись и убранство.",
      },
      {
        author: "Михаил Орлов",
        date: "2024-03-07",
        rating: 4,
        text: "Впечатляющее здание, но слишком много туристов. Лучше посещать во время службы.",
      },
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw3EZq4r2VX-L2LzZJRNnBk61B_Idx2dx6fA&s",
  },
  {
    id: 9,
    name: "Государственный исторический музей",
    coordinates: {
      lat: 55.7553,
      lng: 37.6178,
    },
    description:
      "Крупнейший национальный исторический музей России, основанный в 1872 году. Коллекция музея отражает историю и культуру России с древнейших времен до наших дней.",
    address: "Красная пл., 1, Москва, 109012",
    tags: ["музей", "история", "культура", "образование"],
    rating: 4.6,
    reviews: [
      {
        author: "Алексей Морозов",
        date: "2024-03-13",
        rating: 5,
        text: "Потрясающий музей! Огромная коллекция экспонатов, отлично представлена история России.",
      },
      {
        author: "Татьяна Соколова",
        date: "2024-03-09",
        rating: 4,
        text: "Интересно, но очень много информации. Лучше посещать с экскурсией.",
      },
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc9iON537N-SSQgD5nA-8_LVC31Edv_hOBbA&s",
  },
  {
    id: 10,
    name: "Московский зоопарк",
    coordinates: {
      lat: 55.7633,
      lng: 37.5765,
    },
    description:
      "Один из старейших зоопарков в Европе, основанный в 1864 году. В коллекции зоопарка представлены более 1000 видов животных со всего мира.",
    address: "Большая Грузинская ул., 1, Москва, 123242",
    tags: ["зоопарк", "животные", "семейный отдых", "природа"],
    rating: 4.4,
    reviews: [
      {
        author: "Евгения Павлова",
        date: "2024-03-12",
        rating: 4,
        text: "Хороший зоопарк, детям очень понравилось. Но в выходные слишком многолюдно.",
      },
      {
        author: "Артем Васильев",
        date: "2024-03-08",
        rating: 4,
        text: "Интересное место для семейного посещения. Некоторые вольеры нуждаются в обновлении.",
      },
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9mgJ8oMo6BD86QAGpmGJzVwzfDe82pQZynQ&s",
  }
];