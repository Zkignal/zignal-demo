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

The site labels every simulated area and never asks for recovery phrases, credentials or
personal information. The only PINs it takes are three fictional demo PINs printed beside the
phone; anything else is a wrong PIN, and nothing typed is kept after a reload or sent. It
makes no claim that Zignal is unbreakable or anonymous. The real app describes itself as
experimental and unaudited.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Entry point; redirects to the experience. |
| `experience.html` | Interactive phone preview, plus the technology, privacy, network and roadmap explanations. |
| `experience.css` | Phone UI, page styling and responsive layouts. |
| `experience.js` | Local screen navigation, sample messages, fictional profiles and illustrative controls. |
| `img/` | 14 real screenshots of the Zignal app (see "Screenshots" below). |
| `CHANGELOG.md` | Every change to this site: what, why, and the source it was checked against. |

## What you can try

- **Welcome and setup:** the app's own text for the three PINs. "Create profiles" acts as a
  first install: it sets the demo PINs and makes two fictional profiles in page memory.
- **Lock and the three PINs:** the lock button opens the app's "Enter PIN" screen. Demo PINs:
  `111111` (unlock) opens the real profile, `222222` (duress) opens the decoy, and `333333`
  (panic) silently erases the real profile's chats, contacts and wallet from page memory and
  opens the decoy. After that the unlock PIN is a wrong PIN, and the duress and panic PINs
  both open the decoy, as in the app at `e7bd418`. 5 wrong PINs are free; after that each try
  waits, shortened for the demo to 5 seconds doubling up to 1 minute (the app: 30 seconds,
  doubling up to 1 hour). A successful unlock resets the count.
- **Demo controls (beside the phone):** the demo PINs, what is on screen, whether the real
  profile still exists, the wrong-PIN count, and "Reset demo (fresh install)". The real app
  never shows which profile is open; the panel exists only so visitors can see what the PINs did.
- **Chats:** the real or decoy profile, each with its own fictional wallet, and sample
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

## Screenshots

The "real app" section shows 14 unedited screenshots of the Zignal app, each captioned with
the build it comes from. Images 01 to 11 are the same files as `pics/` in the Zignal
repository; 12 to 14 are from the November 15 build. For the web they were only resized
(01 to 03, from 772 to 603 pixels wide) and re-saved without any file metadata (EXIF, XMP,
colour profile). Nothing in them was painted over or edited. Before publishing, every image was
checked for QR codes (none; the invite picture is a crop below the code), addresses,
transaction IDs, recovery words and notifications (none). The published files were made on
a Mac directly from the original screenshots, so no tool could add anything on the way, and
each holds only the PNG chunks IHDR, IDAT and IEND. Two show an older build: the
network settings list servers that changed on November 15, and the wallet button then read
"Prepare for chatting" (now "Prepare").

## How the phone simulation follows the app

The text on the simulated screens is taken from the app's SwiftUI source on `dev` at
[`e7bd418`](https://github.com/Zkignal/zignal/tree/e7bd41866dcb35eccb38ac5d49c950add274fe27)
(`SetupViews` including the `UnlockView` lock screen, `ChatViews`, `WalletViews`, `InviteViews`,
`RecoveryViews`, `ScreenCapture`), from `WalletSupport.swift` for the default servers, and from
`AppModel.unlock` and the README's "Duress and panic" section for what each PIN does. Where the
browser can't do what the app does (the PIN fields of setup, camera, QR codes, real balances,
encryption), the screen says so in its own words instead of imitating it. The wrong-PIN wait
is the one deliberate difference: shortened and labelled so visitors aren't stuck. See
`CHANGELOG.md` for each screen.

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
**New chat > Scan or paste an invite > Use sample invite**. To see the panic PIN, lock
(top left), enter `333333`, then lock again and enter `111111`. **Reset demo (fresh install)**
or a reload resets everything.

## Scope

This is not a port, protocol implementation or security test of Zignal. It does not:

- connect to Zcash, a blockchain, lightwalletd, a VPN, Tor or any other server;
- generate or encrypt messages, use cryptographic primitives or create keys;
- create a real wallet, account, invite, safety number or recovery phrase (the two profiles
  and the demo PINs are fictional and exist only in page memory);
- send or receive payments, funds, messages or network requests;
- provide real duress, panic-wipe, privacy, anonymity or security protections.

Never use the preview with real funds or secrets.

## Maintaining this site

- **No metadata, ever,** in any published file. Images keep only the PNG chunks IHDR, IDAT
  and IEND, and are made from the original screenshots on the machine that commits them.
- Any change to `experience.js` or `experience.css` also changes their `?v=` tag in
  `experience.html`, or returning visitors keep the old file for a while.
- Every change gets a `CHANGELOG.md` entry saying what changed, why, and which Zignal commit
  it was checked against. When the app's text or behaviour changes, the demo follows and the
  pinned commit moves forward.
