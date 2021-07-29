import { db } from "../admin";

export const updatePropertyForSingleDoc = async <T>(collection: string, docId: string, fieldName: string, newValue: T) => {
    db.collection(collection).doc(docId).set({
        [fieldName]: newValue
    }, { merge: true });
};

export const updatePropertyForAllDocs = async <T>(collection: string, fieldName: string, newValue: T) => {
    const allDocsSnapshot = await db.collection(collection).get();

    for await (const doc of allDocsSnapshot.docs) {
        await db.doc(`${collection}/${doc.id}`).set({
            [fieldName]: newValue
        }, { merge: true });
    }
};
