/**
 * Polyfill for process.env.
 */
global.process = global.process || { env: {} };

/**
 * Sets environment variables from a given context.
 *
 * @param {Object} context - The context object containing environment variables.
 * @param {Object} context.environmentVars - Key-value pairs of environment variables.
 */
export function setEnvFromContext({ environmentVars }) {
  Object.assign(process.env, environmentVars);
}
