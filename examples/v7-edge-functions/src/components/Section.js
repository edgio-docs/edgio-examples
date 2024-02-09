function Section({ title, description, children }) {
  return (
    <div className="max-w-3x1 mx-auto px-4 py-2">
      <h1 className="text-xl font-semibold">{title}</h1>
      {description && (
        <p className="my-2 text-sm text-gray-400">{description}</p>
      )}
      <hr className="my-2" />
      <div className="mx-auto mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        {children}
      </div>
    </div>
  );
}

export default Section;
