# Changelog

Every change to this site, newest first. Each entry says what changed, why, and what it was
checked against. Earlier versions of changed files are kept in git history and, for local
reference, in the git-ignored `archive/` folder.

## 2026-11-16: the real app, screen by screen

Source checked: Zignal `dev` at `e7bd418` (SwiftUI screens, `WalletSupport.swift`, README).

**Real screenshots (new section, `img/`)**
- 14 screenshots of the real app, each captioned with its build: welcome, PINs, panic PIN,
  real and decoy profiles on mainnet, network settings, syncing, recovery words hidden during
  a recording, the screenshot warning, and the November 15 invite screens.
- Prepared for the web: 01 to 03 resized to 603 px wide; every file re-saved with no metadata
  (12 to 14 carried EXIF, 13 also XMP and a colour profile). No pixels edited.
- Checked before publishing: no QR codes, addresses, transaction IDs, recovery words or
  notifications in any image.
- Rule for this site, permanently: no metadata in any published file. Every image holds only
  the PNG chunks IHDR, IDAT and IEND (checked on all 14). The images were made on the Mac from
  the original screenshots, so no tool added anything on the way.
- Captions say where a screenshot is older than the app: the network settings (servers changed
  in `5e795ee`) and the "Prepare for chatting" button (now "Prepare").

**Phone simulation, now in the app's own words**
- Welcome: the four lines match the app exactly.
- Set PINs: the app's descriptions of the three PINs and the text under each PIN; the
  "I understand this can't be undone" switch; "Create profiles". The PIN fields are left out
  and the screen says so.
- Restore: the app's date question and what a restored phrase does (chats start empty, the
  decoy gets its own phrase).
- Chats: the recovery banner's subtitle and the wallet footer as the app shows them.
- Conversation: the "Message" field with the app's 4,000-byte counter.
- Add funds: the app's funding text (Orchard, 10 confirmations, about 0.03 ZEC for a few
  hundred messages).
- Network: the app's Tor footer, plus the six default servers on `dev` (zec.rocks, Stardust,
  Cake Wallet), with a note on what syncing still sends directly.
- Recovery: the four lines under the words and the app's screenshot warning.
- Invite and Add contact: "Only one of you scans", "Works once", and the refusal of a used
  invite (`e7bd418`).
- Contact: the app's name and safety-number text.

**Other**
- Header link to the new Screenshots section; cache tags on the CSS and JS set to `2026-11-16`.
- README: new "Screenshots" and "How the phone simulation follows the app" sections.

## 2026-11-16: first version on Zkignal (`b3a1890`)

- The demo moved to this repository from an earlier private copy, as one fresh commit.
- All links point to `Zkignal/zignal`, pinned to `e7bd418`.
- Tor wording: with Tor on, syncing (block downloads, tree states and subtree roots) still
  connects directly.
- The "Latest" card covers `e7bd418`, `5e795ee` and `f8b3881`; the roadmap card matches the
  repository's roadmap.
- `index.html` is a plain redirect to the experience.
