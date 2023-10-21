export function getRemoteUser(loggedUser, users) {
  const [userOne, userTwo] = users;

  return userOne?._id === loggedUser?._id ? userTwo : userOne;
}

export function isSameUser(messages, m, i, loggedUser) {
  const curMessage = messages[i];
  const nextMessage = messages[i + 1];

  return (
    m.sender._id !== loggedUser &&
    curMessage.sender._id !== nextMessage?.sender?._id
  );
}
