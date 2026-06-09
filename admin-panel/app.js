// State Managers
let appState = {
  vehicles: [],
  incidents: [],
  customers: [],
  parts: [],
  orders: [],
  teamMembers: [],
  walletTotal: 0,
  walletAvailable: 0,
  walletPending: 0,
  activeSubscription: '',
  subscriptionDaysRemaining: 0
};

let currentLang = localStorage.getItem('admin_lang') || 'en';
let currentTab = 'dashboard';

// Global Translations Dictionary (English & Uzbek)
const translations = {
  en: {
    'nav-lbl-navigation': 'Navigation',
    'nav-btn-dashboard': 'Dashboard Overview',
    'nav-btn-parts': 'Parts Catalog',
    'nav-btn-customers': 'Customer Database',
    'nav-btn-incidents': 'Incidents & Fleet',
    'nav-btn-orders': 'Order Operations',
    'btn-go-customer': 'AutoParts App',
    'btn-sync': 'Sync Data',
    'btn-reset-db': 'Reset Database',
    'card-lbl-total-equity': 'Total System Equity',
    'card-lbl-available': 'Available Funds',
    'card-lbl-pending': 'Pending Settlements',
    'btn-withdraw-action': 'Withdraw',
    'card-lbl-subscription': 'System License Tier',
    'card-lbl-remaining': 'Days Remaining',
    'card-lbl-quick-actions': 'Quick Diagnostics',
    'lbl-lbl-low-stock': 'Low Stock Parts',
    'lbl-lbl-incidents': 'Under Review',
    'lbl-lbl-active-orders': 'Pending Orders',
    'lbl-lbl-total-clients': 'Clients Registered',
    'lbl-dashboard-active-incidents': 'Active Operations Logs',
    'lbl-dashboard-active-incidents-sub': 'Recent outstanding incidents requiring attention',
    'btn-view-all': 'View All',
    'tbl-col-inc-id': 'ID',
    'tbl-col-inc-desc': 'Description',
    'tbl-col-inc-plate': 'Vehicle Plate',
    'tbl-col-inc-date': 'Report Date',
    'tbl-col-inc-status': 'Status',
    'tbl-col-inc-act': 'Action',
    'title-parts-catalog': 'Parts Inventory System',
    'sub-parts-catalog': 'Track stock quantities, modify unit pricing, and create customized catalog listings',
    'btn-add-part': 'Create New Part',
    'tbl-col-part-id': 'Part ID',
    'tbl-col-part-name': 'Product Name',
    'tbl-col-part-model': 'Compatible Model',
    'tbl-col-part-stock': 'Stock Level',
    'tbl-col-part-price': 'Price',
    'tbl-col-part-status': 'Status',
    'tbl-col-part-actions': 'Operations',
    'title-customers': 'Customer Database',
    'sub-customers': 'Manage client membership states, adjust plan tiers, and verify active portfolios',
    'btn-add-customer': 'Add Customer Account',
    'tbl-col-cust-id': 'Client ID',
    'tbl-col-cust-name': 'Full Name',
    'tbl-col-cust-tier': 'Tier / Plan',
    'tbl-col-cust-orders': 'Orders',
    'tbl-col-cust-status': 'Status',
    'tbl-col-cust-actions': 'Operations',
    'title-incidents': 'Incident Management Center',
    'sub-incidents': 'Update progress and control resolution statuses of reports filed by vehicles',
    'btn-add-incident-root': 'Record New Failure',
    'tbl-col-inc-main-id': 'ID',
    'tbl-col-inc-main-desc': 'Incident details',
    'tbl-col-inc-main-plate': 'Vehicle Plate',
    'tbl-col-inc-main-date': 'Date',
    'tbl-col-inc-main-status': 'Status',
    'tbl-col-inc-main-actions': 'Change Status',
    'title-fleet': 'Registered Vehicle Fleet',
    'sub-fleet': 'Bind new customer telemetry hardware or deregister expired/withdrawn vehicle profiles',
    'btn-bind-vehicle': 'Bind New Vehicle',
    'title-orders': 'Order Operations Hub',
    'sub-orders': 'Audit package activation orders and authorize or transition active member subscription invoices',
    'tbl-col-order-id': 'Order ID',
    'tbl-col-order-pkg': 'Subscription Level',
    'tbl-col-order-amt': 'Amount',
    'tbl-col-order-status': 'Status',
    'tbl-col-order-action': 'Actions',
    'mdl-part-title': 'Add New Catalog Part',
    'mdl-lbl-part-name': 'Product Name',
    'mdl-lbl-part-model': 'Compatible Vehicles / Model',
    'mdl-lbl-part-stock': 'Stock Quantity',
    'mdl-lbl-part-price': 'Price ($)',
    'mdl-btn-part-cancel': 'Cancel',
    'mdl-btn-part-save': 'Save Product',
    'mdl-customer-title': 'Add New Customer Account',
    'mdl-lbl-cust-name': 'Full Name',
    'mdl-lbl-cust-tier': 'Tier / plan',
    'mdl-lbl-cust-status': 'Status',
    'mdl-lbl-cust-orders': 'Invoiced Orders Count',
    'mdl-btn-cust-cancel': 'Cancel',
    'mdl-btn-cust-save': 'Save Client',
    'mdl-veh-title': 'Bind New Vehicle Profile',
    'mdl-lbl-veh-plate': 'License Plate (Number)',
    'mdl-lbl-veh-model': 'Vehicle Make / Model / VIN Code',
    'mdl-lbl-veh-emoji': 'Icon Indicator',
    'mdl-btn-veh-cancel': 'Cancel',
    'mdl-btn-veh-save': 'Bind Hardware',
    'mdl-inc-title': 'Log New Fault / Incident',
    'mdl-lbl-inc-select': 'Target Vehicle (Bound Fleet)',
    'mdl-lbl-inc-desc-title': 'Failure Description',
    'mdl-lbl-inc-status-title': 'Status',
    'mdl-btn-inc-cancel': 'Cancel',
    'mdl-btn-inc-save': 'Register Report'
  },
  uz: {
    'nav-lbl-navigation': 'Navigatsiya',
    'nav-btn-dashboard': 'Bosh sahifa (Dizayn)',
    'nav-btn-parts': 'Ehtiyot qismlar',
    'nav-btn-customers': 'Mijozlar bazasi',
    'nav-btn-incidents': 'Nosozliklar va transport',
    'nav-btn-orders': 'Buyurtmalar boshqaruvi',
    'btn-go-customer': 'Mijoz Ilovasi',
    'btn-sync': 'Sinxronizatsiya',
    'btn-reset-db': 'Ma’lumotlarni tozalash',
    'card-lbl-total-equity': 'Tizimdagi jami mablag‘',
    'card-lbl-available': 'Yechib olish imkoni',
    'card-lbl-pending': 'Kutilayotgan hisob-kitob',
    'btn-withdraw-action': 'Yechib olish',
    'card-lbl-subscription': 'Tizim litsenziya darajasi',
    'card-lbl-remaining': 'Qolgan kunlar',
    'card-lbl-quick-actions': 'Tezkor tahlil',
    'lbl-lbl-low-stock': 'Ehtiyot qismlar kam',
    'lbl-lbl-incidents': 'Ko‘rib chiqilmoqda',
    'lbl-lbl-active-orders': 'Kutilayotgan buyurtmalar',
    'lbl-lbl-total-clients': 'Mijozlar soni',
    'lbl-dashboard-active-incidents': 'Faol nosozliklar jurnali',
    'lbl-dashboard-active-incidents-sub': 'Tezkor hal qilinishi lozim bo‘lgan yaqindagi muammolar',
    'btn-view-all': 'Barchasini ko‘rish',
    'tbl-col-inc-id': 'ID raqami',
    'tbl-col-inc-desc': 'Tavsif / Tafsilotlar',
    'tbl-col-inc-plate': 'Avto raqami',
    'tbl-col-inc-date': 'Ro‘yxatga olingan kun',
    'tbl-col-inc-status': 'Holati',
    'tbl-col-inc-act': 'Harakat',
    'title-parts-catalog': 'Ehtiyot qismlar ombori tizimi',
    'sub-parts-catalog': 'Zaxira miqdori, birlik narxlari va mahsulotlar ro‘yxatini boshqarish',
    'btn-add-part': 'Yangi mahsulot yaratish',
    'tbl-col-part-id': 'ID raqami',
    'tbl-col-part-name': 'Mahsulot nomi',
    'tbl-col-part-model': 'Mos keluvchi model',
    'tbl-col-part-stock': 'Ombor zaxirasi',
    'tbl-col-part-price': 'Narx',
    'tbl-col-part-status': 'Holati',
    'tbl-col-part-actions': 'Amallar',
    'title-customers': 'Mijozlar tizim bazasi',
    'sub-customers': 'Mijoz a’zolari, paket darajalari va faol portfellarni boshqarish',
    'btn-add-customer': 'Yangi mijoz qo‘shish',
    'tbl-col-cust-id': 'Mijoz ID',
    'tbl-col-cust-name': 'To‘liq ismi sharifi',
    'tbl-col-cust-tier': 'Tarif / Paket',
    'tbl-col-cust-orders': 'Buyurtmalar',
    'tbl-col-cust-status': 'Holati',
    'tbl-col-cust-actions': 'Amallar',
    'title-incidents': 'Nosozliklar nazorati markazi',
    'sub-incidents': 'Avtomobillar yuborgan mexanik nosozliklar holati va rivojlanishini nazorat qilish',
    'btn-add-incident-root': 'Yangi nosozlikni qayd etish',
    'tbl-col-inc-main-id': 'ID',
    'tbl-col-inc-main-desc': 'Nosozlik tavsifi',
    'tbl-col-inc-main-plate': 'Avtomobil raqami',
    'tbl-col-inc-main-date': 'Sana',
    'tbl-col-inc-main-status': 'Holati',
    'tbl-col-inc-main-actions': 'Holatni o‘zgartirish',
    'title-fleet': 'Ro‘yxatdan o‘tgan avtomobillar parki',
    'sub-fleet': 'Yangi mijoz telemetriya qurilmalarini ulash yoki ulardan moslamalarni o‘chirish',
    'btn-bind-vehicle': 'Yangi avto ulash',
    'title-orders': 'Buyurtmalar boshqaruvi markazi',
    'sub-orders': 'A’zolik paketlar xaridlarini tekshirish, hisob-fakturalarni tasdiqlash yoki yangilash',
    'tbl-col-order-id': 'Buyurtma ID',
    'tbl-col-order-pkg': 'Satib olingan paket',
    'tbl-col-order-amt': 'Mablag‘ miqdori',
    'tbl-col-order-status': 'Holati',
    'tbl-col-order-action': 'Amallar',
    'mdl-part-title': 'Yangi ehtiyot qismini yaratish',
    'mdl-lbl-part-name': 'Mahsulot nomi',
    'mdl-lbl-part-model': 'Mos keluvchi transportlar / Model',
    'mdl-lbl-part-stock': 'Zaxira miqdori',
    'mdl-lbl-part-price': 'Narxi ($)',
    'mdl-btn-part-cancel': 'Bekor qilish',
    'mdl-btn-part-save': 'Mahsulotni saqlash',
    'mdl-customer-title': 'Yangi mijoz qaydnomasini qo‘shish',
    'mdl-lbl-cust-name': 'To‘liq ismi sharifi',
    'mdl-lbl-cust-tier': 'Tarif darajasi',
    'mdl-lbl-cust-status': 'Holati',
    'mdl-lbl-cust-orders': 'Invois qilingan xaridlar',
    'mdl-btn-cust-cancel': 'Bekor qilish',
    'mdl-btn-cust-save': 'Mijozni saqlash',
    'mdl-veh-title': 'Yangi transport vositasini ulash',
    'mdl-lbl-veh-plate': 'Davlat raqami (Plate)',
    'mdl-lbl-veh-model': 'Transport modeli / VIN kodi',
    'mdl-lbl-veh-emoji': 'Belgi ikonkasi',
    'mdl-btn-veh-cancel': 'Bekor qilish',
    'mdl-btn-veh-save': 'Uskunani faollashtirish',
    'mdl-inc-title': 'Yangi nosozlikni ro‘yxatga olish',
    'mdl-lbl-inc-select': 'Avtomobilni tanlang (Tizimdagi)',
    'mdl-lbl-inc-desc-title': 'Nosozlik batafsil tavsifi',
    'mdl-lbl-inc-status-title': 'Holati',
    'mdl-btn-inc-cancel': 'Bekor qilish',
    'mdl-btn-inc-save': 'Nosozlikni saqlash'
  },
  ru: {
    'nav-lbl-navigation': 'Навигация',
    'nav-btn-dashboard': 'Обзор панели',
    'nav-btn-parts': 'Каталог запчастей',
    'nav-btn-customers': 'База клиентов',
    'nav-btn-incidents': 'Инциденты и флот',
    'nav-btn-orders': 'Управление заказами',
    'btn-go-customer': 'Приложение AutoParts',
    'btn-sync': 'Синхронизация',
    'btn-reset-db': 'Сбросить Базу',
    'card-lbl-total-equity': 'Общий капитал системы',
    'card-lbl-available': 'Доступные средства',
    'card-lbl-pending': 'Ожидающие платежи',
    'btn-withdraw-action': 'Вывод',
    'card-lbl-subscription': 'Уровень Лицензии Системы',
    'card-lbl-remaining': 'Осталось дней',
    'card-lbl-quick-actions': 'Быстрая Диагностика',
    'lbl-lbl-low-stock': 'Запчасти на исходе',
    'lbl-lbl-incidents': 'На проверке',
    'lbl-lbl-active-orders': 'Ожидающие Заказы',
    'lbl-lbl-total-clients': 'Зарегистрировано Клиентов',
    'lbl-dashboard-active-incidents': 'Журнал Активных Операций',
    'lbl-dashboard-active-incidents-sub': 'Недавние нерешенные инциденты, требующие внимания',
    'btn-view-all': 'Смотреть все',
    'tbl-col-inc-id': 'ID',
    'tbl-col-inc-desc': 'Описание',
    'tbl-col-inc-plate': 'Номер ТС',
    'tbl-col-inc-date': 'Дата сообщения',
    'tbl-col-inc-status': 'Статус',
    'tbl-col-inc-act': 'Действие',
    'title-parts-catalog': 'Система Инвентаризации Запчастей',
    'sub-parts-catalog': 'Отслеживайте количество на складе, изменяйте цены на единицы и создавайте индивидуализированные списки каталога',
    'btn-add-part': 'Создать Новую Запчасть',
    'tbl-col-part-id': 'ID Запчасти',
    'tbl-col-part-name': 'Название продукта',
    'tbl-col-part-model': 'Совместимая модель',
    'tbl-col-part-stock': 'Уровень запасов',
    'tbl-col-part-price': 'Цена',
    'tbl-col-part-status': 'Статус',
    'tbl-col-part-actions': 'Операции',
    'title-customers': 'База данных клиентов',
    'sub-customers': 'Управляйте статусами членства клиентов, настраивайте уровни планов и проверяйте активные портфели',
    'btn-add-customer': 'Добавить Аккаунт Клиента',
    'tbl-col-cust-id': 'ID Клиента',
    'tbl-col-cust-name': 'Полное имя',
    'tbl-col-cust-tier': 'Уровень / План',
    'tbl-col-cust-orders': 'Заказы',
    'tbl-col-cust-status': 'Статус',
    'tbl-col-cust-actions': 'Операции',
    'title-incidents': 'Центр управления инцидентами',
    'sub-incidents': 'Обновляйте прогресс и контролируйте статусы разрешения отчетов, поданных транспортными средствами',
    'btn-add-incident-root': 'Зарегистрировать новую поломку',
    'tbl-col-inc-main-id': 'ID',
    'tbl-col-inc-main-desc': 'Детали инцидента',
    'tbl-col-inc-main-plate': 'Номер ТС',
    'tbl-col-inc-main-date': 'Дата',
    'tbl-col-inc-main-status': 'Статус',
    'tbl-col-inc-main-actions': 'Изменить статус',
    'title-fleet': 'Зарегистрированный Автопарк',
    'sub-fleet': 'Связывайте новое аппаратное обеспечение телеметрии клиентов или отменяйте регистрацию устаревших/снятых с учета профилей транспортных средств',
    'btn-bind-vehicle': 'Привязать новое ТС',
    'title-orders': 'Центр операций с заказами',
    'sub-orders': 'Проверяйте заказы на активацию пакетов и авторизуйте или переносите активные счета за подписки членов',
    'tbl-col-order-id': 'ID Заказа',
    'tbl-col-order-pkg': 'Уровень подписки',
    'tbl-col-order-amt': 'Сумма',
    'tbl-col-order-status': 'Статус',
    'tbl-col-order-action': 'Действия',
    'mdl-part-title': 'Добавить новую запчасть в каталог',
    'mdl-lbl-part-name': 'Название продукта',
    'mdl-lbl-part-model': 'Совместимые транспортные средства / Модель',
    'mdl-lbl-part-stock': 'Количество на складе',
    'mdl-lbl-part-price': 'Цена ($)',
    'mdl-btn-part-cancel': 'Отмена',
    'mdl-btn-part-save': 'Сохранить продукт',
    'mdl-customer-title': 'Добавить Новый Аккаунт Клиента',
    'mdl-lbl-cust-name': 'Полное имя',
    'mdl-lbl-cust-tier': 'Уровень / план',
    'mdl-lbl-cust-status': 'Статус',
    'mdl-lbl-cust-orders': 'Количество Оплаченных Заказов',
    'mdl-btn-cust-cancel': 'Отмена',
    'mdl-btn-cust-save': 'Сохранить Клиента',
    'mdl-veh-title': 'Привязать Новый Профиль ТС',
    'mdl-lbl-veh-plate': 'Номерной Знак (Номер)',
    'mdl-lbl-veh-model': 'Марка ТС / Модель / VIN-код',
    'mdl-lbl-veh-emoji': 'Индикатор Иконки',
    'mdl-btn-veh-cancel': 'Отмена',
    'mdl-btn-veh-save': 'Привязать Оборудование',
    'mdl-inc-title': 'Залогировать Новую Поломку / Инцидент',
    'mdl-lbl-inc-select': 'Целевое ТС (Связанный Автопарк)',
    'mdl-lbl-inc-desc-title': 'Описание Поломки',
    'mdl-lbl-inc-status-title': 'Статус',
    'mdl-btn-inc-cancel': 'Отмена',
    'mdl-btn-inc-save': 'Зарегистрировать Отчет'
  },
  zh: {
    'nav-lbl-navigation': '导航',
    'nav-btn-dashboard': '仪表盘概览',
    'nav-btn-parts': '零件目录',
    'nav-btn-customers': '客户数据库',
    'nav-btn-incidents': '事件与车队',
    'nav-btn-orders': '订单操作',
    'btn-go-customer': 'AutoParts 应用',
    'btn-sync': '同步数据',
    'btn-reset-db': '重置数据库',
    'card-lbl-total-equity': '系统总资产',
    'card-lbl-available': '可用资金',
    'card-lbl-pending': '待结算资金',
    'btn-withdraw-action': '提现',
    'card-lbl-subscription': '系统许可等级',
    'card-lbl-remaining': '剩余天数',
    'card-lbl-quick-actions': '快速动作',
    'lbl-lbl-low-stock': '低库存零件',
    'lbl-lbl-incidents': '正在审核',
    'lbl-lbl-active-orders': '未决订单',
    'lbl-lbl-total-clients': '注册客户总数',
    'lbl-dashboard-active-incidents': '活动操作日志',
    'lbl-dashboard-active-incidents-sub': '需要注意的近期未解决事件',
    'btn-view-all': '查看全部',
    'tbl-col-inc-id': 'ID',
    'tbl-col-inc-desc': '描述',
    'tbl-col-inc-plate': '车牌号',
    'tbl-col-inc-date': '报告日期',
    'tbl-col-inc-status': '状态',
    'tbl-col-inc-act': '操作',
    'title-parts-catalog': '零件库存系统',
    'sub-parts-catalog': '跟踪库存数量，修改单价，并创建定制的目录列表',
    'btn-add-part': '创建新零件',
    'tbl-col-part-id': '零件 ID',
    'tbl-col-part-name': '产品名称',
    'tbl-col-part-model': '兼容型号',
    'tbl-col-part-stock': '库存级别',
    'tbl-col-part-price': '价格',
    'tbl-col-part-status': '状态',
    'tbl-col-part-actions': '操作',
    'title-customers': '客户数据库',
    'sub-customers': '管理客户会员状态，调整计划层级，并验证活动投资组合',
    'btn-add-customer': '添加客户帐户',
    'tbl-col-cust-id': '客户 ID',
    'tbl-col-cust-name': '全名',
    'tbl-col-cust-tier': '会员等级 / 计划',
    'tbl-col-cust-orders': '订单',
    'tbl-col-cust-status': '状态',
    'tbl-col-cust-actions': '操作',
    'title-incidents': '事件管理中心',
    'sub-incidents': '更新进度并控制车辆提交的报告的解决状态',
    'btn-add-incident-root': '记录新故障',
    'tbl-col-inc-main-id': 'ID',
    'tbl-col-inc-main-desc': '事件详情',
    'tbl-col-inc-main-plate': '车牌号',
    'tbl-col-inc-main-date': '日期',
    'tbl-col-inc-main-status': '状态',
    'tbl-col-inc-main-actions': '更改状态',
    'title-fleet': '注册车队',
    'sub-fleet': '绑定新的客户遥测硬件或取消注册已过期/撤回的车辆配置文件',
    'btn-bind-vehicle': '绑定新车辆',
    'title-orders': '订单运营中心',
    'sub-orders': '审核程序包激活订单，并授权或转移活跃会员订阅发票',
    'tbl-col-order-id': '订单 ID',
    'tbl-col-order-pkg': '订阅级别',
    'tbl-col-order-amt': '金额',
    'tbl-col-order-status': '状态',
    'tbl-col-order-action': '操作',
    'mdl-part-title': '添加新目录零件',
    'mdl-lbl-part-name': '产品名称',
    'mdl-lbl-part-model': '兼容车辆 / 型号',
    'mdl-lbl-part-stock': '库存数量',
    'mdl-lbl-part-price': '价格 ($)',
    'mdl-btn-part-cancel': '取消',
    'mdl-btn-part-save': '保存产品',
    'mdl-customer-title': '添加新的客户账户',
    'mdl-lbl-cust-name': '全名',
    'mdl-lbl-cust-tier': '等级 / 计划',
    'mdl-lbl-cust-status': '状态',
    'mdl-lbl-cust-orders': '开票订单数量',
    'mdl-btn-cust-cancel': '取消',
    'mdl-btn-cust-save': '保存客户',
    'mdl-veh-title': '绑定新车辆配置档案',
    'mdl-lbl-veh-plate': '车牌（号码）',
    'mdl-lbl-veh-model': '车辆品牌 / 型号 / VIN 码',
    'mdl-lbl-veh-emoji': '图标指示器',
    'mdl-btn-veh-cancel': '取消',
    'mdl-btn-veh-save': '绑定硬件',
    'mdl-inc-title': '记录新的错误 / 事件',
    'mdl-lbl-inc-select': '目标车辆 (绑定车队)',
    'mdl-lbl-inc-desc-title': '故障描述',
    'mdl-lbl-inc-status-title': '状态',
    'mdl-btn-inc-cancel': '取消',
    'mdl-btn-inc-save': '登记报告'
  }
};

