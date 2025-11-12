const app = require("./src/server");

// Start server
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running at port ${process.env.PORT}`)
);
