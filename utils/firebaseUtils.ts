import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export const checkIfUserExists = async (id: any, type = "user_id") => {
  const q = query(collection(db, "users"), where(type, "==", id));
  const docSnap = await getDocs(q);

  if (docSnap.size > 0) {
    return true;
  } else {
    return false;
  }
};

export const addNewUser = async (data: any) => {
  const docRef = await addDoc(collection(db, "users"), data);
  return docRef.id;
};

export const getUserDocs = async (id: any) => {
  const q = query(collection(db, "users"), where("user_id", "==", id));

  const querySnapshot = await getDocs(q);
  let snap;
  querySnapshot.forEach((doc) => {
    snap = doc.data();
  });
  return snap;
};

export const updateUserDocs = async (
  id: any,
  data: any,
  spaceId: any,
  allData: any,
  lastId?: number
) => {
  const q = query(collection(db, "users"), where("user_id", "==", id));

  const userDocs = await getDocs(q);
  if (userDocs.size > 0) {
    const userDoc = doc(collection(db, "users"), userDocs.docs[0].id);
    let newData = allData.tasks.filter((i: any) => {
      if (i.space_id === spaceId) {
        i.tasks = data;
        i.last_id = lastId || i.last_id
      }
      return i;
    });
    await updateDoc(userDoc, { tasks: newData });
  } else {
    console.log("No matching documents!");
  }
};

export const updateSpaces = async (id: any, data: any) => {
  const q = query(collection(db, "users"), where("user_id", "==", id));
  const userDocs = await getDocs(q);
  if (userDocs.size > 0) {
    const userDoc = doc(collection(db, "users"), userDocs.docs[0].id);
    await updateDoc(userDoc, { tasks: data });
  } else {
    console.log("No matching documents!");
  }
};

export const mapAuthCodeToMessage = (authCode: any) => {
  switch (authCode) {
    case "auth/invalid-password":
      return "Password provided is not correct";

    case "auth/invalid-email":
      return "Email provided is invalid";

    case "auth/user-not-found":
      return "User not found";

    case "auth/wrong-password":
      return "Password provided is not correct";
    
    case "auth/email-already-in-use":
      return "Email already in use";

    default:
      return authCode;
  }
};
