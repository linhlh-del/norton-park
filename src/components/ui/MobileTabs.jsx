import { useId } from 'react';

/**
 * Tab chia đôi chỉ dùng trên điện thoại (< 768px) — thay cho dải trượt ngang khi có 2–3 khối nội dung ngang hàng
 * (vd. 2 bộ sưu tập, 2 phân khu): người dùng thấy ngay có mấy khối và bấm để chuyển, không có gì bị che ở mép màn.
 * Từ 768px tab ẩn, mọi khối hiện cạnh nhau như bình thường.
 *   const [i, setI] = useState(0);
 *   <MobileTabs label="…" tabs={['A', 'B']} active={i} onChange={setI} idPrefix={id} />
 *   <div id={`${id}-0`} className={panelClass(0, i)}>…</div>
 */
export default function MobileTabs({ label, tabs, active, onChange, idPrefix }) {
  return (
    <div role="tablist" aria-label={label} className="grid gap-1 rounded-full bg-hoadau/[0.06] p-1 md:hidden"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
      {tabs.map((tab, i) => (
        <button key={tab} type="button" role="tab" aria-selected={i === active} aria-controls={`${idPrefix}-${i}`}
          onClick={() => onChange(i)}
          className={`min-h-11 cursor-pointer rounded-full border-0 px-3 font-sub text-xs font-semibold uppercase leading-tight tracking-[0.1em] transition-colors ${i === active ? 'bg-hoadau text-on-dark shadow-float' : 'bg-transparent text-hoadau'}`}>
          {tab}
        </button>
      ))}
    </div>
  );
}

/** class cho khối nội dung thứ i: trên điện thoại chỉ hiện khối đang chọn */
export const panelClass = (i, active) => (i === active ? '' : 'max-md:hidden');

export const useTabsId = () => useId().replace(/:/g, '');
