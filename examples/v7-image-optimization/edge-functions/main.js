import URL from 'url-parse';

export async function handleHttpRequest(request, context) {
  const resp = await fetch('https://en.wikipedia.org', {
    edgio: {
      origin: 'wiki',
    },
  });
  const html = await resp.text();

  // Regular expression to match image src attributes containing 'wikimedia'
  const regex = /<img [^>]*src="([^"]*wikimedia[^"]*)"[^>]*>/g;
  const matches = html.match(regex);

  // Extract up to 5 image paths from the matches
  const wikimediaImages = [];
  for (let i = 0; i < matches.length && wikimediaImages.length < 5; i++) {
    const match = matches[i];
    const urlMatch = match.match(/src="([^"]*)"/);
    if (urlMatch && urlMatch[1]) {
      const url = new URL(`https:${urlMatch[1]}`);
      const { pathname } = url;
      wikimediaImages.push(pathname);
    }
  }

  const imageCards = generateImageCards(wikimediaImages);
  const newHtml = createHtml(imageCards);

  return new Response(newHtml, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}

const optimizations = [
  {
    optimization: 'format=webp',
    description: 'Optimized to WebP format',
  },
  {
    optimization: 'pad=45&bg-color=000000',
    description: 'Padded with black background',
  },
  {
    optimization: 'rotate=90&height=262',
    description: 'Rotated 90 degrees and resized',
  },
  {
    optimization: 'quality=5',
    description: 'Quality Adjusted to 5%',
  },
  {
    optimization: 'blur=20',
    description: 'Blur Filter Applied',
  },
  {
    optimization: 'width=200&height=200',
    description: 'Resized to 200x200',
  },
];

const generateImageCards = (wikimediaImages) => {
  const demoImageCards = optimizations
    .map(
      ({ optimization, description }) => `
    <div class="image-card">
      <img src="/images/demo.jpg?${optimization}" alt="${description}">
      <div class="info">
        <p>${description} using: <pre><code>?${optimization}</code></pre></p>
      </div>
    </div>
  `
    )
    .join('');

  const wikimediaImageCards = wikimediaImages
    .map((src, index) => {
      const { optimization, description } =
        optimizations[index % optimizations.length];
      return `
          <div class="image-card">
            <img src="/img-optimize${src}?${optimization}" alt="${description}">
            <div class="info">
              <p>${description} using: <pre><code>?${optimization}</code></pre></p>
            </div>
          </div>
        `;
    })
    .join('');

  return { demoImageCards, wikimediaImageCards };
};

const createHtml = ({ demoImageCards, wikimediaImageCards }) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Image Showcase</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 0;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
  }
  .section {
    width: 100%;
    max-width: 1200px; /* Adjust this value to your preference */
    margin-bottom: 32px;
  }
  .section h2, .section p {
    margin-bottom: 16px;
    text-align: center; /* Center aligns the section headers */
  }
  .image-set {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center; /* Centers the image cards within the image-set */
    text-align: center; /* Center aligns text within the image cards */
  }
  .image-card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s;
    flex: 1 1 calc(33.333% - 16px);
    max-width: calc(33.333% - 16px);
  }
  .image-card:hover {
    transform: scale(1.05);
  }
  .image-card img {
    display: block;
    max-width: 100%;
    border-bottom: 1px solid #ddd;
    margin: 0 auto; /* Centers images within the image cards */
  }
  .image-card .info {
    padding: 16px;
  }
  @media (max-width: 768px) {
    .image-card {
      flex: 1 1 calc(50% - 16px);
      max-width: calc(50% - 16px);
    }
  }
  @media (max-width: 480px) {
    .image-card {
      flex: 1 1 100%;
      max-width: 100%;
    }
  }
</style>
</head>
<body>

<div class="container">
  <div class="section">
    <h2>Optimized Local Static Images</h2>
    <p>This image is bundled as part of the project, served from an Edgio static asset origin, and processed by the image optimizer.</p>
    <div class="image-set">
      ${demoImageCards}
    </div>
  </div>
  <div class="section">
    <h2>Optimized Remote Images</h2>
    <p>These images are fetched from Wikipedia, proxied through Edgio and processed by the image optimizer.</p>
    <div class="image-set">
      ${wikimediaImageCards}
    </div>
  </div>
</div>

</body>
</html>
`;
