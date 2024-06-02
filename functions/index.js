const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.scheduledFunction = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async (context) => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);

    const classesRef = db.collection("classes");
    const snapshot = await classesRef
      .where("endTime", "<=", fiveMinutesAgo.toISOString())
      .get();

    if (snapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    snapshot.forEach((doc) => {
      console.log("Deleting class:", doc.id, " - ", doc.data().subject);
      doc.ref
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    });

    return null;
  });
