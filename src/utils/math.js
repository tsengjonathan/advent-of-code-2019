function gcd(a, b) {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

export { gcd, lcm };
