import user from "../controllers/user/index";

const CheckAuth = () => {
  const routeRedirect = window.document.createElement("ion-route-redirect");

  routeRedirect.setAttribute("from", "*");
  routeRedirect.setAttribute("to", "/login");

  user.get_user().then(function (result) {
    if (!result) {
      let url = window.location.href.split("/");
      url[3] = "login";
      window.location.href = url.join("/");
    }
  });
};

export default CheckAuth;
