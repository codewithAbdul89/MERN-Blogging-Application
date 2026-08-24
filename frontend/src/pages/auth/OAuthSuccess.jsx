import { useEffect } from "react";

function OAuthSuccess() {
  useEffect(() => {
    // window.opener the window that open the popup

    if (window.opener) {
    //  "Was this window (popup window) opened by another window, and do I have a reference to that opener (main window)?"

      window.opener.postMessage(
        {
          type: "OAUTH_SUCCESS",
        },
        window.location.origin,
      );

      window.close();//here window mean the popup window
    }
  }, []);

  return <div>Login successful...</div>;
}

export default OAuthSuccess;
