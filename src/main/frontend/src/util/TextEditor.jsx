import { useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const TextEditor = ({ onChange }) => {
    const editorRef = useRef();

    const handleContentChange = () => {
        const markdown = editorRef.current.getInstance().getMarkdown();
        onChange(markdown);
    }

    return (
        <Editor
          ref={editorRef}
          initialValue="상품 설명을 입력하세요."
          height="400px"
          initialEditType="wysiwyg"    // 'wysiwyg'로 바꾸면 WYSIWYG 모드
          hideModeSwitch={true}         // 하단 'Edit | Preview' 토글 제거
          toolbarItems={[
            ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol', 'task'],
            ['link'],
          ]}
          onChange={handleContentChange}
        />
    );
}

export default TextEditor;