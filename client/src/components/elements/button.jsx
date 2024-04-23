const Button = ({ button }) => {
  return (
    <button
      type="submit"
      className="bg-sky-300 py-2 rounded-lg text-white w-[90%] hover:bg-sky-500 text-lg font-semibold"
    >
      {button}
    </button>
  );
};

export default Button;
