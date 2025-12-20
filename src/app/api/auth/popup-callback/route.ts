import { auth } from "@/modules/auth";
import { NextRequest, NextResponse } from "next/server"

/**
 * Popup callback route for OAuth authentication
 * This route is loaded in the popup after OAuth redirect and
 * posts a message to the opener window to complete the flow
 */
export async function GET(req: NextRequest) {
  const session = await auth()
  const returnTo = req.nextUrl.searchParams.get("returnTo") || "/"

  // Generate an HTML page that posts message to opener and closes
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Authentication Complete</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #f9fafb;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e5e7eb;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    p {
      color: #6b7280;
      margin: 0;
    }
  </style>
</head>
<body>
  <div className="container">
    <div className="spinner"></div>
    <p>Completing authentication...</p>
  </div>
  <script>
    (function() {
      const result = {
        type: 'auth-popup-complete',
        success: ${session ? "true" : "false"},
        ${session ? "" : 'error: "Authentication failed",'}
        callbackUrl: ${JSON.stringify(returnTo)}
      };
      
      if (window.opener) {
        window.opener.postMessage(result, window.location.origin);
        setTimeout(function() {
          window.close();
        }, 100);
      } else {
        // No opener, redirect directly
        window.location.href = ${JSON.stringify(returnTo)};
      }
    })();
  </script>
</body>
</html>
`

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
