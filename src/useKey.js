import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(() => {
    function callback(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }
    document.addEventListener("keydown", callback);

    // CLEANUP FUNCTION IS BELOW
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [action, key]);
}
