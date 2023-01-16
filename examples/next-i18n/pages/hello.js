import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

export default function Hello() {
  const { t } = useTranslation('common');

  return (
    <div>
      <h1>{t('hello')}</h1>
    </div>
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'footer'], require('../i18next.config'))),
      // Will be passed to the page component as props
    },
  };
}