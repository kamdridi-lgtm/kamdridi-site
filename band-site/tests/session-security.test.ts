import assert from "node:assert/strict";
import test from "node:test";
import { createSessionToken, verifySessionToken } from "../lib/session";

const originalNodeEnv = process.env.NODE_ENV;
const originalSessionSecret = process.env.FAN_CLUB_SESSION_SECRET;

function restoreEnvironment() {
  if (originalNodeEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalNodeEnv;
  }

  if (originalSessionSecret === undefined) {
    delete process.env.FAN_CLUB_SESSION_SECRET;
  } else {
    process.env.FAN_CLUB_SESSION_SECRET = originalSessionSecret;
  }
}

test.afterEach(restoreEnvironment);
test.after(restoreEnvironment);

test("development can use the local fallback secret", () => {
  process.env.NODE_ENV = "development";
  delete process.env.FAN_CLUB_SESSION_SECRET;

  const token = createSessionToken({ name: "Test Fan", email: "fan@example.com" });
  assert.deepEqual(verifySessionToken(token), {
    name: "Test Fan",
    email: "fan@example.com"
  });
});

test("production refuses to mint a session when FAN_CLUB_SESSION_SECRET is missing", () => {
  process.env.NODE_ENV = "production";
  delete process.env.FAN_CLUB_SESSION_SECRET;

  assert.throws(
    () => createSessionToken({ name: "Test Fan", email: "fan@example.com" }),
    /FAN_CLUB_SESSION_SECRET must be configured in production/
  );
});

test("production refuses to trust a token when FAN_CLUB_SESSION_SECRET is missing", () => {
  process.env.NODE_ENV = "development";
  delete process.env.FAN_CLUB_SESSION_SECRET;
  const developmentToken = createSessionToken({ name: "Test Fan", email: "fan@example.com" });

  process.env.NODE_ENV = "production";
  delete process.env.FAN_CLUB_SESSION_SECRET;

  assert.equal(verifySessionToken(developmentToken), null);
});

test("production accepts sessions signed with the configured secret", () => {
  process.env.NODE_ENV = "production";
  process.env.FAN_CLUB_SESSION_SECRET = "test-only-secret-that-is-not-used-in-production";

  const token = createSessionToken({ name: "Test Fan", email: "fan@example.com" });
  assert.deepEqual(verifySessionToken(token), {
    name: "Test Fan",
    email: "fan@example.com"
  });
});

test("a token signed with a different secret is rejected", () => {
  process.env.NODE_ENV = "production";
  process.env.FAN_CLUB_SESSION_SECRET = "first-test-secret";
  const token = createSessionToken({ name: "Test Fan", email: "fan@example.com" });

  process.env.FAN_CLUB_SESSION_SECRET = "second-test-secret";
  assert.equal(verifySessionToken(token), null);
});
