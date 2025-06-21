# pickedin

This Chrome extension helps you save LinkedIn profile URNs so you can quickly view posts from those accounts.

## Features
- Floating "pIn" button on LinkedIn pages to open the panel.
- **Add profile:** save the current profile (up to 50 entries).
- **View posts:** open a LinkedIn search for the saved profiles' posts.
- A link button next to each saved profile opens posts for that profile only.
- **Import/Export:** backup or restore your saved list as JSON.
- Options page to store an Airtable API key and base ID.

## Installation
1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome, enable *Developer mode* and click *Load unpacked*.
3. Select this folder to load the extension.

## Usage
- Navigate to a LinkedIn profile and click *Ajouter un profil* to add it to your list.
- Use *Voir les articles* to open a search of posts from all saved profiles.
- Use *Exporter* or *Importer* to save or load your list.

## Running tests
The unit tests require Node.js only and run the script in `test/onInstalled.test.js`.
Execute:

```
npm test
```

A French version of this file is available in [README.fr.md](README.fr.md).

## License

This project is licensed under the [MIT License](LICENSE).
