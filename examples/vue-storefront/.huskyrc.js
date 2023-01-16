const tasks = arr => arr.join(' && ')

module.exports = {
  hooks: {
    // 'pre-commit': tasks([
    //   'lint-staged'
    // ]),
    'pre-commit': 'echo "pre-commit hook skipped"',
    // 'pre-push': tasks([
    //   'npm test:unit'
    // ])
    'pre-push': 'echo "pre-push hook skipped"',
  },
}
