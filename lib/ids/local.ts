function createRandomSuffix() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function createLocalIdentifier(prefix: string, date: Date) {
  return `${prefix}-${date.getTime()}-${createRandomSuffix()}`;
}

export function createLocalProfileId(date = new Date()) {
  return createLocalIdentifier("LOCAL-PROFILE", date);
}

export function createLocalTeamCode(date = new Date()) {
  return createLocalIdentifier("LOCAL-TEAM", date);
}

export function createLocalSubmissionId(date = new Date()) {
  return createLocalIdentifier("LOCAL-SUBMISSION", date);
}
