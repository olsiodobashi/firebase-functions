export const addMany = async (collection: string, data: any[], idKey = 'id') => {
    console.log(`Saving data in collection "${collection}"`);
  
    for (const item of data) {
        if (item[idKey]) {
            await db.doc(`${collection}/${item[idKey]}`).set(
                JSON.parse(
                    JSON.stringify(item)
                ), { merge: true }
            );
        } else {
            await db.collection(collection).add(
                JSON.parse(
                    JSON.stringify(item)
                )
            );
        }
    }
}
