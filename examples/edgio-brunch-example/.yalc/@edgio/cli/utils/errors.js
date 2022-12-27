"use strict";

/**
 * EdgioCLIErrors are log in different ways:
 * - 'userMessage' is displayed in red bold in CLI output and added to LD logs
 * - 'errorDetails' is displayed in red normal in CLI output and added to LD logs
 * - 'addToLeDeployerLogs' is only added to LD logs.
 */
class EdgioCLIError extends Error {
  constructor(userMessage, {
    errorDetails,
    addToLeDeployerLogs
  } = {}) {
    super(userMessage);
    this.errorDetails = errorDetails;
    this.addToLeDeployerLogs = addToLeDeployerLogs;
    this.isUserError = true;
  }

}

class EdgioBuildError extends EdgioCLIError {
  constructor(build) {
    let message = 'Something went wrong while deploying on Edgio.\n\n';

    if (build.logs) {
      message += 'Build logs:\n';
    }

    super(message, {
      errorDetails: build.logs
    });
  }

}

class EdgioCLIUserError extends EdgioCLIError {}

class BadRequestError extends EdgioCLIUserError {}

class AuthenticationError extends EdgioCLIUserError {}

class MissingPackageJsonError extends EdgioCLIUserError {}

class MissingEdgioPackagesError extends EdgioCLIUserError {}

class DeployError extends EdgioCLIUserError {}

class ValidationError extends EdgioCLIUserError {}

class LeDeployerApiError extends EdgioCLIUserError {}

exports.EdgioBuildError = EdgioBuildError;
exports.EdgioCLIError = EdgioCLIError;
exports.BadRequestError = BadRequestError;
exports.AuthenticationError = AuthenticationError;
exports.MissingPackageJsonError = MissingPackageJsonError;
exports.MissingEdgioPackagesError = MissingEdgioPackagesError;
exports.DeployError = DeployError;
exports.LeDeployerApiError = LeDeployerApiError;
exports.ValidationError = ValidationError;