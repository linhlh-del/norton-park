/**
 * Build thử mọi domain trên máy dev (không đụng symlink như release.mjs):
 *   npm run build:sites                         → dist-sites/<domain>/ cho mọi domain trong sites/
 *   npm run build:sites -- canho-nortonpark.vn      → chỉ domain được nêu
 * Nội dung CMS, font, ảnh chuẩn bị một lần (SKIP_CMS=1 để dùng lại bản đã có).
 */
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildSite, listSites, loadProductionEnv, prepare, readSiteEnv } from './sites.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
loadProductionEnv(root)
const args = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const sites = args.length ? args : listSites(root)
for (const s of sites) readSiteEnv(root, s)

if (process.env.SKIP_CMS !== '1') prepare(root)
for (const site of sites) {
  console.log(`\n=== ${site} ===`)
  try {
    buildSite(root, site, join(root, 'dist-sites', site))
  } catch (e) {
    console.error(`[build-sites] ${site}: ${e.message}`)
    process.exit(1)
  }
}
console.log(`\nĐã build ${sites.length} domain vào dist-sites/: ${sites.join(', ')}`)
