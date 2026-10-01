--- src/api.ts (原始)


+++ src/api.ts (修改后)
import { CarRecord } from "./data";

// URL вашего Google Apps Script Web App
// Замените на ваш URL после настройки (см. README.md)
const API_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "";

export interface ApiResponse {
  success: boolean;
  data?: CarRecord[];
  error?: string;
}

// Получить все записи из Google Sheets
export async function fetchRecords(): Promise<CarRecord[] | null> {
  if (!API_URL) return null;

  try {
    const response = await fetch(`${API_URL}?action=getAll`);
    if (!response.ok) throw new Error("Network error");
    const result = await response.json();

    if (result.success && result.data) {
      return result.data.map((row: any) => ({
        apartment: String(row.apartment || ""),
        phone1: String(row.phone1 || ""),
        phone2: String(row.phone2 || ""),
        plates: Array.isArray(row.plates) ? row.plates : String(row.plates || "").split(",").map((p: string) => p.trim()).filter(Boolean),
        name: String(row.name || ""),
        dateUpdated: String(row.dateUpdated || ""),
      }));
    }
    return null;
  } catch (error) {
    console.error("Error fetching records:", error);
    return null;
  }
}

// Добавить новую запись
export async function addRecord(record: CarRecord): Promise<boolean> {
  if (!API_URL) return false;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add",
         {
          ...record,
          plates: record.plates.join(", "),
        },
      }),
    });
    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error("Error adding record:", error);
    return false;
  }
}

// Обновить запись (по индексу строки в таблице)
export async function updateRecord(rowIndex: number, record: CarRecord): Promise<boolean> {
  if (!API_URL) return false;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        rowIndex: rowIndex,
         {
          ...record,
          plates: record.plates.join(", "),
        },
      }),
    });
    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error("Error updating record:", error);
    return false;
  }
}

// Удалить запись
export async function deleteRecord(rowIndex: number): Promise<boolean> {
  if (!API_URL) return false;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete",
        rowIndex: rowIndex,
      }),
    });
    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error("Error deleting record:", error);
    return false;
  }
}

// Проверить доступность API
export function isApiConfigured(): boolean {
  return !!API_URL;
}
