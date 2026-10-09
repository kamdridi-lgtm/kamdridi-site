import { list } from '@vercel/blob';

async function checkBlob() {
  process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_RwBLgWqQoLnfzWve_ALBmP0dtCaMZw2cpBNftxost2UBe3u";
  try {
    const { blobs } = await list();
    let totalSize = 0;
    blobs.forEach(b => {
      totalSize += b.size;
      console.log(`- ${b.pathname} (${(b.size / 1024 / 1024).toFixed(2)} MB)`);
    });
    console.log(`Total blobs: ${blobs.length}`);
    console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  } catch (err) {
    console.error("Error:", err);
  }
}

checkBlob();