// Initial setup on Window Load
window.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  syncAllData();
  lucide.createIcons();
});

// Sync data from database/Express API
async function syncAllData() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) {
      throw new Error('Server returned unhealthful status: ' + res.status);
    }
    const data = await res.json();
    appState = data;
    
    renderAppDashboard();
    triggerToast('Database synchronized successfully', 'success');
  } catch (error) {
    console.error('Data synchronization failed:', error);
    triggerToast('Failed to sync. Running in local fallback state.', 'error');
  }
}

// Set active language
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('admin_lang', lang);

  // Update button visual styles
  const btnEn = document.getElementById('btn-lang-en');
  const btnUz = document.getElementById('btn-lang-uz');
  const btnRu = document.getElementById('btn-lang-ru');
  const btnZh = document.getElementById('btn-lang-zh');
  
  const buttons = { en: btnEn, uz: btnUz, ru: btnRu, zh: btnZh };
  
  for (const key in buttons) {
    if (buttons[key]) {
      if (key === lang) {
        buttons[key].className = "px-3 py-1 text-xs font-semibold rounded-md transition-all bg-white text-slate-900 shadow-sm border border-slate-200/50";
      } else {
        buttons[key].className = "px-3 py-1 text-xs font-semibold rounded-md transition-all text-slate-500 hover:text-slate-800";
      }
    }
  }

  // Set page translation text nodes
  const map = translations[currentLang];
  for (const id in map) {
    const el = document.getElementById(id);
    if (el) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = map[id];
      } else {
        el.textContent = map[id];
      }
    }
  }

  // Update dynamic Header
  const headerTitle = document.getElementById('header-title');
  if (headerTitle) {
    if (currentTab === 'dashboard') headerTitle.textContent = map['nav-btn-dashboard'];
    else if (currentTab === 'parts') headerTitle.textContent = map['nav-btn-parts'];
    else if (currentTab === 'customers') headerTitle.textContent = map['nav-btn-customers'];
    else if (currentTab === 'incidents') headerTitle.textContent = map['nav-btn-incidents'];
    else if (currentTab === 'orders') headerTitle.textContent = map['nav-btn-orders'];
  }
}

