import { uploadFileToGemini } from './services/geminiService';

async function test() {
  const file = new File(['hello world'], 'test.txt', { type: 'text/plain' });
  try {
    const res = await uploadFileToGemini(file);
    console.log('Upload success:', res);
  } catch (e) {
    console.error('Upload failed:', e);
  }
}
test();
