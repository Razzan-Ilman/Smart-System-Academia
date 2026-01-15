import { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function QuillEditor({ value, onChange, placeholder }: QuillEditorProps) {
    const quillRef = useRef<ReactQuill>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // Custom toolbar configuration
    const modules = {
        toolbar: {
            container: [
                [{ 'size': ['small', false, 'large', 'huge'] }],  // Font size
                ['bold', 'italic', 'underline', 'strike'],        // Formatting
                [{ 'background': [] }],                            // Text highlight
                [{ 'list': 'bullet' }, { 'list': 'ordered' }],    // Lists
                [{ 'align': [] }],                                 // Text alignment
                ['link', 'image', 'code-block'],                   // Insert link, image, code
                ['clean']                                          // Remove formatting
            ]
        }
    };

    const formats = [
        'size',
        'bold', 'italic', 'underline', 'strike',
        'background',
        'list', 'bullet',
        'align',
        'link', 'image', 'code-block'
    ];

    return (
        <div className={`quill-editor-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
            {/* Custom Fullscreen Button */}
            <div className="quill-fullscreen-btn">
                <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                    {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                </button>
            </div>

            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder || 'Tulis deskripsi di sini...'}
                className={isFullscreen ? 'fullscreen-editor' : ''}
            />
        </div>
    );
}