// Sidebar Tab Switch Logic
function switchTab(tabId) {
  currentTab = tabId;

  // Toggle active views
  const sections = ['dashboard', 'parts', 'customers', 'incidents', 'orders'];
  sections.forEach(s => {
    const secEl = document.getElementById(`section-${s}`);
    const navEl = document.getElementById(`btn-tab-${s}`);
    
    if (secEl) {
      if (s === tabId) {
        secEl.classList.remove('hidden');
      } else {
        secEl.classList.add('hidden');
      }
    }

    if (navEl) {
      if (s === tabId) {
        navEl.classList.remove('text-slate-400');
        navEl.classList.add('text-slate-300', 'bg-slate-800/60', 'text-white');
      } else {
        navEl.classList.remove('text-slate-300', 'bg-slate-800/60', 'text-white');
        navEl.classList.add('text-slate-400');
      }
    }
  });

  // Re-render corresponding title
  const map = translations[currentLang];
  const headerTitle = document.getElementById('header-title');
  if (headerTitle) {
    if (tabId === 'dashboard') headerTitle.textContent = map['nav-btn-dashboard'];
    else if (tabId === 'parts') headerTitle.textContent = map['nav-btn-parts'];
    else if (tabId === 'customers') headerTitle.textContent = map['nav-btn-customers'];
    else if (tabId === 'incidents') headerTitle.textContent = map['nav-btn-incidents'];
    else if (tabId === 'orders') headerTitle.textContent = map['nav-btn-orders'];
  }
}

