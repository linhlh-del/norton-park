export default function Location() {
  return (
    <section id="location" className="bg-sand pb-16 pt-section">
      <div className="container-site grid items-end gap-[clamp(2rem,6vw,6rem)] lg:grid-cols-2">
        <div data-reveal="left" className="flex flex-col gap-5">
          <p className="eyebrow text-walnut">Trung tâm của mọi kết nối</p>
          <h2 className="heading-2">Toạ độ tinh chọn của cộng đồng chuyên gia</h2>
        </div>
        <div data-reveal="right" style={{ '--reveal-i': 1 }} className="flex flex-col gap-4">
          <p className="lead">Nằm trên trục Đại lộ Bình Dương (Quốc lộ 13), Norton Park có vị trí khó lặp lại: giữa một hệ sinh thái đã trưởng thành và những động lực phát triển mới.</p>
          <p className="lead">Nhu cầu thực tích luỹ qua nhiều thập kỷ cùng hạ tầng kết nối đang mở rộng tạo nền cho một chuẩn sống mới của khu vực.</p>
        </div>
      </div>
    </section>
  );
}
