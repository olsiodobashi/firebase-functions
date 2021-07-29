import { firestore } from "firebase-admin";

/**
 * Create smaller chunks out of the large response and asynchronously update documents
 */
export const updateHugeNumberOfDocs = async (querySnapshot: firestore.QuerySnapshot, chunkSize = 10000) => {
    console.log(`Starting query -> ${new Date()}`);

    let i, j, temporary;
    for (i = 0, j = querySnapshot.size; i < j; i += chunkSize) {
        console.log(`Starting batch ${i} -> ${new Date()}`);
        temporary = querySnapshot.docs.slice(i, i + chunkSize);
        await Promise.all(
            temporary.map(doc => doc.ref.set({
                lastUpdated: new Date().getTime(),
                lastTraced: new Date().getTime()
            }, { merge: true }))
        );
        console.log(`Batch done -> ${new Date()}`);
    }

    console.log(`Done updating documents -> ${new Date()}`);
};