// Main rendering hub for stats, lists, grids
function renderAppDashboard() {
  // 1. Dashboard Financial Counters
  document.getElementById('stat-wallet-total').textContent = `$${appState.walletTotal.toLocaleString()}`;
  document.getElementById('stat-wallet-available').textContent = `$${appState.walletAvailable.toLocaleString()}`;
  document.getElementById('stat-wallet-pending').textContent = `$${appState.walletPending.toLocaleString()}`;
  document.getElementById('stat-subscription-name').textContent = `${appState.activeSubscription} Subscription`;
  document.getElementById('stat-subscription-days').textContent = `${appState.subscriptionDaysRemaining} days remaining`;

  // 2. Dashboard Diagnostics indicators
  const lowStockCount = appState.parts.filter(p => !p.stock || p.stock <= 15).length;
  document.getElementById('stat-low-stock-count').textContent = lowStockCount;

  const underReviewCount = appState.incidents.filter(inc => inc.status !== 'Closed').length;
  document.getElementById('stat-under-review-count').textContent = underReviewCount;

  const pendingOrdersCount = appState.orders.filter(o => o.status === 'Pending').length;
  document.getElementById('stat-pending-orders-count').textContent = pendingOrdersCount;

  document.getElementById('stat-customer-count').textContent = appState.customers.length;

  // 3. Render Dashboard Incidents preview table
  renderDashboardIncidents();

  // 4. Render main tables from active states
  renderPartsTable();
  renderCustomersTable();
  renderIncidentsTable();
  renderFleetGrid();
  renderOrdersTable();
}

