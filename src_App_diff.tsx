--- src/App.tsx (原始)
import { useState, useMemo } from "react";
import { records, CarRecord } from "./data";

function formatPhone(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("8")) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
  }
  return phone;
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function PlateBadge({ plate }: { plate: string }) {
  return (
    <span className="inline-block bg-white border-2 border-gray-800 rounded px-2 py-0.5 font-mono text-sm font-bold tracking-wider mr-1 mb-1">
      {plate}
    </span>
  );
}

function RecordCard({ record }: { record: CarRecord }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-1 rounded-lg">
            кв. {record.apartment || "—"}
          </span>
          {record.name && (
            <span className="text-gray-700 font-medium text-sm">{record.name}</span>
          )}
        </div>
        <span className="text-xs text-gray-400">{record.dateUpdated}</span>
      </div>

      <div className="flex flex-wrap mb-3">
        {record.plates.map((plate, i) => (
          <PlateBadge key={i} plate={plate} />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
        <a href={`tel:${record.phone1}`} className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors">
          <PhoneIcon />
          <span>{formatPhone(record.phone1)}</span>
        </a>
        {record.phone2 && (
          <a href={`tel:${record.phone2}`} className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors">
            <PhoneIcon />
            <span>{formatPhone(record.phone2)}</span>
          </a>
        )}
      </div>
    </div>
  );
}

function DesktopTable({ filteredRecords }: { filteredRecords: CarRecord[] }) {
  return (
    <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Кв.</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Г/Н</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Имя</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Телефон</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Обновлено</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, idx) => (
            <tr key={idx} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
              <td className="px-4 py-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                  {record.apartment || "—"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {record.plates.map((plate, i) => (
                    <PlateBadge key={i} plate={plate} />
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-700">{record.name || "—"}</td>
              <td className="px-4 py-3">
                <div className="space-y-1">
                  <a href={`tel:${record.phone1}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline">
                    <PhoneIcon />
                    {formatPhone(record.phone1)}
                  </a>
                  {record.phone2 && (
                    <a href={`tel:${record.phone2}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline">
                      <PhoneIcon />
                      {formatPhone(record.phone2)}
                    </a>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">{record.dateUpdated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type SortField = "apartment" | "name" | "dateUpdated";
type SortDir = "asc" | "desc";

export default function App() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("apartment");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [view, setView] = useState<"table" | "cards">("table");

  const filteredRecords = useMemo(() => {
    let result = records;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((r) => {
        return (
          r.apartment.includes(q) ||
          r.plates.some((p) => p.toLowerCase().includes(q)) ||
          r.name.toLowerCase().includes(q) ||
          r.phone1.includes(q) ||
          r.phone2.includes(q)
        );
      });
    }

    result = [...result].sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      if (sortField === "apartment") {
        valA = a.apartment ? parseInt(a.apartment) || 0 : 9999;
        valB = b.apartment ? parseInt(b.apartment) || 0 : 9999;
      } else {
        valA = a[sortField].toLowerCase();
        valB = b[sortField].toLowerCase();
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [search, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const totalCars = records.reduce((acc, r) => acc + r.plates.length, 0);
  const totalApartments = new Set(records.filter(r => r.apartment).map(r => r.apartment)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-xl">
                <CarIcon />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">
                  Сиреневая 31
                </h1>
                <p className="text-xs md:text-sm text-gray-500">Регистр автомобилей жильцов</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                {totalCars} авто
              </span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                {totalApartments} кв.
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Controls */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Поиск по квартире, номеру, имени или телефону..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm md:text-base"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sort Buttons */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-gray-500 mr-1">Сортировка:</span>
              {([
                { field: "apartment" as SortField, label: "Квартира" },
                { field: "name" as SortField, label: "Имя" },
                { field: "dateUpdated" as SortField, label: "Дата" },
              ]).map(({ field, label }) => (
                <button
                  key={field}
                  onClick={() => toggleSort(field)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                    sortField === field
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {label}
                  {sortField === field && (
                    <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="ml-auto flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
              <button
                onClick={() => setView("table")}
                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                  view === "table" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"
                }`}
                title="Таблица"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => setView("cards")}
                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                  view === "cards" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"
                }`}
                title="Карточки"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-500">
            {search ? `Найдено: ${filteredRecords.length} из ${records.length}` : `Всего записей: ${records.length}`}
          </div>
        </div>

        {/* Desktop Table View */}
        {view === "table" && <DesktopTable filteredRecords={filteredRecords} />}

        {/* Mobile Cards View */}
        {view === "cards" && (
          <div className="md:hidden grid gap-3">
            {filteredRecords.map((record, idx) => (
              <RecordCard key={idx} record={record} />
            ))}
          </div>
        )}

        {/* Desktop Cards View (when explicitly selected) */}
        {view === "cards" && (
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.map((record, idx) => (
              <RecordCard key={idx} record={record} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredRecords.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Ничего не найдено</h3>
            <p className="text-gray-500">Попробуйте изменить поисковый запрос</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-gray-400">
          <p>Регистр автомобилей жильцов дома Сиреневая 31</p>
          <p className="mt-1">Для вопросов обращайтесь к старшему по дому</p>
        </div>
      </footer>
    </div>
  );
}


+++ src/App.tsx (修改后)
import { useState, useMemo, useEffect, useCallback } from "react";
import { records as initialRecords, CarRecord } from "./data";
import { fetchRecords, addRecord, updateRecord, deleteRecord, isApiConfigured } from "./api";

function formatPhone(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("8")) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
  }
  return phone;
}

function getTodayDate(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
}

// ====== ICONS ======
function SearchIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

// ====== PLATE BADGE ======
function PlateBadge({ plate }: { plate: string }) {
  return (
    <span className="inline-block bg-white border-2 border-gray-800 rounded px-2 py-0.5 font-mono text-sm font-bold tracking-wider mr-1 mb-1">
      {plate}
    </span>
  );
}

// ====== TOAST NOTIFICATION ======
function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "info"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up`}>
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">✕</button>
    </div>
  );
}

// ====== CONFIRM DIALOG ======
function ConfirmDialog({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onCancel}>
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Отмена
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

// ====== RECORD FORM MODAL ======
function RecordFormModal({
  record,
  isNew,
  onSave,
  onCancel,
}: {
  record: CarRecord;
  isNew: boolean;
  onSave: (record: CarRecord) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<CarRecord>({ ...record });
  const [platesText, setPlatesText] = useState(record.plates.join("\n"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plates = platesText.split("\n").map((p) => p.trim()).filter(Boolean);
    onSave({ ...form, plates });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onCancel}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {isNew ? "➕ Добавить запись" : "✏️ Редактировать запись"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Номер квартиры</label>
            <input
              type="text"
              value={form.apartment}
              onChange={(e) => setForm({ ...form, apartment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Например: 42"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя / Комментарий</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Например: Иван Иванов"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Гос. номера (каждый с новой строки)</label>
            <textarea
              value={platesText}
              onChange={(e) => setPlatesText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              placeholder={"А 123 ВС 154\nЕ 456 ОР 54"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон 1</label>
            <input
              type="tel"
              value={form.phone1}
              onChange={(e) => setForm({ ...form, phone1: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="89991234567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон 2 (необязательно)</label>
            <input
              type="tel"
              value={form.phone2}
              onChange={(e) => setForm({ ...form, phone2: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="89997654321"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дата обновления</label>
            <input
              type="text"
              value={form.dateUpdated}
              onChange={(e) => setForm({ ...form, dateUpdated: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="ДД.ММ.ГГ"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Отмена
            </button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              {isNew ? "Добавить" : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ====== RECORD CARD (Mobile) ======
function RecordCard({
  record,
  onEdit,
  onDelete,
}: {
  record: CarRecord;
  onEdit: (r: CarRecord) => void;
  onDelete: (r: CarRecord) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-1 rounded-lg">
            кв. {record.apartment || "—"}
          </span>
          {record.name && (
            <span className="text-gray-700 font-medium text-sm">{record.name}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(record)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Редактировать">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => onDelete(record)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Удалить">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-wrap mb-3">
        {record.plates.map((plate, i) => (
          <PlateBadge key={i} plate={plate} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
        <a href={`tel:${record.phone1}`} className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors">
          <PhoneIcon />
          <span>{formatPhone(record.phone1)}</span>
        </a>
        {record.phone2 && (
          <a href={`tel:${record.phone2}`} className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors">
            <PhoneIcon />
            <span>{formatPhone(record.phone2)}</span>
          </a>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-400">Обновлено: {record.dateUpdated}</div>
    </div>
  );
}

// ====== DESKTOP TABLE ======
function DesktopTable({
  filteredRecords,
  onEdit,
  onDelete,
}: {
  filteredRecords: CarRecord[];
  onEdit: (r: CarRecord) => void;
  onDelete: (r: CarRecord) => void;
}) {
  return (
    <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Кв.</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Г/Н</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Имя</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Телефон</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Обновлено</th>
            <th className="text-center px-4 py-3 font-semibold text-gray-600 w-24">Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, idx) => (
            <tr key={idx} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
              <td className="px-4 py-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                  {record.apartment || "—"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {record.plates.map((plate, i) => (
                    <PlateBadge key={i} plate={plate} />
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-700">{record.name || "—"}</td>
              <td className="px-4 py-3">
                <div className="space-y-1">
                  <a href={`tel:${record.phone1}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline">
                    <PhoneIcon />
                    {formatPhone(record.phone1)}
                  </a>
                  {record.phone2 && (
                    <a href={`tel:${record.phone2}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline">
                      <PhoneIcon />
                      {formatPhone(record.phone2)}
                    </a>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">{record.dateUpdated}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                  <button onClick={() => onEdit(record)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Редактировать">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => onDelete(record)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Удалить">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ====== SETTINGS MODAL ======
function SettingsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">⚙️ Настройка подключения к Google Sheets</h3>
        <div className="space-y-4 text-sm text-gray-600">
          <p>Для работы с Google Sheets необходимо:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Открыть вашу Google таблицу</li>
            <li>Перейти в <strong>Расширения → Apps Script</strong></li>
            <li>Вставить код из файла <code className="bg-gray-100 px-1 rounded">google-apps-script.js</code> (в корне проекта)</li>
            <li>Нажать <strong>Deploy → New deployment</strong></li>
            <li>Выбрать тип <strong>Web app</strong></li>
            <li>Установить <strong>Execute as: Me</strong> и <strong>Who has access: Anyone</strong></li>
            <li>Скопировать URL веб-приложения</li>
            <li>Создать файл <code className="bg-gray-100 px-1 rounded">.env</code> в корне проекта и добавить:
              <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-x-auto">VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/ВАШ_ID/exec</pre>
            </li>
            <li>Пересобрать проект: <code className="bg-gray-100 px-1 rounded">npm run build</code></li>
          </ol>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <p className="text-yellow-800 font-medium">⚠️ Важно:</p>
            <p className="text-yellow-700 mt-1">Без настройки API данные сохраняются только в браузере (localStorage). При подключении API данные синхронизируются с Google Sheets.</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

// ====== MAIN APP ======
type SortField = "apartment" | "name" | "dateUpdated";
type SortDir = "asc" | "desc";

export default function App() {
  const [allRecords, setAllRecords] = useState<CarRecord[]>(initialRecords);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("apartment");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [view, setView] = useState<"table" | "cards">("table");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [editingRecord, setEditingRecord] = useState<CarRecord | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<CarRecord | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  // Load data from Google Sheets on mount
  useEffect(() => {
    const loadData = async () => {
      if (isApiConfigured()) {
        try {
          const data = await fetchRecords();
          if (data) {
            setAllRecords(data);
            setApiConnected(true);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter and sort
  const filteredRecords = useMemo(() => {
    let result = allRecords;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((r) => {
        return (
          r.apartment.toLowerCase().includes(q) ||
          r.plates.some((p) => p.toLowerCase().includes(q)) ||
          r.name.toLowerCase().includes(q) ||
          r.phone1.replace(/\D/g, "").includes(q.replace(/\D/g, "")) ||
          r.phone2.replace(/\D/g, "").includes(q.replace(/\D/g, ""))
        );
      });
    }

    result = [...result].sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      if (sortField === "apartment") {
        valA = a.apartment ? parseInt(a.apartment) || 9999 : 9999;
        valB = b.apartment ? parseInt(b.apartment) || 9999 : 9999;
      } else {
        valA = a[sortField].toLowerCase();
        valB = b[sortField].toLowerCase();
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [search, sortField, sortDir, allRecords]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleAdd = () => {
    const newRecord: CarRecord = {
      apartment: "",
      phone1: "",
      phone2: "",
      plates: [],
      name: "",
      dateUpdated: getTodayDate(),
    };
    setEditingRecord(newRecord);
    setIsNewRecord(true);
  };

  const handleEdit = (record: CarRecord) => {
    setEditingRecord({ ...record });
    setIsNewRecord(false);
  };

  const handleSave = async (record: CarRecord) => {
    if (isNewRecord) {
      if (apiConnected) {
        const success = await addRecord(record);
        if (success) {
          const data = await fetchRecords();
          if (data) setAllRecords(data);
          setToast({ message: "Запись добавлена", type: "success" });
        } else {
          // Fallback to local
          const newRecord = { ...record, rowIndex: allRecords.length + 2 };
          setAllRecords([...allRecords, newRecord]);
          setToast({ message: "Добавлено (локально, API недоступен)", type: "info" });
        }
      } else {
        const newRecord = { ...record, rowIndex: allRecords.length + 2 };
        setAllRecords([...allRecords, newRecord]);
        setToast({ message: "Запись добавлена (локально)", type: "info" });
      }
    } else {
      if (apiConnected && record.rowIndex) {
        const success = await updateRecord(record.rowIndex, record);
        if (success) {
          const data = await fetchRecords();
          if (data) setAllRecords(data);
          setToast({ message: "Запись обновлена", type: "success" });
        } else {
          setAllRecords(allRecords.map((r) => (r.rowIndex === record.rowIndex ? record : r)));
          setToast({ message: "Обновлено (локально, API недоступен)", type: "info" });
        }
      } else {
        setAllRecords(allRecords.map((r) => (r.rowIndex === record.rowIndex ? record : r)));
        setToast({ message: "Запись обновлена (локально)", type: "info" });
      }
    }
    setEditingRecord(null);
    setIsNewRecord(false);
  };

  const handleDelete = async (record: CarRecord) => {
    if (apiConnected && record.rowIndex) {
      const success = await deleteRecord(record.rowIndex);
      if (success) {
        const data = await fetchRecords();
        if (data) setAllRecords(data);
        setToast({ message: "Запись удалена", type: "success" });
      } else {
        setAllRecords(allRecords.filter((r) => r.rowIndex !== record.rowIndex));
        setToast({ message: "Удалено (локально, API недоступен)", type: "info" });
      }
    } else {
      setAllRecords(allRecords.filter((r) => r.rowIndex !== record.rowIndex));
      setToast({ message: "Запись удалена (локально)", type: "info" });
    }
    setDeleteConfirm(null);
  };

  const totalCars = allRecords.reduce((acc, r) => acc + r.plates.length, 0);
  const totalApartments = new Set(allRecords.filter((r) => r.apartment).map((r) => r.apartment)).size;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-xl">
                <CarIcon />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Сиреневая 31</h1>
                <p className="text-xs md:text-sm text-gray-500">Регистр автомобилей жильцов</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-3 text-sm text-gray-500">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">{totalCars} авто</span>
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">{totalApartments} кв.</span>
              </div>
              <div className="flex items-center gap-1">
                {apiConnected && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full hidden sm:inline">🟢 Google Sheets</span>
                )}
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Настройки"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-4 md:py-6">
        {/* Search and Controls */}
        <div className="mb-4 md:mb-6 space-y-3 md:space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Поиск по квартире, номеру, имени или телефону..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm md:text-base"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-gray-500 mr-1">Сортировка:</span>
              {([
                { field: "apartment" as SortField, label: "Квартира" },
                { field: "name" as SortField, label: "Имя" },
                { field: "dateUpdated" as SortField, label: "Дата" },
              ]).map(({ field, label }) => (
                <button
                  key={field}
                  onClick={() => toggleSort(field)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                    sortField === field ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {label}
                  {sortField === field && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
                <button
                  onClick={() => setView("table")}
                  className={`px-2.5 py-1.5 text-xs rounded-md font-medium transition-colors ${view === "table" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
                  title="Таблица"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setView("cards")}
                  className={`px-2.5 py-1.5 text-xs rounded-md font-medium transition-colors ${view === "cards" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
                  title="Карточки"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAdd}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 text-xs rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Добавить</span>
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-500">
            {search ? `Найдено: ${filteredRecords.length} из ${allRecords.length}` : `Всего записей: ${allRecords.length}`}
            {!apiConnected && <span className="ml-2 text-amber-500">⚠️ Режим без подключения к Google Sheets</span>}
          </div>
        </div>

        {/* Desktop Table View */}
        {view === "table" && <DesktopTable filteredRecords={filteredRecords} onEdit={handleEdit} onDelete={(r) => setDeleteConfirm(r)} />}

        {/* Cards View */}
        {view === "cards" && (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecords.map((record, idx) => (
              <RecordCard key={idx} record={record} onEdit={handleEdit} onDelete={(r) => setDeleteConfirm(r)} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredRecords.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Ничего не найдено</h3>
            <p className="text-gray-500">Попробуйте изменить поисковый запрос</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-gray-400">
          <p>Регистр автомобилей жильцов дома Сиреневая 31</p>
          <p className="mt-1">Данные хранятся в Google Sheets</p>
        </div>
      </footer>

      {/* Modals */}
      {editingRecord && (
        <RecordFormModal
          record={editingRecord}
          isNew={isNewRecord}
          onSave={handleSave}
          onCancel={() => { setEditingRecord(null); setIsNewRecord(false); }}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          title="Удалить запись?"
          message={`Кв. ${deleteConfirm.apartment || "—"}, ${deleteConfirm.plates.join(", ")}. Это действие нельзя отменить.`}
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
