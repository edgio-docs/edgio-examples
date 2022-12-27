"use strict";

const authenticationStatus = async context => {
  const {
    apiKey,
    currentActor,
    logger
  } = context;

  if (currentActor) {
    logger.success(`🔑 Logged in as ${currentActor.name}.\n`);
    return true;
  }

  if (apiKey) {
    logger.error(`🔑 Incorrect apiKey.\n`);
  } else {
    logger.warn(`🔑 You are not logged in.\n`);
  }

  return false;
};

module.exports = authenticationStatus;