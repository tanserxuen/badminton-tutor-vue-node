import { getStorage, ref, uploadBytes } from "firebase/storage";

async function uploadToFirebase(file, path) {
  console.log({ file, path });
  let downloadURL = "";
  const storage = getStorage();
  const fileName = file.name;
  const storageRef = ref(storage, `${path}/${fileName}`);
  const metadata = {
    contentType: file?.type ?? "image/png",
  };

  await uploadBytes(storageRef, file, metadata).then(() => {
    downloadURL = `https://firebasestorage.googleapis.com/v0/b/badmintonposecounter.appspot.com/o/${path}%2F${fileName}?alt=media`;
    console.log("Uploaded a blob or file!");
  });
  return downloadURL;
}

// not working
async function uploadStringToFirebase(string, path) {
  let downloadURL = "";
  const storage = getStorage();
  const fileName = (Math.random() * 1000).toString();
  const storageRef = ref(storage, `${path}/${fileName}`);
  const metadata = {
    contentType: "image/png",
  };

  await uploadBytes(storageRef, string, metadata).then(() => {
    console.log(string, fileName, path, metadata);
    downloadURL = `https://firebasestorage.googleapis.com/v0/b/badmintonposecounter.appspot.com/o/${path}%2F${fileName}?alt=media`;
    console.log("Uploaded a string!", downloadURL);
  });
  return downloadURL;
}

export { uploadToFirebase, uploadStringToFirebase };
