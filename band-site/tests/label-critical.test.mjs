import assert from "node:assert/strict";
import { test } from "node:test";

function calculateRoyalty(streams, rateCents, artistPct, distributionFeePct) {
  const gross = Math.round(streams * rateCents);
  const fee = Math.round(gross * (distributionFeePct / 100));
  const net = gross - fee;
  return Math.round(net * (artistPct / 100));
}

function upcCheckDigit(firstTwelve) {
  const sum = firstTwelve
    .split("")
    .map(Number)
    .reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 1 : 3), 0);
  return String((10 - (sum % 10)) % 10);
}

test("royalty calculator applies stream rate, distribution fee, and artist split", () => {
  assert.equal(calculateRoyalty(10000, 0.3, 70, 18), 1722);
});

test("UPC check digit produces a 13-digit EAN-compatible code", () => {
  const base = "628011000001";
  const code = `${base}${upcCheckDigit(base)}`;
  assert.match(code, /^\d{13}$/);
  assert.equal(code, "6280110000013");
});

test("ISRC shape matches Canadian registrant pattern", () => {
  const isrc = "CA-KDR-26-00001";
  assert.match(isrc, /^CA-[A-Z0-9]{3}-\d{2}-\d{5}$/);
});
