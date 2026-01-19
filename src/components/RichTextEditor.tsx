import { useRef, useState, useEffect } from 'react';
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
    BgColorsOutlined
} from '@ant-design/icons';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [fontSize, setFontSize] = useState('16');

    // Set initial value only once when component mounts or when value changes from empty to non-empty
    useEffect(() => {
        if (editorRef.current && value && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const executeCommand = (command: string, value?: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
        setTimeout(() => updateContent(), 10);
    };

    const updateContent = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const changeFontSize = (size: string) => {
        setFontSize(size);

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        if (range.collapsed) return; // Do nothing if no text selected

        editorRef.current?.focus();

        // Get selected text
        const selectedText = range.toString();
        if (!selectedText) return;

        // Create span with font size
        const span = document.createElement('span');
        span.style.fontSize = size + 'px';
        span.textContent = selectedText;

        // Replace selection with styled span
        range.deleteContents();
        range.insertNode(span);

        // Move cursor after the span
        range.setStartAfter(span);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        updateContent();
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
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('bold');
                    }}
                    className="toolbar-btn"
                    title="Bold (Ctrl+B)"
                >
                    <BoldOutlined />
                </button>

                {/* Italic */}
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('italic');
                    }}
                    className="toolbar-btn"
                    title="Italic (Ctrl+I)"
                >
                    <ItalicOutlined />
                </button>

                {/* Underline */}
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('underline');
                    }}
                    className="toolbar-btn"
                    title="Underline (Ctrl+U)"
                >
                    <UnderlineOutlined />
                </button>

                {/* Strikethrough */}
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('strikeThrough');
                    }}
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
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('insertUnorderedList');
                    }}
                    className="toolbar-btn"
                    title="Bullet List"
                >
                    <UnorderedListOutlined />
                </button>

                {/* Numbered List */}
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('insertOrderedList');
                    }}
                    className="toolbar-btn"
                    title="Numbered List"
                >
                    <OrderedListOutlined />
                </button>

                <div className="w-px h-6 bg-gray-300" />

                {/* Align Left */}
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('justifyLeft');
                    }}
                    className="toolbar-btn"
                    title="Align Left"
                >
                    <AlignLeftOutlined />
                </button>

                {/* Align Center */}
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('justifyCenter');
                    }}
                    className="toolbar-btn"
                    title="Align Center"
                >
                    <AlignCenterOutlined />
                </button>

                {/* Align Right */}
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        executeCommand('justifyRight');
                    }}
                    className="toolbar-btn"
                    title="Align Right"
                >
                    <AlignRightOutlined />
                </button>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={updateContent}
                onBlur={updateContent}
                className="editor-content overflow-y-auto p-4 outline-none focus:ring-2 focus:ring-blue-400 bg-white min-h-[200px] max-h-[400px]"
                data-placeholder={placeholder}
                suppressContentEditableWarning
            />
        </div>
    );
}
