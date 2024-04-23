const InputField = ({ type, placeholder, name, children, onchange, value }) => {
  return (
    <div className="mb-2 flex items-center justify-center gap-2 w-[90%] mx-auto border-b-2 hover:border-sky-300">
      {children}
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        id={name}
        className="focus:outline-none w-[85%] p-2 text-xl text-slate-700 bg-secondary"
        onChange={onchange}
        value={value}
      />
    </div>
  );
};

export default InputField;
