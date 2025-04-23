const axios = require('axios');
const crypto = require('crypto'); // built-in module untuk generate string acak

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { fileName, content } = req.body;

  if (!fileName || !content) {
    return res.status(400).json({ error: 'fileName dan content (base64) wajib diisi' });
  }

  // Ambil ekstensi file asli
  const extension = fileName.split('.').pop();

  // Generate nama acak (misal: v3c5gds.jpg)
  const randomName = crypto.randomBytes(4).toString('hex'); // hasil: 8 karakter acak
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
