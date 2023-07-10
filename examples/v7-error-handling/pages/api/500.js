export default function handler(req, res) {
  res.status(500).json({
    message: "This is a simulated 500 error response from the origin",
  });
}
