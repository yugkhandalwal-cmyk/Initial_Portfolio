Portfolio assets (paths are configured in src/data.js):
  projects/photo.jpg            -> portrait
  projects/Yug_Khandelwal.docx  -> downloadable CV
  projects/web3.png             -> MumbaiToken screenshot
  projects/mumbaifund.jpg       -> MumbaiFund screenshot
  certs/certs1.jpg              -> C++ Programming Fundamentals
  certs/certs2.jpg              -> Programming for Everybody
  certs/certs3.png              -> GenAI for Everyone
  certs/certs4.jpg              -> Computer Programming

The Retail Business OS project has no screenshot yet, so the portfolio displays
a designed title card instead of a broken image.

For local contact-form testing, copy .env.example to .env and enter a Gmail
address, a Google App Password, and the inbox that should receive messages.
The Vite development server runs the contact API locally. Add the same variables
to your hosting provider's server-side environment settings for deployment.

Each valid form submission sends a styled notification to OWNER_EMAIL and a
styled confirmation with your bio, highlights, profile links, and a plain-text
alternative to the visitor. If a visitor doesn't see the confirmation, check
Spam/Promotions and verify their email address. Updating .env locally takes
effect on the next contact request.
