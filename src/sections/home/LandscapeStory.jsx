import { useSite, useT } from '@/i18n';
import StoryBackdrop from './StoryBackdrop';

/* variant (CMS): 'right' (mặc định) | 'left' — phía đặt khối chữ */
export default function LandscapeStory({ variant = 'right' }) {
  const t = useT();
  const { images } = useSite();
  return (
    <StoryBackdrop
      id="landscape-story"
      align={variant}
      image={images.landscapeStory}
      imageAlt={t('landscape.imageAlt')}
      imageLabel={t('landscape.imageLabel')}
      eyebrow={t('landscape.eyebrow')}
      title={t('landscape.title')}
      seoTitle={t('landscape.seo')}
      cta={{ label: t('landscape.cta'), to: '/#position', track: 'landscape_story_amenities' }}
    >
      <p className="lead">{t('landscape.p1')}</p>
      <p className="lead">{t('landscape.p2')}</p>
    </StoryBackdrop>
  );
}
