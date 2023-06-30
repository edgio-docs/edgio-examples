import { headers } from 'next/headers';
import Sidebar from '../../../components/Sidebar';
import ProductPreview from '../../../components/ProductPreview';
import { filterProducts, getOrigin } from '../../../lib/helper';

export default async function Page(args) {
  const { params, searchParams } = args;
  const name = (params.slug || []).join('/');
  const { filter } = searchParams;
  const data = await getData(name);

  return (
    <div className="flex-col items-center justify-start">
      <div className="flex w-full flex-row items-start px-5">
        <div className="flex min-w-[200px] flex-col pt-5">
          <Sidebar />
        </div>
        <div className="flex flex-col items-start pt-5">
          <h2 className="text-[#FFFFFF75]">Showing {data.length} Results</h2>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {filterProducts(data, filter).map((i) => (
              <ProductPreview key={i.path} {...i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

async function getData(name) {
  const resp = await fetch(
    `${getOrigin(headers())}/edgio-api/${
      name ? `categories/${name}` : 'products/all'
    }`
  );
  let data = await resp.json();
  if (name) {
    data = data['items'];
  }
  return data;
}
