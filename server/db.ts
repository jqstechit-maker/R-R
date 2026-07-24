import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// MySQL Configuration default values provided by user for Hostinger
export let mysqlConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "u609303672_rrplanejado",
  password: process.env.MYSQL_PASSWORD || "Gavioes@2026",
  database: process.env.MYSQL_DATABASE || "u609303672_rrplanejado",
  port: Number(process.env.MYSQL_PORT) || 3306,
  connectTimeout: 5000
};

let pool: mysql.Pool | null = null;
let lastDbError: string | null = null;
let isConnected = false;

// Memory cache fallback when MySQL is unreachable or offline
const memorySettingsCache: Record<string, string> = {};

export function updateMysqlConfig(newConfig: Partial<typeof mysqlConfig>) {
  mysqlConfig = { ...mysqlConfig, ...newConfig };
  if (pool) {
    pool.end().catch(() => {});
    pool = null;
  }
  return initDb();
}

export async function getPool(): Promise<mysql.Pool | null> {
  if (!pool) {
    try {
      pool = mysql.createPool({
        ...mysqlConfig,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    } catch (err: any) {
      lastDbError = err.message || "Erro ao criar pool MySQL";
      console.warn("⚠️ MySQL Pool warning:", lastDbError);
      return null;
    }
  }
  return pool;
}

export async function initDb(): Promise<{ success: boolean; message: string }> {
  try {
    const currentPool = await getPool();
    if (!currentPool) {
      isConnected = false;
      return { success: false, message: lastDbError || "Não foi possível criar pool de conexão MySQL." };
    }

    const conn = await currentPool.getConnection();
    
    // Create site_settings table if it doesn't exist
    await conn.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create contact_messages table if it doesn't exist
    await conn.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        interest VARCHAR(255),
        message TEXT,
        created_at VARCHAR(100)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    conn.release();
    isConnected = true;
    lastDbError = null;
    console.log("✅ Conexão e tabelas MySQL Hostinger inicializadas com sucesso!");
    return { success: true, message: "Banco de dados MySQL Hostinger conectado e sincronizado com sucesso!" };
  } catch (err: any) {
    isConnected = false;
    lastDbError = err.message || "Erro de conexão MySQL";
    console.warn("⚠️ Aviso de conexão MySQL Hostinger:", lastDbError);
    return { 
      success: false, 
      message: `Aviso MySQL (${mysqlConfig.host}): ${lastDbError}. O site continuará funcionando perfeitamente em modo de cache de segurança.` 
    };
  }
}

export async function getDbStatus() {
  // Test connection
  try {
    const currentPool = await getPool();
    if (currentPool) {
      const conn = await currentPool.getConnection();
      await conn.ping();
      conn.release();
      isConnected = true;
      lastDbError = null;
    }
  } catch (err: any) {
    isConnected = false;
    lastDbError = err.message || "Conexão indisponível";
  }

  return {
    connected: isConnected,
    host: mysqlConfig.host,
    user: mysqlConfig.user,
    database: mysqlConfig.database,
    port: mysqlConfig.port,
    error: lastDbError,
    hint: !isConnected && mysqlConfig.host === "localhost" 
      ? "Dica: Se o banco MySQL está na Hostinger e você está rodando o site remotamente, certifique-se de configurar o IP/Host remoto da Hostinger e liberar o acesso MySQL Remoto no painel hPanel da Hostinger."
      : null
  };
}

export async function getAllSettings(): Promise<Record<string, any>> {
  try {
    const currentPool = await getPool();
    if (currentPool && isConnected) {
      const [rows]: any = await currentPool.query(`SELECT setting_key, setting_value FROM site_settings`);
      const result: Record<string, any> = {};
      for (const row of rows) {
        try {
          result[row.setting_key] = JSON.parse(row.setting_value);
        } catch {
          result[row.setting_key] = row.setting_value;
        }
      }
      // Update memory cache
      for (const k in result) {
        memorySettingsCache[k] = typeof result[k] === "string" ? result[k] : JSON.stringify(result[k]);
      }
      return result;
    }
  } catch (err: any) {
    console.warn("⚠️ Falha ao buscar configurações do MySQL, usando cache local:", err.message);
  }

  // Return fallback from memory cache if available
  const fallbackResult: Record<string, any> = {};
  for (const k in memorySettingsCache) {
    try {
      fallbackResult[k] = JSON.parse(memorySettingsCache[k]);
    } catch {
      fallbackResult[k] = memorySettingsCache[k];
    }
  }
  return fallbackResult;
}

export async function saveSetting(key: string, value: any): Promise<boolean> {
  const serialized = typeof value === "string" ? value : JSON.stringify(value);
  memorySettingsCache[key] = serialized;

  try {
    const currentPool = await getPool();
    if (currentPool) {
      await currentPool.query(
        `INSERT INTO site_settings (setting_key, setting_value) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, serialized]
      );
      console.log(`💾 Configuração '${key}' salva com sucesso no MySQL Hostinger!`);
      return true;
    }
  } catch (err: any) {
    console.warn(`⚠️ Não foi possível gravar '${key}' no MySQL (salvo em cache local):`, err.message);
  }
  return false;
}

export async function saveSettingsBatch(settings: Record<string, any>): Promise<boolean> {
  let allSuccess = true;
  for (const [key, val] of Object.entries(settings)) {
    const ok = await saveSetting(key, val);
    if (!ok) allSuccess = false;
  }
  return allSuccess;
}

export async function saveContactMessageToDb(msg: {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  createdAt: string;
}) {
  try {
    const currentPool = await getPool();
    if (currentPool) {
      await currentPool.query(
        `INSERT INTO contact_messages (id, name, email, phone, interest, message, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [msg.id, msg.name, msg.email, msg.phone, msg.interest, msg.message, msg.createdAt]
      );
      console.log(`✉️ Mensagem de contato ${msg.id} gravada no MySQL Hostinger.`);
      return true;
    }
  } catch (err: any) {
    console.warn("⚠️ Não foi possível salvar mensagem no MySQL:", err.message);
  }
  return false;
}
