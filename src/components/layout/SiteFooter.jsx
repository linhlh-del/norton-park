import { Link, useSite, useT } from '@/i18n';
import Wordmark from '@/components/ui/Wordmark';

const linkCls = 'font-sub text-xs font-medium uppercase tracking-[0.14em] text-on-dark no-underline hover:text-on-dark-soft';

export default function SiteFooter() {
  const t = useT();
  const { contact, legalLinks, mainNav } = useSite();
  return (
    <footer id="legal" className="bg-hoadau-deep pb-10 pt-20 text-stone">
      <div className="container-site flex flex-col gap-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <Wordmark size="lg" />
          <nav aria-label={t('nav.footer')} className="flex flex-col gap-3.5">
            {mainNav.map((item) => <Link key={item.to} to={item.to} className={linkCls}>{item.label}</Link>)}
          </nav>
          <div className="flex flex-col gap-2.5 text-sm leading-relaxed">
            <p className="eyebrow text-[10px] text-on-dark-soft">{t('footer.contact')}</p>
            <a href={contact.hotlineHref} className="text-on-dark no-underline hover:underline">{contact.hotline}</a>
            <a href={`mailto:${contact.email}`} className="text-on-dark no-underline hover:underline">{contact.email}</a>
            <span>{contact.address}</span>
          </div>
          <nav aria-label={t('nav.legal')} className="flex flex-col gap-3.5">
            {legalLinks.map((l) => <a key={l} href="#legal" className={linkCls}>{l}</a>)}
          </nav>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-line-dark pt-6 text-[13px] text-[#cdc3ba]">
          <span>© {new Date().getFullYear()} {contact.legalName}</span>
          <span>{contact.legalAddress}</span>
        </div>
      </div>
    </footer>
  );
}
