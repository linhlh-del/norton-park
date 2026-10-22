import { images } from '@/data/site';
import StoryBackdrop from './StoryBackdrop';

export default function LandscapeStory() {
  return (
    <StoryBackdrop
      id="landscape-story"
      align="right"
      image={images.landscapeStory}
      imageAlt="Cảnh quan rừng Miyawaki trong khuôn viên Norton Park"
      imageLabel="Ảnh nền: cảnh quan rừng Miyawaki"
      eyebrow="Câu chuyện cảnh quan"
      title="Nhịp điệu rừng xanh trên đại lộ"
    >
      <p className="lead">Dưới tán lá, nắng dịu lại và không khí mát lành hơn — một khoảng xanh yên tĩnh ngay bên Đại lộ Bình Dương nhộn nhịp.</p>
      <p className="lead">Mật độ xây dựng chỉ 20%, các toà nhà nằm giữa 2,5 ha cảnh quan, với các tầng cây trồng theo phương pháp Miyawaki của Nhật Bản để lớn lên cùng năm tháng.</p>
    </StoryBackdrop>
  );
}
