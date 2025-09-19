export function sanitizeContent(text) {
  return text.replace(/(hate|stupid|idiot)/gi, "[kindness]");
}

export function isPositiveSentiment(text) {
  return /(thank|grateful|excited|proud)/i.test(text);
}
