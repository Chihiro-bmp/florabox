// Same greedy word-wrap the card components use to lay out the message
export function wrapMessage(message, chars) {
  if (!message) return [];
  return message.match(new RegExp(`.{1,${chars}}(\\s|$)`, 'g'))
    ?.map(s => s.trim())
    .filter(Boolean) ?? [];
}

const normalise = (s) => s.trim().replace(/\s+/g, ' ');

// True when every word of the message will actually be drawn on the card
export function messageFits(message, { chars, lines }) {
  const wrapped = wrapMessage(message, chars);
  return wrapped.length <= lines && normalise(wrapped.join(' ')) === normalise(message);
}
