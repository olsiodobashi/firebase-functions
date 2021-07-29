import { firestore } from "firebase-admin";

/**
 * Create smaller chunks out of the large response and asynchronously update documents
 */
export const updateHugeNumberOfDocs = async (querySnapshot: firestore.QuerySnapshot, chunkSize = 10000) => {
    console.log(`Starting query -> ${new Date()}`);

    let i, j, chunkedArray;
    for (i = 0, j = querySnapshot.size; i < j; i += chunkSize) {
        console.log(`Starting batch ${i} -> ${new Date()}`);
        chunkedArray = querySnapshot.docs.slice(i, i + chunkSize);
        await Promise.all(
            chunkedArray.map(doc => doc.ref.set({
                // some field
            }, { merge: true }))
        );
        console.log(`Batch done -> ${new Date()}`);
    }

    console.log(`Done updating documents -> ${new Date()}`);
};
