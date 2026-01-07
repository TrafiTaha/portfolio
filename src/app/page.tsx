import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';
import SupportCard from '@/components/SupportCard';
import Footer from '@/components/Footer';
import ParallaxBackground from '@/components/ParallaxBackground';
import CustomCursor from '@/components/CustomCursor';
import SystemLog from '@/components/SystemLog';

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <ParallaxBackground />
      <CustomCursor />
      <SystemLog />
      <div className="relative z-10 max-w-7xl mx-auto px-10 flex flex-col items-center justify-center">
        <Hero />
        <BentoGrid />
        <SupportCard />
        <Footer />
      </div>
    </main>
  );
}
