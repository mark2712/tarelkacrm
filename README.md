# TableCRM — Реактивные таблицы и бизнес-модули

Данный проект представляет собой CRM-систему на **Next.js (App Router)** и **MobX**, использующую компонентно-ориентированную архитектуру динамических таблиц с фильтрацией, обработкой и сохранением пользовательских настроек.

---

## 🛠️ Общая инфраструктура проекта (`src/common`)

Перед созданием бизнес-модулей важно понимать базовые глобальные механизмы, расположенные в [src/common](file:///h:/sites/tarelkacrm/src/common):

```text
src/common/
├── api/
│   ├── ApiUrls.ts            # Глобальный реестр URL эндпоинтов backend
│   ├── ApiClient.ts          # Базовый HTTP-клиент (fetch, авто-обработка заголовков и ошибок)
│   ├── ApiStore.ts           # MobX-стор уровня сети (состояния: data, isLoading, error, reload)
│   └── ErrorBufferStore.ts   # Глобальный буфер ошибок
└── saveData/
    ├── ISaveProvider.ts      # Интерфейс провайдера сохранения настроек
    └── SaveProvider.ts       # Провайдер сохранения состояний (фильтров/колонок) в localStorage
```

---

## 📌 Архитектура бизнес-модуля (на примере `src/components/transfer`)

Все новые бизнес-домены (например, `leads`, `orders`, `transfer`) создаются по единому паттерну:

```text
src/components/<domain_name>/
├── store/
│   ├── <Domain>StoreApi.ts       # 1. Сетевой слой (запрос к API, токен, параметры URL)
│   └── <Domain>TableStore.ts     # 2. Бизнес-логика (нормализация данных, MobX-стор операций)
├── operations/                   # 3. Модульные операции и фильтры таблицы
│   ├── Operation1.tsx            #    (наследуются от Operation<TData, TOptions>)
│   └── Operation2.tsx
└── <Domain>Table/                # 4. Представление таблицы
    ├── columns.ts                #    Конфигурация и порядок колонок
    └── index.tsx                 #    Финальный React-компонент (DataLoader + Operations + Table)
```

---

## 🚀 Пошаговая инструкция для разработчика и ИИ

При создании нового бизнес-модуля (`src/components/<domain_name>`) следует придерживаться 5 последовательных шагов:

### 1. Регистрация эндпоинта и Сетевой стор (`store/<Domain>StoreApi.ts`)
* Зарегистрировать URL апи в [ApiUrls.ts](file:///h:/sites/tarelkacrm/src/common/api/ApiUrls.ts).
* Создать функции получения токена (`getToken`) и параметров из URL (`getUrlDates`).
* Определить тип сырого ответа сервера `TRawData`.
* Инициализировать сетевой стор: `new ApiStore<TRawData[]>(apiUrls.NEW_ENDPOINT, params)`.

### 2. Нормализация и Стор таблицы (`store/<Domain>TableStore.ts`)
* Определить тип распарсенных данных (`TParsedData`) и итоговую плоскую модель строки таблицы (`TDomainItem`).
* Создать класс `<Domain>TableStore`, наследующийся от `OperationsController<TDomainItem>`.
* Добавить реактивную подписку `reaction(() => domainStoreApi.data, ...)` для автоматического парсинга JSON/данных с API при их изменении.
* Передать в супер-конструктор `SaveProvider("<Domain>OperationStore")` для персистентности состояний фильтров в `localStorage`.

### 3. Конфигурация колонок таблицы (`<Domain>Table/columns.ts`)
* Создается экземпляр `TableData` со списком колонок `BaseColumn<TDomainItem, key>`.
* Источником данных указывается результат работы стора: `() => domainTableStore.resultTable`.
* Настройки колонок сохраняются через `SaveProvider("<Domain>TableSettings")`.

### 4. Обертка UI и Монтирование страницы (`<Domain>Table/index.tsx` & `src/app/<domain_name>/page.tsx`)
* Сборка компонентов воедино в `<Domain>Table/index.tsx`:
  * `<DataLoader store={domainStoreApi} />` — загрузка данных.
  * `<Operations operations={domainTableStore.operations} />` — панель фильтров.
  * `<Table table={tableData} />` — таблица.
* Подключение в Next.js App Router (`src/app/<domain_name>/page.tsx`) через **динамический импорт без SSR**:
```tsx
"use client";
import dynamic from 'next/dynamic';

const DomainTable = dynamic(() => import('@/components/<domain_name>/<Domain>Table'), {
  ssr: false,
});

export default function Page() {
  return <DomainTable />;
}
```
* **На этом этапе уже получается полностью работающая и видимая на экране таблица с данными!**

### 5. Разработка фильтров и Операций (`operations/`) — *выполняется в последнюю очередь*
* По мере появления бизнес-требований создаются модули фильтрации/обработки данных в папке `operations/`.
* Каждая операция наследуется от `Operation<TDomainItem, TOptions>`.
* Метод `apply()` выполняет мутацию/фильтрацию массива данных.
* Для настроек фильтра в UI создается React-компонент, обернутый в `observer`.
* Готовые операции регистрируются массивом в конструкторе `<Domain>TableStore`.


---

## ⚠️ Важные соглашения (Conventions for Developers & AI)

1. **Динамический импорт без SSR (`ssr: false`)**: Все страницы таблиц в `src/app/` должны рендерить компонент таблицы через `next/dynamic` с `{ ssr: false }`.
2. **Регистр файлов в `operations/`**: Все файлы компонентов операций должны называться в **PascalCase** (например, `DeleteTestNames.tsx`). Это критично для корректной сборки на Linux/CI.
3. **Реактивность**: Все React-компоненты, читающие MobX-сторы или опции операций, ОБЯЗАТЕЛЬНО должны быть обернуты в `observer` из `mobx-react-lite`.
4. **Обработка ошибок JSON**: При распарсивании сложных полей вроде `all_data` обязательно использовать `try / catch`, чтобы ошибка в одной записи не ломала всю таблицу.
5. **Персистентность**: Ключи в `SaveProvider("UniqueKey")` должны быть уникальными для каждого модуля, чтобы настройки не перетирали друг друга.


