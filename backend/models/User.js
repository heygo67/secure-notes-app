const users = [];

export function findUserByEmail(email) {
  return users.find(user => user.email === email);
}

export function createUser({ email, hashedPassword }) {
  const user = {
    _id: Date.now().toString(), // mock ObjectId
    email,
    password: hashedPassword
  };
  users.push(user);
  return user;
}
