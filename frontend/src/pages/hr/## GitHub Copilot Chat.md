## GitHub Copilot Chat

- Extension: 0.40.1 (prod)
- VS Code: 1.112.0 (07ff9d6178ede9a1bd12ad3399074d726ebe6e43)
- OS: win32 10.0.26200 x64
- GitHub Account: vamsivalluri-19

## Network

User Settings:
```json
  "http.systemCertificatesNode": true,
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: Error (28 ms): getaddrinfo ENOTFOUND api.github.com
- DNS ipv6 Lookup: Error (1 ms): getaddrinfo ENOTFOUND api.github.com
- Proxy URL: None (1 ms)
- Electron fetch (configured): Error (2 ms): Error: net::ERR_INTERNET_DISCONNECTED
    at SimpleURLLoaderWrapper.<anonymous> (node:electron/js2c/utility_init:2:10684)
    at SimpleURLLoaderWrapper.emit (node:events:519:28)
    at SimpleURLLoaderWrapper.emit (node:domain:489:12)
  [object Object]
  {"is_request_error":true,"network_process_crashed":false}
- Node.js https: Error (15 ms): Error: getaddrinfo ENOTFOUND api.github.com
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26)
- Node.js fetch: Error (17 ms): TypeError: fetch failed
    at node:internal/deps/undici/undici:14902:13
    at processTicksAndRejections (node:internal/process/task_queues:105:5)
    at n._fetch (c:\Users\VAMSI VALLURI\.vscode\extensions\github.copilot-chat-0.40.1\dist\extension.js:5104:5227)
    at n.fetch (c:\Users\VAMSI VALLURI\.vscode\extensions\github.copilot-chat-0.40.1\dist\extension.js:5104:4539)
    at u (c:\Users\VAMSI VALLURI\.vscode\extensions\github.copilot-chat-0.40.1\dist\extension.js:5136:186)
    at dg._executeContributedCommand (file:///c:/Users/VAMSI%20VALLURI/AppData/Local/Programs/Microsoft%20VS%20Code/07ff9d6178/resources/app/out/vs/workbench/api/node/extensionHostProcess.js:494:48675)
  Error: getaddrinfo ENOTFOUND api.github.com
      at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26)

Connecting to https://api.githubcopilot.com/_ping:
- DNS ipv4 Lookup: Error (1 ms): getaddrinfo ENOTFOUND api.githubcopilot.com
- DNS ipv6 Lookup: Error (0 ms): getaddrinfo ENOTFOUND api.githubcopilot.com
- Proxy URL: None (27 ms)
- Electron fetch (configured): Error (12 ms): Error: net::ERR_INTERNET_DISCONNECTED
    at SimpleURLLoaderWrapper.<anonymous> (node:electron/js2c/utility_init:2:10684)
    at SimpleURLLoaderWrapper.emit (node:events:519:28)
    at SimpleURLLoaderWrapper.emit (node:domain:489:12)
  [object Object]
  {"is_request_error":true,"network_process_crashed":false}
- Node.js https: Error (12 ms): Error: getaddrinfo ENOTFOUND api.githubcopilot.com
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26)
- Node.js fetch: Error (17 ms): TypeError: fetch failed
    at node:internal/deps/undici/undici:14902:13
    at processTicksAndRejections (node:internal/process/task_queues:105:5)
    at n._fetch (c:\Users\VAMSI VALLURI\.vscode\extensions\github.copilot-chat-0.40.1\dist\extension.js:5104:5227)
    at n.fetch (c:\Users\VAMSI VALLURI\.vscode\extensions\github.copilot-chat-0.40.1\dist\extension.js:5104:4539)
    at u (c:\Users\VAMSI VALLURI\.vscode\extensions\github.copilot-chat-0.40.1\dist\extension.js:5136:186)
    at dg._executeContributedCommand (file:///c:/Users/VAMSI%20VALLURI/AppData/Local/Programs/Microsoft%20VS%20Code/07ff9d6178/resources/app/out/vs/workbench/api/node/extensionHostProcess.js:494:48675)
  Error: getaddrinfo ENOTFOUND api.githubcopilot.com
      at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26)

Connecting to https://copilot-proxy.githubusercontent.com/_ping:
- DNS ipv4 Lookup: Error (2 ms): getaddrinfo ENOTFOUND copilot-proxy.githubusercontent.com
- DNS ipv6 Lookup: Error (1 ms): getaddrinfo ENOTFOUND copilot-proxy.githubusercontent.com
- Proxy URL: None (5 ms)
- Electron fetch (configured): Error (2 ms): Error: net::ERR_INTERNET_DISCONNECTED
    at SimpleURLLoaderWrapper.<anonymous> (node:electron/js2c/utility_init:2:10684)
    at SimpleURLLoaderWrapper.emit (node:events:519:28)
    at SimpleURLLoaderWrapper.emit (node:domain:489:12)
  [object Object]
  {"is_request_error":true,"network_process_crashed":false}
- Node.js https: Error (10 ms): Error: getaddrinfo ENOTFOUND copilot-proxy.githubusercontent.com
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26)
- Node.js fetch: Error (17 ms): TypeError: fetch failed
    at node:internal/deps/undici/undici:14902:13
    at processTicksAndRejections (node:internal/process/task_queues:105:5)
    at n._fetch (c:\Users\VAMSI VALLURI\.vscode\extensions\github.copilot-chat-0.40.1\dist\extension.js:5104:5227)
    at n.fetch (c:\Users\VAMSI VALLURI\.vscode\extensions\github.copilot-chat-0.40.1\dist\extension.js:5104:4539)
    at u (c:\Users\VAMSI VALLURI\.vscode\extensions\github.copilot-chat-0.40.1\dist\extension.js:5136:186)
    at dg._executeContributedCommand (file:///c:/Users/VAMSI%20VALLURI/AppData/Local/Programs/Microsoft%20VS%20Code/07ff9d6178/resources/app/out/vs/workbench/api/node/extensionHostProcess.js:494:48675)
  Error: getaddrinfo ENOTFOUND copilot-proxy.githubusercontent.com
      at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26)

Connecting to https://mobile.events.data.microsoft.com: Error (2 ms): Error: net::ERR_INTERNET_DISCONNECTED
    at SimpleURLLoaderWrapper.<anonymous> (node:electron/js2c/utility_init:2:10684)
    at SimpleURLLoaderWrapper.emit (node:events:519:28)
    at SimpleURLLoaderWrapper.emit (node:domain:489:12)
  [object Object]
  {"is_request_error":true,"network_process_crashed":false}
Connecting to https://dc.services.visualstudio.com: Error (2 ms): Error: net::ERR_INTERNET_DISCONNECTED
    at SimpleURLLoaderWrapper.<anonymous> (node:electron/js2c/utility_init:2:10684)
    at SimpleURLLoaderWrapper.emit (node:events:519:28)
    at SimpleURLLoaderWrapper.emit (node:domain:489:12)
  [object Object]
  {"is_request_error":true,"network_process_crashed":false}
Connecting to https://copilot-telemetry.githubusercontent.com/_ping: Error (12 ms): Error: getaddrinfo ENOTFOUND copilot-telemetry.githubusercontent.com
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26)
Connecting to https://copilot-telemetry.githubusercontent.com/_ping: Error (10 ms): Error: getaddrinfo ENOTFOUND copilot-telemetry.githubusercontent.com
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26)
Connecting to https://default.exp-tas.com: Error (10 ms): Error: getaddrinfo ENOTFOUND default.exp-tas.com
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26)

Number of system certificates: 102

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).