// 1. Dashboard Incident Rows
function renderDashboardIncidents() {
  const tbody = document.getElementById('dashboard-incidents-tbody');
  tbody.innerHTML = '';
  
  // Show max recent 3
  const activeList = appState.incidents.slice(0, 3);
  if (activeList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400 font-medium">No incidents logged currently.</td></tr>`;
    return;
  }

  activeList.forEach(inc => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50/50 transition-colors";
    
    let badgeColor = "bg-slate-100 text-slate-700";
    if (inc.status === 'Processing') badgeColor = "bg-blue-150 text-blue-750 bg-blue-100/60 text-blue-600";
    if (inc.status === 'Under Review') badgeColor = "bg-amber-100 text-amber-700";
    if (inc.status === 'Closed') badgeColor = "bg-emerald-100 text-emerald-700";

    tr.innerHTML = `
      <td class="py-3 px-6 font-mono font-bold text-slate-900">${inc.id}</td>
      <td class="py-3 px-6 font-medium text-slate-700 max-w-xs truncate">${inc.description}</td>
      <td class="py-3 px-6 font-mono text-slate-500">${inc.vehiclePlate}</td>
      <td class="py-3 px-6 text-slate-400 font-mono">${inc.date || '---'}</td>
      <td class="py-3 px-6">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide inline-block ${badgeColor}">
          ${inc.status}
        </span>
      </td>
      <td class="py-3 px-6 text-right">
        <button onclick="switchTab('incidents')" class="text-blue-600 font-semibold hover:underline">Manage</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 2. Parts Catalog Rows
function renderPartsTable() {
  const tbody = document.getElementById('parts-tbody');
  tbody.innerHTML = '';

  if (appState.parts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400 font-medium">No catalog items available. Add one to start.</td></tr>`;
    return;
  }

  appState.parts.forEach(part => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/50 transition-all';
    
    let badgeColor = "bg-slate-100 text-slate-700";
    if (part.stock === 0) badgeColor = "bg-rose-100 text-rose-700";
    else if (part.stock <= 15) badgeColor = "bg-amber-100 text-amber-700";
    else badgeColor = "bg-emerald-100 text-emerald-700";

    tr.innerHTML = `
      <td class="py-4 px-6 font-mono text-slate-400">#PRT-${part.id}</td>
      <td class="py-4 px-6 font-semibold text-slate-800">${part.name}</td>
      <td class="py-4 px-6 text-slate-500">${part.model}</td>
      <td class="py-4 px-6 text-center font-mono font-bold text-slate-800">${part.stock}</td>
      <td class="py-4 px-6 text-center font-mono font-semibold text-slate-900">$${(parseFloat(part.price) || 0).toFixed(2)}</td>
      <td class="py-4 px-6">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide inline-block ${badgeColor}">
          ${part.stock === 0 ? 'Out of Stock' : part.stock <= 15 ? 'Low Stock' : 'In Stock'}
        </span>
      </td>
      <td class="py-4 px-6 text-right space-x-1">
        <button onclick="openPartModal('${part.id}')" class="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold transition" title="Modify Stock/Price">Edit</button>
        <button onclick="deletePart('${part.id}')" class="px-2.5 py-1 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition" title="Delete Product">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


// 3. Customer Relations List
function renderCustomersTable() {
  const tbody = document.getElementById('customers-tbody');
  tbody.innerHTML = '';

  if (appState.customers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400 font-medium">No registered customers mapped.</td></tr>`;
    return;
  }

  appState.customers.forEach(cust => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/50 transition-all';

    let tierBadge = "bg-slate-100 text-slate-700";
    if (cust.tier === 'Enterprise') tierBadge = "bg-purple-100 text-purple-700 font-bold border border-purple-200/55";
    if (cust.tier === 'Pro') tierBadge = "bg-indigo-100 text-indigo-700 font-bold border border-indigo-200/55";

    let statusBadge = "bg-slate-100 text-slate-700";
    if (cust.status === 'Active') statusBadge = "bg-emerald-100 text-emerald-700";
    if (cust.status === 'Pending') statusBadge = "bg-amber-100 text-amber-700 text-amber-900";
    if (cust.status === 'Frozen') statusBadge = "bg-rose-100 text-rose-700";

    tr.innerHTML = `
      <td class="py-4 px-6 font-mono text-slate-400">#CUST-0${cust.id}</td>
      <td class="py-4 px-6 font-semibold text-slate-800">${cust.name}</td>
      <td class="py-4 px-6">
        <span class="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider ${tierBadge}">
          ${cust.tier}
        </span>
      </td>
      <td class="py-4 px-6 text-center font-mono font-medium text-slate-800">${cust.orders || 0}</td>
      <td class="py-4 px-6">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide inline-block ${statusBadge}">
          ${cust.status}
        </span>
      </td>
      <td class="py-4 px-6 text-right space-x-1">
        <button onclick="openCustomerModal('${cust.id}')" class="px-2 py-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold transition">Edit</button>
        <button onclick="deleteCustomer('${cust.id}')" class="px-2 py-1 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 4. Incident Log Table
function renderIncidentsTable() {
  const tbody = document.getElementById('incidents-tbody');
  tbody.innerHTML = '';

  if (appState.incidents.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400 font-medium">No diagnostic mechanical incidents found.</td></tr>`;
    return;
  }

  appState.incidents.forEach(inc => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/50 transition-all';

    let badgeColor = "bg-slate-100 text-slate-700";
    if (inc.status === 'Processing') badgeColor = "bg-blue-100 text-blue-700";
    if (inc.status === 'Under Review') badgeColor = "bg-amber-100 text-amber-700";
    if (inc.status === 'Closed') badgeColor = "bg-emerald-100 text-emerald-700";

    tr.innerHTML = `
      <td class="py-4 px-6 font-mono font-bold text-slate-700">${inc.id}</td>
      <td class="py-4 px-6">
        <div class="font-semibold text-slate-800">${inc.description}</div>
      </td>
      <td class="py-4 px-6 font-mono text-slate-500">${inc.vehiclePlate}</td>
      <td class="py-4 px-6 text-slate-400 font-mono">${inc.date || '---'}</td>
      <td class="py-4 px-6">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide inline-block ${badgeColor}">
          ${inc.status}
        </span>
      </td>
      <td class="py-4 px-6 text-right">
        <div class="inline-flex gap-1">
          <button onclick="updateIncidentStatus('${inc.id}', 'Under Review')" class="px-2 py-1 text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/50 rounded font-semibold transition-all">Review</button>
          <button onclick="updateIncidentStatus('${inc.id}', 'Processing')" class="px-2 py-1 text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/50 rounded font-semibold transition-all">Process</button>
          <button onclick="updateIncidentStatus('${inc.id}', 'Closed')" class="px-2 py-1 text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 rounded font-semibold transition-all">Close</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 5. Fleet Grid Cards
function renderFleetGrid() {
  const container = document.getElementById('fleet-container');
  container.innerHTML = '';

  if (appState.vehicles.length === 0) {
    container.innerHTML = `<div class="col-span-full border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm font-medium">No telemetry registered vehicles. Click Bind to configure a device.</div>`;
    return;
  }

  appState.vehicles.forEach(vehicle => {
    const card = document.createElement('div');
    card.className = "bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between";

    let sBadge = "bg-slate-100 text-slate-600";
    if (vehicle.status === 'Bound') sBadge = "bg-emerald-100 text-emerald-700";
    if (vehicle.status === 'Exp. soon') sBadge = "bg-amber-100 text-amber-700";

    card.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-bold font-mono tracking-tight text-slate-800">
            ${vehicle.icon || '🚗'} ${vehicle.plate}
          </span>
          <span class="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${sBadge}">
            ${vehicle.status}
          </span>
        </div>

        <div>
          <h4 class="font-bold text-slate-850 text-xs">${vehicle.model}</h4>
          <div class="mt-2 space-y-1 text-[10px] font-mono text-slate-450">
            <div>Reg. Date: <span class="text-slate-650 font-semibold">${vehicle.registrationDate}</span></div>
            <div>Annual Insp.: <span class="text-slate-650 font-semibold">${vehicle.annualInspection}</span></div>
            <div>Insurance: <span class="text-slate-650 font-semibold">${vehicle.insuranceExpiry}</span></div>
          </div>
        </div>
      </div>

      <div class="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
        <span class="text-slate-400 font-medium">Plan: <span class="text-slate-700 font-semibold">${vehicle.planRemainingMonths || 12} mo. remaining</span></span>
        <button onclick="unbindVehicle('${vehicle.plate}')" class="text-rose-600 font-semibold hover:underline bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded transition-all text-[11px]">Unbind</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// 6. Orders List
function renderOrdersTable() {
  const tbody = document.getElementById('orders-tbody');
  tbody.innerHTML = '';

  if (appState.orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-400 font-medium">No order operations logs recorded.</td></tr>`;
    return;
  }

  appState.orders.forEach(order => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/50 transition-all';

    let orderBadge = "bg-slate-100 text-slate-700";
    if (order.status === 'Active') orderBadge = "bg-emerald-100 text-emerald-700";
    if (order.status === 'Pending') orderBadge = "bg-amber-100 text-amber-700";
    if (order.status === 'Expired') orderBadge = "bg-slate-200 text-slate-500";

    tr.innerHTML = `
      <td class="py-4 px-6 font-mono font-bold text-slate-700">${order.id}</td>
      <td class="py-4 px-6 font-medium text-slate-800">${order.packageName} Plan Package</td>
      <td class="py-4 px-6 text-center font-mono font-bold text-slate-800">$${order.amount || 0}</td>
      <td class="py-4 px-6 text-center">
        <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide inline-block ${orderBadge}">
          ${order.status}
        </span>
      </td>
      <td class="py-4 px-6 text-right space-x-1">
        <button onclick="updateOrderStatus('${order.id}', 'Active')" class="px-2 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded text-[10px] font-bold border border-emerald-100/50 transition-all">Authorize Plan</button>
        <button onclick="updateOrderStatus('${order.id}', 'Expired')" class="px-2 py-1 bg-slate-100 text-slate-500 hover:bg-slate-250 hover:bg-slate-200 rounded text-[10px] font-bold transition-all">Mark Expired</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Dialog Modal Toggles: PARTS
function openPartModal(partId) {
  const titleEl = document.getElementById('mdl-part-title');
  const idField = document.getElementById('part-id-field');
  const nameField = document.getElementById('part-name-field');
  const modelField = document.getElementById('part-model-field');
  const stockField = document.getElementById('part-stock-field');
  const priceField = document.getElementById('part-price-field');

  if (partId) {
    // Edit Mode
    const part = appState.parts.find(p => p.id === partId);
    if (!part) return;

    titleEl.textContent = currentLang === 'en' ? 'Edit Catalog Product' : 'Ehtiyot qismini o‘zgartirish';
    idField.value = partId;
    nameField.value = part.name;
    modelField.value = part.model;
    stockField.value = part.stock;
    priceField.value = part.price;
  } else {
    // Add Mode
    titleEl.textContent = currentLang === 'en' ? 'Add New Catalog Part' : 'Yangi ehtiyot qismini yaratish';
    idField.value = '';
    nameField.value = '';
    modelField.value = '';
    stockField.value = '10';
    priceField.value = '35';
  }

  document.getElementById('modal-part').classList.remove('hidden');
}

function closePartModal() {
  document.getElementById('modal-part').classList.add('hidden');
}

async function savePartForm() {
  const id = document.getElementById('part-id-field').value;
  const name = document.getElementById('part-name-field').value;
  const model = document.getElementById('part-model-field').value;
  const stock = parseInt(document.getElementById('part-stock-field').value) || 0;
  const price = parseFloat(document.getElementById('part-price-field').value) || 0;

  if (!name || !model) {
    triggerToast('Please complete name and compatible model fields', 'error');
    return;
  }

  try {
    let url = '/api/parts';
    let method = 'POST';
    if (id) {
      url = `/api/parts/${id}`;
      method = 'PUT';
    }

    const payload = { name, model, stock, price };
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Action rejected');

    triggerToast(id ? 'Product updated successfully' : 'Product successfully added', 'success');
    closePartModal();
    syncAllData();
  } catch (error) {
    triggerToast('Fail to commit product entity modifications', 'error');
  }
}

async function deletePart(partId) {
  if (!confirm(currentLang === 'en' ? 'Are you sure you want to delete this catalog part?' : 'Haqiqatan ham ushbu ehtiyot qismini o‘chirmoqchimisiz?')) return;
  try {
    const res = await fetch(`/api/parts/${partId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    triggerToast('Product deleted from index registry', 'success');
    syncAllData();
  } catch (err) {
    triggerToast('Could not delete product', 'error');
  }
}

// Dialog Modal Toggles: CUSTOMERS
function openCustomerModal(customerId) {
  const titleEl = document.getElementById('mdl-customer-title');
  const idField = document.getElementById('customer-id-field');
  const nameField = document.getElementById('customer-name-field');
  const tierField = document.getElementById('customer-tier-field');
  const statusField = document.getElementById('customer-status-field');
  const ordersField = document.getElementById('customer-orders-field');

  if (customerId) {
    const cust = appState.customers.find(c => c.id === customerId);
    if (!cust) return;

    titleEl.textContent = currentLang === 'en' ? 'Edit Customer Account' : 'Mijoz ma’lumotlarini tahrirlash';
    idField.value = customerId;
    nameField.value = cust.name;
    tierField.value = cust.tier;
    statusField.value = cust.status;
    ordersField.value = cust.orders || 0;
  } else {
    titleEl.textContent = currentLang === 'en' ? 'Add New Customer Account' : 'Yangi mijoz qaydnomasini qo‘shish';
    idField.value = '';
    nameField.value = '';
    tierField.value = 'Basic';
    statusField.value = 'Active';
    ordersField.value = '0';
  }

  document.getElementById('modal-customer').classList.remove('hidden');
}

function closeCustomerModal() {
  document.getElementById('modal-customer').classList.add('hidden');
}

async function saveCustomerForm() {
  const id = document.getElementById('customer-id-field').value;
  const name = document.getElementById('customer-name-field').value;
  const tier = document.getElementById('customer-tier-field').value;
  const status = document.getElementById('customer-status-field').value;
  const ordersCount = parseInt(document.getElementById('customer-orders-field').value) || 0;

  if (!name) {
    triggerToast('Full customer name value is required', 'error');
    return;
  }

  try {
    let url = '/api/customers';
    let method = 'POST';
    if (id) {
      url = `/api/customers/${id}`;
      method = 'PUT';
    }

    const payload = { name, tier, status, orders: ordersCount };
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method,
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error();

    triggerToast(id ? 'Client profiles synchronized' : 'Client created successfully', 'success');
    closeCustomerModal();
    syncAllData();
  } catch (e) {
    triggerToast('Customer mutation transaction rejected', 'error');
  }
}

async function deleteCustomer(id) {
  if (!confirm(currentLang === 'en' ? 'Sure you want to delete this customer account?' : 'Mijozni o‘chirib yuborishni tasdiqlaysizmi?')) return;
  try {
    const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    triggerToast('Customer erased cleanly', 'success');
    syncAllData();
  } catch (err) {
    triggerToast('Fails delete customer database profile', 'error');
  }
}

// Dialog Modal Toggles: VEHICLE BIND
function openBindVehicleModal() {
  document.getElementById('veh-plate-field').value = '';
  document.getElementById('veh-model-field').value = '';
  document.getElementById('veh-icon-field').value = '🚗';
  document.getElementById('modal-bind-vehicle').classList.remove('hidden');
}

function closeBindVehicleModal() {
  document.getElementById('modal-bind-vehicle').classList.add('hidden');
}

async function saveVehicleForm() {
  const plate = document.getElementById('veh-plate-field').value;
  const model = document.getElementById('veh-model-field').value;
  const icon = document.getElementById('veh-icon-field').value || '🚗';

  if (!plate || !model) {
    triggerToast('Complete both plate and make/vin fields', 'error');
    return;
  }

  try {
    const res = await fetch('/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plate, model, icon })
    });

    if (!res.ok) throw new Error();

    triggerToast('Telemetry device locked & bound', 'success');
    closeBindVehicleModal();
    syncAllData();
  } catch (e) {
    triggerToast('Could not link vehicle', 'error');
  }
}

