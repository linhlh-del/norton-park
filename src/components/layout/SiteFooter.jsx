import { Link, useLang, useSite, useT } from '@/i18n';
import Wordmark from '@/components/ui/Wordmark';
import { pageMeta, pages, topicPaths } from '@/seo/site-meta';
import { isFilled } from '@/lib/filled';

const linkCls = 'font-sub text-xs font-medium uppercase tracking-[0.14em] text-on-dark no-underline hover:text-on-dark-soft';

export default function SiteFooter() {
  const t = useT();
  const { contact, legalLinks, mainNav } = useSite();
  const lang = useLang();
  return (
    <footer id="legal" className="bg-hoadau-deep pb-10 pt-[clamp(3rem,8svh,5rem)] text-stone">
      <div className="container-site flex flex-col gap-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <Wordmark size="lg" />
          <nav aria-label={t('nav.footer')} className="flex flex-col gap-3.5">
            {mainNav.map((item) => <Link key={item.to} to={item.to} className={linkCls}>{item.label}</Link>)}
            {/* trang con theo chủ đề — liên kết nội bộ cho SEO */}
            {topicPaths.map((p) => <Link key={p} to={p} className={linkCls}>{pageMeta(pages[p], lang).breadcrumb} Norton Park</Link>)}
          </nav>
          <div className="flex flex-col gap-2.5 text-sm leading-relaxed">
            <p className="eyebrow text-xs text-on-dark-soft">{t('footer.contact')}</p>
            <a href={contact.hotlineHref} className="text-on-dark no-underline hover:underline">{contact.hotline}</a>
            <a href={`mailto:${contact.email}`} className="text-on-dark no-underline hover:underline">{contact.email}</a>
            <span>{contact.address}</span>
          </div>
          <nav aria-label={t('nav.legal')} className="flex flex-col gap-3.5">
            {legalLinks.map((l) => <a key={l} href="#legal" className={linkCls}>{l}</a>)}
          </nav>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-line-dark pt-6 text-[13px] text-[#cdc3ba]">
          {/* tên / địa chỉ pháp nhân: điền trong CMS (Thông tin chung). Chưa có thì không hiện chỗ trống "[...]" */}
          <span>© {new Date().getFullYear()} {isFilled(contact.legalName) ? contact.legalName : 'Norton Park — A Gamuda Land Community'}</span>
          {isFilled(contact.legalAddress) && <span>{contact.legalAddress}</span>}
        </div>
      </div>
    </footer>
  );
}
