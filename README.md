<p align="center">
  <img src="preview/splash.svg" alt="DelugeFinder, finds torrents and sends them to Deluge" style="max-width: 832px; width: 100%; height: auto;">
</p>

Finding a torrent these days sucks. One site is a minefield of fake download buttons. Another hides the real link under a popup that spawns two more tabs. And after all that, half the results are dead, zero seeders.

DelugeFinder finds torrents and sends them to Deluge, right from your terminal. One search checks every indexer configured in your own [Prowlarr](https://prowlarr.com) instance at once, and whatever you pick gets sent straight to your own [Deluge](https://deluge-torrent.org) instance over its Web UI — DelugeFinder itself never downloads anything.

## Get started

1. **Install Node** (from [nodejs.org](https://nodejs.org)) and have a Deluge Web UI reachable (local or remote).
2. **Open your terminal.**
3. **Start it:**

   ```sh
   npx dlfi
   ```

DelugeFinder opens straight to a search bar: search for what you want, or paste in a magnet link or a bare infohash. Press `o` once to point it at your Deluge Web UI (address + password) and `p` to point it at your Prowlarr instance (address + API key); both are saved locally after that. From there it's all keypresses, nothing to memorize, and `?` brings up the full list anytime.

## Finding something

Type what you're looking for and press Enter. Results stream in from every source as they answer, tagged with size and how many people are sharing each one, so you can see what'll come down fast. Arrow to what you want and press `d` to send it to Deluge, or `y` to just copy the magnet link instead.

<p align="center">
  <img src="preview/browse.svg" alt="DelugeFinder's browse view: the sidebar, the search bar, and merged results from every source" style="max-width: 832px; width: 100%; height: auto;">
</p>

## What it searches

DelugeFinder has no built-in source list — every source is an indexer discovered live from your own [Prowlarr](https://prowlarr.com) instance. Add Prowlarr once (see below) and every indexer configured there shows up as its own source, grouped by category (Games, Movies, TV, Anime). Until Prowlarr is connected, searches simply return nothing.

## Adding a Deluge connection

Press `o` anywhere in the app to open the Deluge connection panel:

1. **URL** — your Deluge Web UI address, e.g. `http://localhost:8112`.
2. Press `Tab` (or Enter) to move to **password** — the Deluge Web UI password.
3. Press Enter to save, or `Esc` to cancel without saving.

The connection is saved locally to your config file and reused on every future start. Once it's set, `d` on any result sends its magnet link straight to that Deluge instance.

## Adding a Prowlarr connection

Press `p` anywhere in the app to open the Prowlarr connection panel:

1. **URL** — your Prowlarr address, e.g. `http://localhost:9696`.
2. Press `Tab` (or Enter) to move to **API key** — found in Prowlarr under Settings → General → Security.
3. Press Enter to save, or `Esc` to cancel without saving.

Once saved, DelugeFinder loads your configured indexers in the background and merges their results into every search.

## Contributing

To run or work on DelugeFinder locally:

1. Clone the repository and open the folder.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development version:
   ```sh
   npm run dev
   ```
   Or build it and run the bundled version:
   ```sh
   npm run build
   npx dlfi
   ```

## Privacy

DelugeFinder itself never opens a connection to the torrent network — it only searches, then hands the chosen magnet link to your own Deluge instance over its Web UI. Everything after that (downloading, seeding, where files land) is Deluge's territory, configured however you already run it.
