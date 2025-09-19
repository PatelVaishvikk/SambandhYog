export function validateBody(schema, handler) {
  return async (req, res) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      return handler(req, res);
    } catch (error) {
      res.status(400).json({ message: "Validation failed", details: error.errors ?? [] });
    }
  };
}
