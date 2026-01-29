import Navbar from '../../components/user/Navbar';
import Footer from '../../components/user/Footer';
import Menu_produk from './Menu_produk';
import icon from '../../assets/images/icon.png';

// ========== SUB-COMPONENTS ==========

// Decorative Background Blobs
const BackgroundBlobs = () => (
  <>
    <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full filter blur-3xl opacity-40 animate-pulse" />
    <div className="absolute top-40 left-10 md:left-20 w-48 h-48 md:w-72 md:h-72 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full filter blur-3xl opacity-30" />
    <div className="absolute bottom-0 right-0 w-80 h-80 md:w-[500px] md:h-[500px] bg-gradient-to-br from-purple-300 via-pink-300 to-blue-200 rounded-full filter blur-3xl opacity-50" />
    <div className="absolute bottom-20 left-20 md:left-40 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full filter blur-2xl opacity-40 animate-pulse" />
  </>
);

// Floating Decorative Elements
const FloatingElements = () => (
  <>
    <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse" />
    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-2xl opacity-50 animate-bounce" />
  </>
);

// Phone Mockup Image
const PhoneMockup = ({ className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="relative h-full transform hover:scale-105 transition-all duration-700 ease-out animate-float">
      <img
        src={icon}
        alt="SmartAcademy App"
        className="w-full h-full object-contain drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
      />
    </div>
    <FloatingElements />
  </div>
);

// Hero Content (Text & CTA)
const HeroContent = () => (
  <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start gap-4 sm:gap-5 md:gap-6">
    <h1 className="text-5xl sm:text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
      Selamat Datang
    </h1>

    <p className="text-xl sm:text-lg font-medium text-gray-800">
      Temukan Yang kamu cari disini
    </p>

    <a
      href="#produk"
      className="inline-block px-6 sm:px-8 md:px-12 py-2 sm:py-3 md:py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
    >
      Cari Produk!
    </a>
  </div>
);

// ========== MAIN COMPONENT ==========

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative overflow-visible">
      <BackgroundBlobs />

      <Navbar />

      <section className="flex flex-col items-center justify-center md:justify-between px-4 md:px-16 py-8 md:py-16 relative z-10 max-w-7xl mx-auto gap-10 md:gap-16 md:h-auto">
        
        {/* Mobile Image (Top) */}
        <div className="block md:hidden relative mt-2">
          <PhoneMockup className="w-64 h-[480px]" />
        </div>

        {/* Desktop Layout: Content + Image */}
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full gap-8 md:gap-16">
          <HeroContent />
          
          {/* Desktop Image (Right) */}
          <div className="hidden md:block relative">
            <PhoneMockup className="w-80 h-[600px]" />
          </div>
        </div>
      </section>

      <Menu_produk />

      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(1deg);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;