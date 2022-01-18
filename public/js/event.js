// document.addEventListener(
//   "click",
//   function (event) {
//     if (!event.target.matches(".favorite")) return;
//     // event.preventDefault();
//     const { id } = event.target;
//     const url = "/advance/favorite/" + id;
//     fetch(url, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     }).then((res) => {
//       console.log("success");
//       document.location.href = "http://localhost:3007/advance";
//     });
//   },
//   false
// );
