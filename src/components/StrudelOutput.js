export default function StrudelOutput({ value, onChange }) {
    return (
        <div className="editor">
            <h3>Strudel Output</h3>
            <textarea value={value} onChange={onChange}></textarea>
        </div>
    );
}
