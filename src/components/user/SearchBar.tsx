import { SearchOutlined } from '@ant-design/icons';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: Props) => {
  return (
    <div className="relative w-full sm:w-80">
      <input
        type="text"
        placeholder="Cari Produk"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 pr-10 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      <SearchOutlined
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
      />
    </div>
  );
};

export default SearchBar;
