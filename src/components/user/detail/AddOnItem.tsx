// components/user/detail/AddOnItem.tsx
import { CheckCircle2 } from "lucide-react";
import { formatRupiah } from "../../../utils/currency";
import type { AddOn } from "../../../services/productService";

interface AddOnItemProps {
  addon: AddOn;
  isSelected: boolean;
  onToggle: () => void;
}

const AddOnItem: React.FC<AddOnItemProps> = ({
  addon,
  isSelected,
  onToggle
}) => {
  return (
    <div
      onClick={onToggle}
      className={`p-3 border rounded-xl cursor-pointer transition-all flex items-center justify-between group
        ${
          isSelected
            ? "bg-purple-50 border-[#7C3AED] ring-1 ring-[#7C3AED]"
            : "border-slate-200 hover:border-purple-300 hover:bg-slate-50"
        }`}
    >
      <div>
        <p
          className={`font-medium text-sm ${
            isSelected
              ? "text-[#7C3AED]"
              : "text-slate-700 group-hover:text-[#7C3AED]"
          }`}
        >
          {addon.name}
        </p>
        <p className="text-xs text-slate-500 mt-0.5 font-mono">
          + {formatRupiah(addon.price)}
        </p>
      </div>
      {isSelected ? (
        <CheckCircle2 className="text-[#7C3AED] w-5 h-5 flex-shrink-0" />
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-purple-300" />
      )}
    </div>
  );
};

export default AddOnItem;