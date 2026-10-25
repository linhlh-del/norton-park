import { useSite, useT } from '@/i18n';
import StoryBackdrop from './StoryBackdrop';

/* variant (CMS): 'left' (mặc định) | 'right' — phía đặt khối chữ */
export default function DesignStory({ variant = 'left' }) {
  const t = useT();
  const { images } = useSite();
  return (
    <StoryBackdrop
      id="design-story"
      align={variant}
      image={images.designStory}
      imageAlt={t('design.imageAlt')}
      imageLabel={t('design.imageLabel')}
      eyebrow={t('design.eyebrow')}
      title={t('design.title')}
      seoTitle={t('design.seo')}
      cta={{ label: t('design.cta'), to: '/#position', track: 'design_story_directions' }}
    >
      <p className="lead">{t('design.p1')}</p>
      <p className="lead">{t('design.p2')}</p>
    </StoryBackdrop>
  );
}
