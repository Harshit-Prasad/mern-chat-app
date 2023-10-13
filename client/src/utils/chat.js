export function getRemoteUser(loggedUser, users) {
  const [userOne, userTwo] = users;

  return userOne?._id === loggedUser?._id ? userTwo : userOne;
}
