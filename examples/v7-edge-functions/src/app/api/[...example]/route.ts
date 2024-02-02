import fs from 'fs';
import path from 'path';
import examples, { getExampleByHref } from '../../../examples';
import { NextResponse } from 'next/server';

export async function GET(request, context) {
  console.log('context', context);
  const { example } = context.params;
  const item = getExampleByHref(example.join('/'));
  if (!item) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  let code;

  try {
    const code = fs.readFileSync(
      path.join(process.cwd(), item.filepath),
      'utf-8'
    );
    return NextResponse.json({ code });
  } catch (error) {
    return NextResponse.json(
      { message: 'Not found', detail: error },
      { status: 404 }
    );
  }
}
