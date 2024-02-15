import {addDoc as _addDoc, setDoc as _setDoc, doc, getDoc as _getDoc, collection, getDocs} from 'firebase/firestore';
import {
   createUserWithEmailAndPassword,
   sendEmailVerification,
   signInWithEmailAndPassword,
   updateProfile,
   signOut
} from 'firebase/auth';
import {auth, db} from '../firebase/config';

export const getDoc = async (collectionName: string, docId: string) => {
   const docRef = doc(db, collectionName, docId);
   const docSnap = await _getDoc(docRef);

   if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
   } else {
      console.log("No such document!");
      return null;
   }
}

export const getAllDocs = async (collectionName: string) => {
   const querySnapshot = await getDocs(collection(db, collectionName));
   return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) );
}

export const setDoc = async (collectionName: string, docId: string, data: any) => {
   return _setDoc(doc(db, collectionName, docId), data, {merge: true});
};

export const addDoc = (collectionName: string, data: any) => {
   return _addDoc(collection(db, collectionName), data);
}

export const signup = async (email: string, password: string, additionalData: Partial<{password: string, repeatPassword: string, name: string}>) =>
   createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
         const user = userCredential.user;

         // ! do not store passwords in Firestore
         delete additionalData.password;
         delete additionalData.repeatPassword;

         await updateProfile(user, { displayName: additionalData.name });
         await sendEmailVerification(user);
         await setDoc('users', user.uid, {
            uid: user.uid,
            ...additionalData,
            created: new Date().getTime()
         });

         return { email, password };
      })
      .catch((error) => {
         const errorCode = error.code;
         const errorMessage = error.message;
         console.log('could not sign user up');
         console.log(errorCode);
         return {errorCode, errorMessage};
      });

export const login = async (email: string, password: string) => {
   return signInWithEmailAndPassword(auth, email, password);
}

export const signout = async () => {
   try {
      await signOut(auth);
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
      window.location.href = '/';
   } catch (err) {
      console.log(err);
      alert('There was an error while logging you out. Please refresh your browser and try again.');
   }
}
