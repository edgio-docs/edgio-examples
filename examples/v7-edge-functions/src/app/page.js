'use client';

import { useState } from 'react';
import SectionItem from '../components/SectionItem';
import Section from '../components/Section';
import ExampleModal from '../components/ExampleModal';
import examples from '../examples';

function HomePage() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const onOpenModal = async (item) => {
    const data = await getData(item);
    setData(data);
    setOpen(true);
  };
  const onCloseModal = () => {
    setData(null);
    setOpen(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {examples.map((section, sectionIdx) => (
        <Section
          key={`${section.title}-${sectionIdx}`}
          title={section.title}
          description={section.description}
        >
          {section.items.map((item, itemIdx) => (
            <SectionItem
              key={`${item.title}-${itemIdx}`}
              href={item.href}
              onClick={() => onOpenModal(item)}
              title={item.title}
              description={item.description}
            />
          ))}
        </Section>
      ))}

      {data?.code && (
        <ExampleModal open={open} code={data.code} onClose={onCloseModal} />
      )}

      {/* Footer links and notes */}
      <div className="footer">
        <a href="https://docs.edg.io/guides/v7/edge-functions" target="_blank">
          Edge Functions Documentation
        </a>{' '}
        |{' '}
        <a
          href="https://github.com/edgio-docs/edgio-v7-edge-functions-example"
          target="_blank"
        >
          View the demo code on GitHub
        </a>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#FF5733' }}>
          <strong>Note</strong>: Edge Functions requires activation on your
          account.{' '}
          <a href="https://docs.edg.io/guides/v7/edge-functions">Learn more.</a>
        </p>
      </div>
    </main>
  );
}

async function getData(item) {
  const response = await fetch(`/api/${item.href}`);
  const data = await response.json();
  return data;
}

export default HomePage;