async function unbindVehicle(plate) {
  if (!confirm(currentLang === 'en' ? `Deregister telemetry from vehicle ${plate}?` : `Nosozlik moslamasini ${plate} transportdan uzasizmi?`)) return;
  try {
    const res = await fetch(`/api/vehicles/${plate}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    triggerToast('Telemetry decoupled', 'success');
    syncAllData();
  } catch (e) {
    triggerToast('Failed deregistering hardware link', 'error');
  }
}

// Dialog Modal Toggles: INCIDENTS
function openIncidentModal() {
  const select = document.getElementById('inc-plate-select');
  select.innerHTML = '';
  
  if (appState.vehicles.length === 0) {
    triggerToast('No vehicles available. Bind a vehicle first.', 'error');
    return;
  }

  appState.vehicles.forEach(veh => {
    const opt = document.createElement('option');
    opt.value = veh.plate;
    opt.textContent = `${veh.plate} (${veh.model.split(' · ')[0]})`;
    select.appendChild(opt);
  });

  document.getElementById('inc-desc-field').value = '';
  document.getElementById('inc-status-field').value = 'Under Review';
  document.getElementById('modal-incident').classList.remove('hidden');
}

function closeIncidentModal() {
  document.getElementById('modal-incident').classList.add('hidden');
}

async function saveIncidentForm() {
  const description = document.getElementById('inc-desc-field').value;
  const vehiclePlate = document.getElementById('inc-plate-select').value;
  const status = document.getElementById('inc-status-field').value;

  if (!description) {
    triggerToast('Please write incident details description', 'error');
    return;
  }

  try {
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, vehiclePlate, status })
    });

    if (!res.ok) throw new Error();

    triggerToast('Diagnostics logged on server', 'success');
    closeIncidentModal();
    syncAllData();
  } catch (err) {
    triggerToast('Failed creating incident logs', 'error');
  }
}

async function updateIncidentStatus(id, newStatus) {
  try {
    const res = await fetch(`/api/incidents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) throw new Error();
    triggerToast(`Incident status updated to: ${newStatus}`, 'success');
    syncAllData();
  } catch (err) {
    triggerToast('Error updating status incident', 'error');
  }
}

