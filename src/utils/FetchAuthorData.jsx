import React from 'react'
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const fetchAuthorData = async (id) => {
    const userRef = doc(db, "users", id);
    const userSnap = await getDoc(userRef);
    let temp = []

    if (userSnap.exists()) {
      temp.push(userSnap.data())
    } else {
      // userSnap.data() will be undefined in this case
      console.log("No such document!");
    }

    // console.log(temp);
    return temp
}

export default fetchAuthorData