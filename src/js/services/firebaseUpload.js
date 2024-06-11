import { getStorage, ref, uploadBytes } from "firebase/storage";

async function uploadToFirebase(file, path) {
  console.log({ file, path });
  let downloadURL = "";
  const storage = getStorage();
  const storageRef = ref(storage, `${path}/${file.name}`);
  const metadata = {
    contentType: file.type,
  };

  await uploadBytes(storageRef, file, metadata).then(() => {
    downloadURL = `https://firebasestorage.googleapis.com/v0/b/badmintonposecounter.appspot.com/o/${path}%2F${file.name}?alt=media`;
    console.log("Uploaded a blob or file!");
  });
  return downloadURL;
}

export { uploadToFirebase };
