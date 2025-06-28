response: {
  "text": "This is the file structure for a basic Express.js server. Remember to install dependencies using \`npm install\`.",
  "fileTree": {
    "app.js": {
      "file": {
        "contents": "const express = require('express');\\n\\nconst app = express();\\n\\napp.get('/', (req, res) => {\\n  res.send('Hello world');\\n});\\n\\napp.listen(3000, () => {\\n  console.log('Server starts at port 3000');\\n});"
      }
    },
    "package.json": {
      "file": {
        "contents": "{\\n  \\"name\\": \\"temp\\",\\n  \\"version\\": \\"1.0.0\\",\\n  \\"description\\": \\"\\",\\n  \\"main\\": \\"index.js\\",\\n  \\"scripts\\": {\\n    \\"start\\": \\"node app.js\\"\\n  },\\n  \\"dependencies\\": {\\n    \\"express\\": \\"^5.1.0\\"\\n  }\\n}"
      }
    }
  },
  "buildCommand": {
    "mainItem": "npm",
    "commands": ["install"]
  },
  "startCommand": {
    "mainItem": "node",
    "commands": ["app.js"]
  }
}