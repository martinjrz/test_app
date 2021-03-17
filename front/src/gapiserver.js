export const gapisetup = () => {
  return new Promise((resolve, reject) => {
    return window.gapi.load("auth2", () => {
      window.gapi.auth2
        .init({
          client_id:
            "262576652815-te31jdsgf459fu8j931mtphgv3t2ng85.apps.googleusercontent.com",
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
