const functions = require("firebase-functions");
const app = require("express")();
const { db } = require("./util/admin");
const { validateSignupData, validateLoginData } = require("./util/validators.js");
const firebase = require("firebase");
const config = require("./util/config");
firebase.initializeApp(config);

// get all screams
app.get("/screams", (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          ...doc.data()
        });
      });
      return res.json(screams);
    })
    .catch(err => console.error(err));
});

// post a scream
app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };
  
  db.collection("screams")
    .add(newScream)
    .then(doc => {
      res.json({ message: `Document ${doc.id} created successfully.` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong." });

      console.error(err);
    });
});

// Signup route
app.post("/signup", (req, res) => {
  const { email, password, confirmPassword, handle } = req.body
  const newUser = {
    email,
    password,
    confirmPassword,
    handle
  };
  
  const { valid, errors } = validateSignupData(newUser)
  if (!valid) return res.status(400).json(errors);

  // validate data
  let token, userId;
  db.doc(`/users/${handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: "This handle is already taken."})
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);
      }
    })
    // return access token if validation pass
    .then(({ user }) => {
      userId = user.uid;
      return user.getIdToken();
    })
    .then(accessToken => {
      token = accessToken;
      const userCredentials = {
        handle,
        email,
        createdAt: new Date().toISOString(),
        userId
      };
      return db.doc(`/users/${handle}`).set(userCredentials)
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" })
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

// log user in
app.post("/login", (req, res) => {
  const { email, password } = req.body
  const user = {
    email,
    password
  }
  // validate user info
  const { valid, errors } = validateLoginData(user)
  if (!valid) return res.status(400).json(errors);

  // if no error, log user in
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      return user.getIdToken();
    })
    .then(token => {
      return res.json({ token })
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res.status(400).json({ general: "Wrong password. Please try again." })
      } else if (err.code === "auth/user-not-found") {
        return res.status(400).json({ general: "User not found." })
      } else {
        return res.status(500).json({ error: err.code })
      }
    })
})
exports.api = functions.region("us-central1").https.onRequest(app);
