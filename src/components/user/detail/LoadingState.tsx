// components/user/detail/LoadingState.tsx
const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED] mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat detail produk...</p>
      </div>
    </div>
  );
};

export default LoadingState;