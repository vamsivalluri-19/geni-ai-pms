Google Custom Search Setup

This project supports a live web fallback using Google Custom Search (Programmable Search Engine).

Required environment variables (add to backend/.env):

- GOOGLE_SEARCH_API_KEY — Google API key with Custom Search enabled.
- GOOGLE_CSE_ID — Your Custom Search Engine ID (cx).

How to get them:

1. Create a Google Cloud project at https://console.cloud.google.com/.
2. Enable the "Custom Search API" (or "Custom Search JSON API") for the project.
3. Create an API key under APIs & Services > Credentials and copy it to `GOOGLE_SEARCH_API_KEY`.
4. Create a Programmable Search Engine at https://programmablesearchengine.google.com/ and configure it to search the web (set Sites to search to `*.com` or leave blank for web). Copy the Search Engine ID to `GOOGLE_CSE_ID`.

Restart the backend server after adding variables.

Notes:
- This is used as a last-resort fallback when the built-in Gemini model and knowledge base cannot answer.
- Usage may be billed by Google; monitor quota in Google Cloud Console.
