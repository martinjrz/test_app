export const gapisetup = () => {
  return new Promise((resolve, reject) => {
    return window.gapi.load("auth2", () => {
      window.gapi.auth2
        .init({
          client_id:
            "1090207276654-b6qp5cl7plo37heaj8qkutqrn0lj92ce.apps.googleusercontent.com",
          cookiepolicy: "single_host_origin",
        })
        .then((res) => {
          if (res) {
            resolve(window.gapi);
          } else reject(null);
        });
    });
  });
};

export const scriptsetup = () => {
  const script = document.createElement("script");
  script.src = "https://apis.google.com/js/platform.js";
  return script;
};
