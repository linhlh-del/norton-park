import { images } from '@/data/site';
import StoryBackdrop from './StoryBackdrop';

export default function DesignStory() {
  return (
    <StoryBackdrop
      id="design-story"
      image={images.designStory}
      imageAlt="Phối cảnh các toà tháp Norton Park với đỉnh mái uốn cong như cánh hoa dầu"
      imageLabel="Ảnh nền: phối cảnh các toà tháp"
      eyebrow="Nguồn cảm hứng thi vị"
      title="Vũ khúc hoa trong gió"
    >
      <p className="lead">Cảm hứng đến từ những cánh hoa xoay theo gió, hình ảnh gắn bó với miền đất phương Nam.</p>
      <p className="lead">Chuyển động ấy được dịch thành ngôn ngữ kiến trúc và cảnh quan, hiện lên trong dáng hình thanh mảnh của từng toà tháp.</p>
    </StoryBackdrop>
  );
}
