const updateData = async (authorId) => {
    let authorDpArray = [];
    if(authorId){
      const posts = query(collection(db, 'posts'), where('authorId', '==', authorId))
      const postSnapshot = await getDocs(posts)
      postSnapshot.forEach((doc) => {
        console.log(doc.id, "posts", ' => ', doc.data());
        console.log("lucille", "=>", doc.data().authorDp);

      //   if (doc.data().authorDp) {
      //     authorDpArray.push({ authorDp: doc.data().authorDp, date: doc.data().createdAt, user: doc.data().authorName });
      //   }
      //   console.log('ada', "=>", authorDpArray);
      // })
      // authorDpArray.sort((a, b) => new Date(a.date) - new Date(b.date));
      // let closestAuthorDp = authorDpArray[0]?.authorDp;

      // postSnapshot.forEach((postDoc) => {
      //   let authorDp = postDoc.data().authorDp;
      //   console.log("working on ...", authorDpArray[0]?.user);
      //   if (authorDp && authorDp !== closestAuthorDp) {
      //     updateDoc(doc(db, 'posts', postDoc.id), { authorDp: authorDpArray[0]?.authorDp })
      //     .then(() => {
      //       console.log('Changed dp', "=>", authorDpArray[0]?.authorDp);
      //     })
      //     .catch((error) => {
      //       console.error("Error updating document: ", error);
      //     });
      //   }
      });
    }
}

const fetchAllPosts = async () => {
  let temp = []
  try{
    setLoading(true)
    
    const querySnapshot = await getDocs(collection(db, "posts"));
    console.log("snap", "=>", querySnapshot.empty);
    console.log(querySnapshot.docs.length);
    if(querySnapshot.empty){setLoading(false); return}
    for (let i = 0; i < querySnapshot.docs.length; i++){
      const doc = querySnapshot.docs[i]
      console.log(i, ' i');
      console.log(doc.id, doc, " => ", doc.data());
      fetchAuthorData(doc.data().authorId)
      .then((result)=>{
        let userData = {...result[0]}
        result[0] && temp.push({id:doc.id, authorData: userData,  ...doc.data()})
        console.log("Temp data", "=>" , temp);
        result[0] && temp && console.log("All data", "=>" , data);
        result[0] && setData([...temp]);
        console.log(temp[i].authorId, 'temp authoid', i);
  
        setLoading(false)
      })
      console.log(doc, "=>", doc);
  };
  }catch (err) {
    console.error(err);
  }
  return data
  // Set all authorDp to the closest one with a non-empty value
}


// snapshot

useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "posts"), (unSubDoc) => {
    let temp = []
    try{
      console.log(unSubDoc);
      setEmpty(unSubDoc.empty)
        setLoading(true)
        console.log(loading);
        unSubDoc.docs.forEach((singleDoc) => {
          const doc = singleDoc.data()
          fetchAuthorData(doc.authorId)
          .then((result)=>{
            let userData = {...result[0]}
            result[0] && temp.push({id:singleDoc.id, authorData: userData,  ...doc})
            // result[0] && temp && console.log("All data", "=>" , data);
            result[0] && setData([...temp]);
          })
          setLoading(false)
      });
    }catch (err) {
      console.error(err);
    }
})
  

  return () => {
    unsubscribe()
    console.log('Unsubscribed');
  }
}, [])