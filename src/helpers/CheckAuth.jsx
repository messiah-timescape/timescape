import user from "../controllers/user/index";

const CheckAuth = () => {
  // const router = window.document.querySelector("ion-router-outlet");
  const routeRedirect = window.document.createElement("ion-route-redirect");

  routeRedirect.setAttribute("from", "*");
  routeRedirect.setAttribute("to", "/login");

  user.get_user().then(function(result) {
    // console.log(result, router, routeRedirect);
    if (!result) {
      let url = window.location.href.split("/");
      url[3] = "login";
      window.location.href = url.join("/");
    }
  });
};

export default CheckAuth;
