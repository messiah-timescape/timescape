import user from "../controllers/user/index";

const CheckAuth = async () => {
  const routeRedirect = window.document.createElement("ion-route-redirect");

  routeRedirect.setAttribute("from", "*");
  routeRedirect.setAttribute("to", "/login");

  console.log("ASD");
  let result = await user.get_user();
  if (!result) {
    let url = window.location.href.split("/");
    url[3] = "login";
    window.location.href = url.join("/");
  }
};

export default CheckAuth;
