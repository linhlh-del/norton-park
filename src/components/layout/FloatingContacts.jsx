import { contact } from '@/data/site';
import { ChatIcon, PhoneIcon } from '@/components/ui/Icons';
import { useContactPopup } from '@/components/popup/ContactPopup';

export default function FloatingContacts() {
  const popup = useContactPopup();
  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2.5">
      <a href={contact.hotlineHref} aria-label={`Gọi hotline ${contact.hotline}`} className="grid size-13 place-items-center rounded-full bg-bronze-deep text-ivory shadow-float hover:bg-hoadau hover:text-ivory">
        <PhoneIcon />
      </a>
      <button type="button" onClick={() => popup.open('floating')} aria-label="Nhận tư vấn ngay"
        className="grid size-13 cursor-pointer place-items-center rounded-full border-0 bg-pine text-ivory shadow-float hover:bg-pine-deep">
        <ChatIcon />
      </button>
    </div>
  );
}
