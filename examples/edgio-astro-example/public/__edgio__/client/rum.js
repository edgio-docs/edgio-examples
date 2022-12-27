function initMetrics() {
  new Layer0.Metrics({
    token: '60b7c707-f5cb-4207-ad0e-ce65848ca570',
  }).collect()
}

var rumScriptTag = document.createElement('script')
rumScriptTag.src = 'https://rum.layer0.co/latest.js'
rumScriptTag.setAttribute('defer', '')
rumScriptTag.type = 'text/javascript'
rumScriptTag.onload = initMetrics
document.body.appendChild(rumScriptTag)
