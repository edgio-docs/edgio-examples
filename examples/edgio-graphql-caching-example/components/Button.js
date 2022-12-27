import Loader from './Loader'

const Button = ({ bgColor, text, callback, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={() => callback()}
      style={{ backgroundColor: bgColor }}
      className="p-2 px-4 rounded text-white flex flex-row space-x-2"
    >
      {disabled && <Loader textColor="#FFFFFF" />}
      {text}
    </button>
  )
}

export default Button
