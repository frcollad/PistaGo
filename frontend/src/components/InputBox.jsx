function InputBox({ icon, label, value }) {
  return (
    <div className="input-row">
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
      <b>⌄</b>
    </div>
  );
}

export default InputBox;