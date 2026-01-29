// components/user/detail/ErrorState.tsx
interface ErrorStateProps {
  error: string | null;
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-red-600 mb-4">
          {error || "Produk tidak ditemukan"}
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9]"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default ErrorState;