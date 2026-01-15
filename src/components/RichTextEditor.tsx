import { useRef, useState } from 'react';
import {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    StrikethroughOutlined,
    OrderedListOutlined,
    UnorderedListOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    LinkOutlined,
    PictureOutlined,
    CodeOutlined,
    BgColorsOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined
} from '@ant-design/icons';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState('16');
    const [isFullscreen, setIsFullscreen] = useState(false);

    const executeCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        updateContent();
    };

    const updateContent = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const insertLink = () => {
        const url = prompt('Masukkan URL:');
        if (url) {
            executeCommand('createLink', url);
        }
    };

    const insertImage = () => {
        const url = prompt('Masukkan URL gambar:');
        if (url) {
            executeCommand('insertImage', url);
        }
    };

    const changeFontSize = (size: string) => {
        setFontSize(size);
        executeCommand('fontSize', '3');
        // Apply custom size via style
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.fontSize = size + 'px';
            range.surroundContents(span);
        }
    };

    const changeHighlightColor = (color: string) => {
        executeCommand('backColor', color);
    };

    return (
        <div className="rich-text-editor-custom border border-gray-200 rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="toolbar bg-[#e8f0fe] p-3 flex items-center gap-2 flex-wrap border-b border-gray-200">
                {/* Font Size */}
                <select
                    value={fontSize}
                    onChange={(e) => changeFontSize(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded bg-white text-sm"
                >
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="20">20</option>
                    <option value="24">24</option>
                    <option value="32">32</option>
                </select>

                <div className="w-px h-6 bg-gray-300" />

                {/* Bold */}
                <button
                    type="button"
                    onClick={() => executeCommand('bold')}
                    className="toolbar-btn"
                    title="Bold (Ctrl+B)"
                >
                    <BoldOutlined />
                </button>

                {/* Italic */}
                <button
                    type="button"
                    onClick={() => executeCommand('italic')}
                    className="toolbar-btn"
                    title="Italic (Ctrl+I)"
                >
                    <ItalicOutlined />
                </button>

                {/* Underline */}
                <button
                    type="button"
                    onClick={() => executeCommand('underline')}
                    className="toolbar-btn"
                    title="Underline (Ctrl+U)"
                >
                    <UnderlineOutlined />
                </button>

                {/* Strikethrough */}
                <button
                    type="button"
                    onClick={() => executeCommand('strikeThrough')}
                    className="toolbar-btn"
                    title="Strikethrough"
                >
                    <StrikethroughOutlined />
                </button>

                <div className="w-px h-6 bg-gray-300" />

                {/* Highlight Color */}
                <div className="relative group">
                    <button
                        type="button"
                        className="toolbar-btn"
                        title="Highlight"
                    >
                        <BgColorsOutlined />
                    </button>
                    <div className="hidden group-hover:flex absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-2 gap-1 z-10">
                        <button type="button" onClick={() => changeHighlightColor('#ffeb3b')} className="w-6 h-6 bg-yellow-400 rounded border border-gray-300" />
                        <button type="button" onClick={() => changeHighlightColor('#4caf50')} className="w-6 h-6 bg-green-500 rounded border border-gray-300" />
                        <button type="button" onClick={() => changeHighlightColor('#2196f3')} className="w-6 h-6 bg-blue-500 rounded border border-gray-300" />
                        <button type="button" onClick={() => changeHighlightColor('#f44336')} className="w-6 h-6 bg-red-500 rounded border border-gray-300" />
                        <button type="button" onClick={() => changeHighlightColor('#ff9800')} className="w-6 h-6 bg-orange-500 rounded border border-gray-300" />
                    </div>
                </div>

                <div className="w-px h-6 bg-gray-300" />

                {/* Bullet List */}
                <button
                    type="button"
                    onClick={() => executeCommand('insertUnorderedList')}
                    className="toolbar-btn"
                    title="Bullet List"
                >
                    <UnorderedListOutlined />
                </button>

                {/* Numbered List */}
                <button
                    type="button"
                    onClick={() => executeCommand('insertOrderedList')}
                    className="toolbar-btn"
                    title="Numbered List"
                >
                    <OrderedListOutlined />
                </button>

                <div className="w-px h-6 bg-gray-300" />

                {/* Align Left */}
                <button
                    type="button"
                    onClick={() => executeCommand('justifyLeft')}
                    className="toolbar-btn"
                    title="Align Left"
                >
                    <AlignLeftOutlined />
                </button>

                {/* Align Center */}
                <button
                    type="button"
                    onClick={() => executeCommand('justifyCenter')}
                    className="toolbar-btn"
                    title="Align Center"
                >
                    <AlignCenterOutlined />
                </button>

                {/* Align Right */}
                <button
                    type="button"
                    onClick={() => executeCommand('justifyRight')}
                    className="toolbar-btn"
                    title="Align Right"
                >
                    <AlignRightOutlined />
                </button>

                <div className="w-px h-6 bg-gray-300" />

                {/* Insert Link */}
                <button
                    type="button"
                    onClick={insertLink}
                    className="toolbar-btn"
                    title="Insert Link"
                >
                    <LinkOutlined />
                </button>

                {/* Insert Image */}
                <button
                    type="button"
                    onClick={insertImage}
                    className="toolbar-btn"
                    title="Insert Image"
                >
                    <PictureOutlined />
                </button>

                {/* Code Block */}
                <button
                    type="button"
                    onClick={() => executeCommand('formatBlock', 'pre')}
                    className="toolbar-btn"
                    title="Code Block"
                >
                    <CodeOutlined />
                </button>

                <div className="w-px h-6 bg-gray-300" />

                {/* Fullscreen Toggle */}
                <button
                    type="button"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="toolbar-btn"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                    {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                </button>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={updateContent}
                onBlur={updateContent}
                dangerouslySetInnerHTML={{ __html: value }}
                className={`editor-content overflow-y-auto p-4 outline-none focus:ring-2 focus:ring-blue-400 bg-white ${isFullscreen ? 'fixed inset-0 z-50 min-h-screen max-h-screen' : 'min-h-[200px] max-h-[400px]'
                    }`}
                data-placeholder={placeholder}
            />
        </div>
    );
}
