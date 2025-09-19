export function sanitizeUser(user) {
  if (!user) return null;
  const plain = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete plain.password;
  if (plain._id && typeof plain._id.toString === "function") {
    plain.id = plain._id.toString();
  }
  return plain;
}

