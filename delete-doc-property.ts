import { firestore } from "firebase-admin";
import { db } from "../admin";

export const deletePropertyFromSingleDoc = async (collection: string, docId: string, fieldName: string) => {
    db.collection(collection).doc(docId).set({
        [fieldName]: firestore.FieldValue.delete()
    }, { merge: true });
};

export const deletePropertyFromAllDocs = async (collection: string, fieldName: string) => {
    const allDocsSnapshot = await db.collection(collection).get();

    for await (const doc of allDocsSnapshot.docs) {
        await db.doc(`${collection}/${doc.id}`).set({
            [fieldName]: firestore.FieldValue.delete()
        }, { merge: true });
    }
};
