const TOKEN_STORAGE_KEY = "accessToken";

let accessToken =
  typeof window !== "undefined"
    ? window.localStorage.getItem(TOKEN_STORAGE_KEY)
    : null;

const tokenService = {
  getToken: () => accessToken,
  setToken: (token) => {
    accessToken = token;

    if (typeof window === "undefined") return;

    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      return;
    }

    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};

export default tokenService;
