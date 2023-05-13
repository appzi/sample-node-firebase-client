import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "",
  authDomain: "portal.appzi.io",
  projectId: "appzi-portal",
};

const portalId = "shortId";
const surveyId = "longId";
const email = "";
const password = "";

const go = async (): Promise<void> => {
  const app = initializeApp(firebaseConfig);
  const appziAuth = getAuth(app);
  const authResult = await signInWithEmailAndPassword(
    appziAuth,
    email,
    password
  );

  const headers = new Headers();
  const bearerToken = await authResult.user?.getIdToken();

  headers.set("Authorization", `Bearer ${bearerToken}`);
  headers.set("accept", "application/json");
  headers.set("content-type", "application/json");

  const feedbackResponse = await fetch(
    `https://portal.api.appzi.io/api/portals/${portalId}/feedback`,
    {
      method: "POST",
      body: JSON.stringify({
        configId: surveyId,
        pageNumber: 0,
        pageSize: 25,
        filters: {
          labelValues: [],
          blockIdValues: [],
          tags: [],
          clientMeta: [],
        },
      }),
      headers,
    }
  );
  try {
    const feedbackResponseJson = await feedbackResponse.json();

    console.warn(feedbackResponseJson);
  } catch (error) {
    console.error(error);
  }
};

go().then(() => {
  console.log("done");
  process.exit(0);
});
