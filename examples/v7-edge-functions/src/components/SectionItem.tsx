import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const SectionItem = ({ href, title, description, onClick }) => {
  const router = useRouter();
  href = `/api/${href}`;

  useEffect(() => {
    router.prefetch(href);
  }, [href]);

  return (
    <div
      className={`transition-transform hover:scale-105 motion-reduce:transform-none`}
      onClick={onClick}
    >
      <h2 className={`mb-3 text-2xl font-semibold `}>{title}</h2>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{description}</p>
    </div>
  );
};

export default SectionItem;
