import type { Navigate } from '../types/navigation';
import { HeroSection } from './home/HeroSection';
import { StylesMarquee } from './home/StylesMarquee';
import { ManifestoSection } from './home/ManifestoSection';
import { StylesIndexSection } from './home/StylesIndexSection';
import { ProcessSection } from './home/ProcessSection';

export function HomeScreen({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <>
      <HeroSection onNavigate={onNavigate} />
      <StylesMarquee />
      <ManifestoSection />
      <StylesIndexSection onNavigate={onNavigate} />
      <ProcessSection />
    </>
  );
}
