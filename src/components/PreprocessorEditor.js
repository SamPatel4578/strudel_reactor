export default function PreprocessorEditor({ value, onChange }) {
    return (
        <div className="editor">
            <h3>Preprocessor Editor</h3>
            <textarea value={value} onChange={onChange}></textarea>
        </div>
    );
}