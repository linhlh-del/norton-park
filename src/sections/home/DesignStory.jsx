import { useSite, useT } from '@/i18n';
import StoryBackdrop from './StoryBackdrop';

export default function DesignStory() {
  const t = useT();
  const { images } = useSite();
  return (
    <StoryBackdrop
      id="design-story"
      image={images.designStory}
      imageAlt={t('design.imageAlt')}
      imageLabel={t('design.imageLabel')}
      eyebrow={t('design.eyebrow')}
      title={t('design.title')}
      cta={{ label: t('design.cta'), to: '/#position', track: 'design_story_directions' }}
    >
      <p className="lead">{t('design.p1')}</p>
      <p className="lead">{t('design.p2')}</p>
    </StoryBackdrop>
  );
}
