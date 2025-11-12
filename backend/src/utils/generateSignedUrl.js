const supabase = require("../config/supabase");

/**
 * Creates a signed URL for a private Supabase Storage file.
 * Useful if your bucket is set to "private" instead of "public".
 *
 * @param {string} key - The file path inside the bucket
 * @param {number} expiresInSec - Expiry time in seconds (default: 300)
 * @returns {Promise<string>} signed URL
 */
async function generateSignedUrl(key, expiresInSec = 300) {
  try {
    const bucket = process.env.SUPABASE_BUCKET;

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(key, expiresInSec);

    if (error) {
      console.log("Error generating signed URL:", error);
      throw new Error(error.message);
    }

    return data.signedUrl;
  } catch (err) {
    console.log("Signed URL generation failed:", err);
    throw err;
  }
}

module.exports = generateSignedUrl;
