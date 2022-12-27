function initMetrics() {
  new Layer0.Metrics({
    token: '4793b50d-db03-43a2-9584-c971e06a6c88',
  }).collect()
}

var rumScriptTag = document.createElement('script')
rumScriptTag.src = 'https://rum.layer0.co/latest.js'
rumScriptTag.setAttribute('defer', '')
rumScriptTag.type = 'text/javascript'
rumScriptTag.onload = initMetrics
document.body.appendChild(rumScriptTag)
