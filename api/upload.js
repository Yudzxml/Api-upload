const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { fileName, content } = req.body;

  if (!fileName || !content) {
    return res.status(400).json({ error: 'fileName dan content (base64) wajib diisi' });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const repoOwner = 'Yudzxml';
  const repoName = 'Uploader';
  const branch = 'main';
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`;

  try {
    // Cek apakah file sudah ada (ambil SHA kalau update)
    let sha = null;
    try {
      const getRes = await axios.get(url, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      sha = getRes.data.sha;
    } catch (_) {}

    // Upload ke GitHub
    await axios.put(url, {
      message: 'Upload file buffer',
      content: content,
      ...(sha && { sha }),
    }, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'File berhasil diupload ke GitHub',
      url: `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${fileName}`
    });

  } catch (err) {
    return res.status(500).json({
      error: 'Gagal upload ke GitHub',
      detail: err.response?.data || err.message,
    });
  }
};