// Withdraw Money Transaction
async function handleWithdrawFunds() {
  const input = document.getElementById('input-withdraw-amount');
  const amount = parseFloat(input.value);

  if (isNaN(amount) || amount <= 0) {
    triggerToast('Specify a valid withdraw amount', 'error');
    return;
  }

  if (amount > appState.walletAvailable) {
    triggerToast(`Withdraw amount exceeds available balance ($${appState.walletAvailable})`, 'error');
    return;
  }

  try {
    const res = await fetch('/api/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Withdraw failed');
    }

    triggerToast(`Successfully processed withdrawal of $${amount.toLocaleString()}`, 'success');
    input.value = '';
    syncAllData();
  } catch (error) {
    triggerToast(error.message || 'Server withdrawal transaction rejected', 'error');
  }
}

// Order Status Mutator
async function updateOrderStatus(orderId, status) {
  try {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error();
    triggerToast(`Order subscription level set to ${status}`, 'success');
    syncAllData();
  } catch (e) {
    triggerToast('Order authorization failed', 'error');
  }
}

// Reset data helper
async function promptResetDatabase() {
  if (!confirm(currentLang === 'en' ? 'WIPE ALL CHANGES AND RESET THE SANDBOX?' : 'Barcha o‘zgarishlarni tozalab, ma’lumotlarni qayta tiklashni xohlaysizmi?')) return;
  try {
    const res = await fetch('/api/reset', { method: 'POST' });
    if (!res.ok) throw new Error();
    triggerToast('All test entities restored cleanly', 'success');
    syncAllData();
  } catch (e) {
    triggerToast('Failed to reset database model states', 'error');
  }
}

// Custom Floating Alert Toast Notifications
function triggerToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  let classes = "flex items-center gap-2.5 px-4 py-3 text-xs font-semibold rounded-lg shadow-lg border text-white transform translate-y-4 opacity-0 transition-all duration-300 ";
  let icon = "";
  
  if (type === 'success') {
    classes += "bg-emerald-600 border-emerald-500";
    icon = '<i data-lucide="check-circle" class="w-4 h-4 text-emerald-100 shrink-0"></i>';
  } else {
    classes += "bg-rose-600 border-rose-500";
    icon = '<i data-lucide="alert-triangle" class="w-4 h-4 text-rose-100 shrink-0"></i>';
  }

  toast.className = classes;
  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);
  
  // Re-trigger icon rendering
  lucide.createIcons();

  // Trigger entering animation
  setTimeout(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  }, 50);

  // Auto clean-up
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('-translate-y-4', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}
