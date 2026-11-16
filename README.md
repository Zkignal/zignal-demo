# Zignal iOS browser demo

**Live:** https://zkignal.github.io/zignal-demo/experience.html

A standalone, static browser simulation of the [Zignal](https://github.com/Zkignal/zignal)
iOS app. It is a visual and educational preview, **not the Zignal app**, and not a
working messaging or wallet service.

## What it is for

Visitors can walk through an iOS-style flow and read how the real app describes its
messaging protocol, privacy model, network trade-offs and roadmap. It explains what
makes Zignal different from an ordinary Zcash wallet memo without implying that any
encryption or security runs in the browser.

The site labels every simulated area and never asks for PINs, recovery phrases,
credentials or personal information. It makes no claim that Zignal is unbreakable
or anonymous. The real app describes itself as experimental and unaudited.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Entry point; redirects to the experience. |
| `experience.html` | Interactive phone preview, plus the technology, privacy, network and roadmap explanations. |
| `experience.css` | Phone UI, page styling and responsive layouts. |
| `experience.js` | Local screen navigation, sample messages, fictional profiles and illustrative controls. |

## What you can try

- **Welcome and setup:** informational screens for the three PINs and recovery.
  No PIN or recovery input is collected.
- **Chats:** switch between fictional main and decoy profiles and exchange sample
  messages with local scripted contacts. Replies match topics such as greetings,
  invites, Tor, Prepare, wallet fees and the simulation's limits; anything else gets
  a labelled echo. This is not AI. Messages are shown as text and never sent.
  A separate walkthrough shows an interrupted send going through checking, sent,
  delivered and retry, using a fictional transaction.
- **Invites and contacts:** a deliberately non-scannable QR-style pattern that
  encodes nothing, and a built-in sample invite that adds a fictional contact.
  No camera, clipboard, real invite or wallet address is used. The contact details
  switch changes only a visual mark; no identity is verified.
- **Wallet:** fictional balances and the Prepare, Confirming and Ready steps,
  advanced by a button. No funding address, payment QR code, payment or real balance.
- **Recovery:** recording-hidden and screenshot-warning states with placeholder text.
  No words are generated; no capture is detected or blocked.
- **Network:** an illustrative Tor switch. It configures no VPN, Tor, server or connection.

No third-party packages, analytics, backend or browser storage. Demo data lives in
page memory and resets on reload. The only outside links go to the Zignal repository
documentation and the lightwalletd project.

## The real app, as its documentation describes it

Summarized from the Zignal repository's `dev` branch at
[`e7bd418`](https://github.com/Zkignal/zignal/tree/e7bd41866dcb35eccb38ac5d49c950add274fe27).
None of this runs in the demo.

- Every message is one shielded Zcash transaction. Zignal adds an end-to-end messaging
  protocol on top of Zcash's memo encryption.
- The first handshake is a hybrid of X25519 and ML-KEM-768, followed by a Double Ratchet.
- Contacts are added with single-use invites and can compare safety numbers. ZEC pays
  the network fees.
- An unlock PIN opens the main profile, a duress PIN opens a decoy, and a panic PIN
  erases the real profile on the phone and then opens the decoy. These are
  experimental features, not guarantees.
- The light server you choose sees your network requests. With Tor on, sending and
  fetching go over Tor; syncing (block downloads, tree states and subtree roots) still
  connects directly. Your own server or a VPN changes who sees connection metadata,
  but neither makes anyone anonymous by itself.

### Cryptography caveats

Post-quantum protection for every message is future work; today the post-quantum part
is in the first handshake. The first message's forward secrecy relies on rotating
signed prekeys; one-time prekeys are planned. Message timing, fees and approximate
message length can reveal information.

These are the project's own descriptions, not an independent security assessment.
Read the
[security notes](https://github.com/Zkignal/zignal/blob/e7bd41866dcb35eccb38ac5d49c950add274fe27/README.md#security-notes-and-known-limitations)
and the current source before relying on any security claim.

## Run locally

No build step or install. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8765/experience.html` and stop the server with Ctrl+C.
Choose **Skip to unlocked demo**, open **Demo contact**, and try "Hello",
"What is Prepare?" or "How does Tor work?". For a second conversation, choose
**New chat > Scan or paste an invite > Use sample invite**. Reload to reset everything.

## Scope

This is not a port, protocol implementation or security test of Zignal. It does not:

- connect to Zcash, a blockchain, lightwalletd, a VPN, Tor or any other server;
- generate or encrypt messages, use cryptographic primitives or create keys;
- create a wallet, account, profile, PIN, invite, safety number or recovery phrase;
- send or receive payments, funds, messages or network requests;
- provide real duress, panic-wipe, privacy, anonymity or security protections.

Never use the preview with real funds or secrets.
