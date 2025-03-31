// dùng với Firebase

const firebaseConfig = {
  apiKey: "AIzaSyBqrofn0JbDu56BxcbyNv_zNdzVp0boxOk",
  authDomain: "phanngo-824a4.firebaseapp.com",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("message").innerText = `Chào, ${user.email}!`;
  } else {
    document.getElementById("message").innerText = "Bạn chưa đăng nhập.";
  }
});

function logout() {
  auth.signOut().then(() => {
    window.location.reload();
  });
}
