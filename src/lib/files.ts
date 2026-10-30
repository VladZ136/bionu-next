import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

/** Проверяет, лежит ли файл в /public (на этапе сборки/рендера на сервере). */
export function publicFileExists(publicPath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', publicPath.replace(/^\//, '')));
  } catch {
    return false;
  }
}
