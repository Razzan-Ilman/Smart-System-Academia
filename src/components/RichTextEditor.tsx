import { useRef, useState, useEffect } from 'react';
import {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    OrderedListOutlined,
    UnorderedListOutlined,
    LinkOutlined,
    SmileOutlined,
    FontSizeOutlined,
    BgColorsOutlined
} from '@ant-design/icons';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const EMOJI_LIST = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
    '🤧', '🥵', '🥶', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐',
    '👍', '👎', '👏', '🙌', '🤝', '🙏', '💪', '✌️', '🤞', '🤟',
    '🤘', '👌', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '⭐',
    '🌟', '✨', '⚡', '🔥', '💥', '💫', '💯', '✅', '❌', '🎉',
    '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '🎖️', '🏅', '🎯'
];

const FONT_SIZES = [
    { label: 'Kecil', value: '1' },
    { label: 'Normal', value: '3' },
    { label: 'Sedang', value: '4' },
    { label: 'Besar', value: '5' },
    { label: 'Sangat Besar', value: '6' }
];

const TEXT_COLORS = [
    '#000000', '#444444', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF6B6B', '#FFA500', '#FFD700', '#FFFF00', '#90EE90',
    '#00FF00', '#00CED1', '#0000FF', '#4169E1', '#9370DB', '#FF1493',
    '#8B4513', '#2E8B57', '#DC143C', '#FF69B4', '#32CD32', '#1E90FF'
];

