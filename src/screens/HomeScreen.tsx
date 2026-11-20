import type { Navigate } from '../types/navigation';
import { HeroSection } from './home/HeroSection';
import { TransformationScene } from './home/TransformationScene';
import { StylesMarquee } from './home/StylesMarquee';
import { CompareSection } from './home/CompareSection';
import { ManifestoSection } from './home/ManifestoSection';
import { StylesIndexSection } from './home/StylesIndexSection';
import { ProcessSection } from './home/ProcessSection';

export function HomeScreen({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <>
      <HeroSection onNavigate={onNavigate} />
      <TransformationScene />
      <StylesMarquee />
      <CompareSection />
      <ManifestoSection />
      <StylesIndexSection onNavigate={onNavigate} />
      <ProcessSection />
    </>
  );
}
