const axios = require('axios');
const crypto = require('crypto');

module.exports = async (req, res) => {
  // CORS Middleware
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { fileName, content } = req.body;

  if (!fileName || !content) {
    return res.status(400).json({ error: 'fileName dan content (base64) wajib diisi' });
  }

  const extension = fileName.split('.').pop();
  const randomName = crypto.randomBytes(4).toString('hex');
  const newFileName = `${randomName}.${extension}`;

  const githubToken = process.env.GITHUB_TOKEN;
  const repoOwner = 'Yudzxml';
  const repoName = 'Uploader';
  const branch = 'main';
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${newFileName}`;

  try {
    await axios.put(url, {
      message: 'Upload file buffer',
      content: content,
    }, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'File berhasil diupload ke GitHub',
      fileName: newFileName,
      url: `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${newFileName}`
    });

  } catch (err) {
    return res.status(500).json({
      error: 'Gagal upload ke GitHub',
      detail: err.response?.data || err.message,
    });
  }
};