export default function RichTextEditor({ value, onChange, placeholder = 'Tulis deskripsi produk di sini...' }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [customColor, setCustomColor] = useState('#000000');
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleInput();
    };

    const handleBold = () => execCommand('bold');
    const handleItalic = () => execCommand('italic');
    const handleUnderline = () => execCommand('underline');
    const handleUnorderedList = () => execCommand('insertUnorderedList');
    const handleOrderedList = () => execCommand('insertOrderedList');

    const insertEmoji = (emoji: string) => {
        if (editorRef.current) {
            editorRef.current.focus();
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                const textNode = document.createTextNode(emoji);
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                range.setEndAfter(textNode);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            handleInput();
        }
        setShowEmojiPicker(false);
    };

    const setFontSize = (size: string) => {
        execCommand('fontSize', size);
        setShowFontSizeMenu(false);
    };

    const setTextColor = (color: string) => {
        execCommand('foreColor', color);
        setShowColorPicker(false);
    };

    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setCustomColor(color);
        execCommand('foreColor', color);
    };

    const insertLink = () => {
        if (!linkUrl.trim()) {
            alert('URL tidak boleh kosong');
            return;
        }

        const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
        const text = linkText.trim() || url;

        if (editorRef.current) {
            editorRef.current.focus();
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();

                const link = document.createElement('a');
                link.href = url;
                link.textContent = text;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.style.color = '#3b82f6';
                link.style.textDecoration = 'underline';
                
                // Tambahkan cursor pointer
                link.style.cursor = 'pointer';
                
                // Buat link bisa diklik dengan Ctrl+Click
                link.addEventListener('click', (e) => {
                    if (e.ctrlKey || e.metaKey) {
                        window.open(url, '_blank');
                    }
                });

                range.insertNode(link);
                
                // Tambah spasi setelah link agar bisa lanjut ketik
                const space = document.createTextNode(' ');
                range.setStartAfter(link);
                range.insertNode(space);
                range.setStartAfter(space);
                range.collapse(true);
                
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }

        setLinkUrl('');
        setLinkText('');
        setShowLinkModal(false);
        handleInput();
    };

    const closeAllMenus = () => {
        setShowEmojiPicker(false);
        setShowFontSizeMenu(false);
        setShowColorPicker(false);
    };

    const ToolbarButton = ({ 
        onClick, 
        children, 
        active = false,
        title 
    }: { 
        onClick: () => void; 
        children: React.ReactNode; 
        active?: boolean;
        title: string;
    }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`
                w-10 h-10 
                flex items-center justify-center 
                rounded-lg 
                transition-all duration-200
                ${active 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                }
                border border-gray-200
                active:scale-95
            `}
        >
            {children}
        </button>
    );

    return (
        <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-visible">
            {/* Toolbar */}
            <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 p-3">
                <div className="flex flex-wrap gap-2 items-center">
                    {/* Text Formatting Group */}
                    <div className="flex gap-1.5 bg-gray-100 p-1.5 rounded-lg">
                        <ToolbarButton onClick={handleBold} title="Bold (Ctrl+B)">
                            <BoldOutlined className="text-base" />
                        </ToolbarButton>
                        <ToolbarButton onClick={handleItalic} title="Italic (Ctrl+I)">
                            <ItalicOutlined className="text-base" />
                        </ToolbarButton>
                        <ToolbarButton onClick={handleUnderline} title="Underline (Ctrl+U)">
                            <UnderlineOutlined className="text-base" />
                        </ToolbarButton>
                    </div>

                    {/* Lists Group */}
                    <div className="flex gap-1.5 bg-gray-100 p-1.5 rounded-lg">
                        <ToolbarButton onClick={handleUnorderedList} title="Bullet List">
                            <UnorderedListOutlined className="text-base" />
                        </ToolbarButton>
                        <ToolbarButton onClick={handleOrderedList} title="Numbered List">
                            <OrderedListOutlined className="text-base" />
                        </ToolbarButton>
                    </div>

                    {/* Font Size */}
                    <div className="relative">
                        <ToolbarButton 
                            onClick={() => {
                                setShowFontSizeMenu(!showFontSizeMenu);
                                setShowColorPicker(false);
                                setShowEmojiPicker(false);
                            }}
                            active={showFontSizeMenu}
                            title="Ukuran Font"
                        >
                            <FontSizeOutlined className="text-base" />
                        </ToolbarButton>
                        {showFontSizeMenu && (
                            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] min-w-[160px] overflow-hidden">
                                {FONT_SIZES.map((size, index) => (
                                    <button
                                        key={size.value}
                                        type="button"
                                        onClick={() => setFontSize(size.value)}
                                        className={`
                                            w-full px-4 py-3 text-left 
                                            hover:bg-blue-50 hover:text-blue-600
                                            transition-colors duration-150
                                            ${index !== FONT_SIZES.length - 1 ? 'border-b border-gray-100' : ''}
                                        `}
                                    >
                                        <span style={{ fontSize: `${parseInt(size.value) * 2 + 8}px` }}>
                                            {size.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Color Picker */}
                    <div className="relative">
                        <ToolbarButton 
                            onClick={() => {
                                setShowColorPicker(!showColorPicker);
                                setShowFontSizeMenu(false);
                                setShowEmojiPicker(false);
                            }}
                            active={showColorPicker}
                            title="Warna Teks"
                        >
                            <BgColorsOutlined className="text-base" />
                        </ToolbarButton>
                        {showColorPicker && (
                            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] p-4 w-64">
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-700 mb-2">
                                        Warna Kustom
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={customColor}
                                            onChange={handleCustomColorChange}
                                            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                                        />
                                        <input
                                            type="text"
                                            value={customColor}
                                            onChange={(e) => {
                                                setCustomColor(e.target.value);
                                                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                                                    execCommand('foreColor', e.target.value);
                                                }
                                            }}
                                            placeholder="#000000"
                                            className="flex-1 px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <p className="text-xs font-bold text-gray-700 mb-3">Warna Preset</p>
                                    <div className="grid grid-cols-6 gap-2">
                                        {TEXT_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setTextColor(color)}
                                                className="w-9 h-9 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:scale-110 transition-all duration-200 shadow-sm"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Link */}
                    <ToolbarButton 
                        onClick={() => {
                            setShowLinkModal(true);
                            closeAllMenus();
                        }}
                        title="Tambah Link (Ctrl+Click untuk buka)"
                    >
                        <LinkOutlined className="text-base" />
                    </ToolbarButton>

                    {/* Emoji */}
                    <div className="relative">
                        <ToolbarButton 
                            onClick={() => {
                                setShowEmojiPicker(!showEmojiPicker);
                                setShowFontSizeMenu(false);
                                setShowColorPicker(false);
                            }}
                            active={showEmojiPicker}
                            title="Tambah Emoji"
                        >
                            <SmileOutlined className="text-base" />
                        </ToolbarButton>
                        {showEmojiPicker && (
                            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] p-4 w-80 max-h-72 overflow-y-auto">
                                <p className="text-xs font-bold text-gray-700 mb-3">Pilih Emoji</p>
                                <div className="grid grid-cols-8 gap-2">
                                    {EMOJI_LIST.map((emoji, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => insertEmoji(emoji)}
                                            className="
                                                w-10 h-10 
                                                text-2xl 
                                                flex items-center justify-center
                                                hover:bg-blue-50 
                                                rounded-lg 
                                                transition-all duration-150
                                                hover:scale-125
                                                active:scale-95
                                            "
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onClick={closeAllMenus}
                className="min-h-[220px] p-5 outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset rich-text-content"
                style={{ fontSize: '16px', lineHeight: '1.6' }}
                suppressContentEditableWarning
                data-placeholder={placeholder}
            />

            {/* Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Tambah Link</h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowLinkModal(false);
                                    setLinkUrl('');
                                    setLinkText('');
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Teks Link (opsional)
                                </label>
                                <input
                                    type="text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    placeholder="Contoh: Klik di sini"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-colors"
                                />
                            </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-700">
                                💡 <strong>Tips:</strong> Gunakan Ctrl+Click (Windows) atau Cmd+Click (Mac) untuk membuka link di editor
                            </p>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowLinkModal(false);
                                    setLinkUrl('');
                                    setLinkText('');
                                }}
                                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 active:scale-95"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={insertLink}
                                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                            >
                                Tambah Link
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                /* Placeholder */
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9CA3AF;
                    pointer-events: none;
                }
                
                /* Basic content editable */
                [contenteditable] {
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }
                
                /* PERBAIKAN LIST - YANG PALING PENTING! */
                .rich-text-content ul {
                    list-style-type: disc !important;
                    list-style-position: outside !important;
                    padding-left: 2.5rem !important;
                    margin: 0.75rem 0 !important;
                }
                
                .rich-text-content ol {
                    list-style-type: decimal !important;
                    list-style-position: outside !important;
                    padding-left: 2.5rem !important;
                    margin: 0.75rem 0 !important;
                }
                
                .rich-text-content li {
                    display: list-item !important;
                    margin: 0.5rem 0 !important;
                    padding-left: 0.5rem !important;
                }
                
                .rich-text-content ul li::marker {
                    color: #374151;
                }
                
                .rich-text-content ol li::marker {
                    color: #374151;
                    font-weight: 600;
                }
                
                /* Links */
                .rich-text-content a {
                    color: #3b82f6 !important;
                    text-decoration: underline !important;
                    cursor: pointer !important;
                }
                
                .rich-text-content a:hover {
                    color: #2563eb !important;
                    text-decoration: underline !important;
                }
                
                /* Paragraphs */
                .rich-text-content p {
                    margin: 0.5rem 0;
                }
                
                /* Bold, Italic, Underline */
                .rich-text-content strong,
                .rich-text-content b {
                    font-weight: bold !important;
                }
                
                .rich-text-content em,
                .rich-text-content i {
                    font-style: italic !important;
                }
                
                .rich-text-content u {
                    text-decoration: underline !important;
                }
                
                /* Custom scrollbar */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 6px;
                }
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}