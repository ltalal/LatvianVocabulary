# Latvian Vocabulary Trainer

A web-based application designed to help users learn Latvian vocabulary through interactive exercises. It supports learning in both Latvian to English and English to Latvian directions and offers two learning modes: typing answers or selecting from flashcards.

## Features

*   **Bidirectional Learning:** Practice translating from Latvian to English (`lv-en`) or English to Latvian (`en-lv`).
*   **Multiple Learning Modes:**
    *   **Typing Mode:** Type the translation for the given word. Provides feedback based on edit distance for close answers.
    *   **Cards Mode:** Choose the correct translation from a set of multiple-choice flashcards.
*   **Vocabulary Loading:** Loads vocabulary pairs from a `words.csv` file.
*   **Progress Tracking:** Tracks words you have successfully translated ("mastered").
*   **Mastered Words Management:**
    *   View a list of mastered words for the current direction.
    *   Delete individual mastered words.
    *   Clear all mastered words for the current direction.
*   **Import/Export Mastered Words:** Save your progress by exporting mastered words to a JSON file and import them later.
*   **Persistence:** Mastered words are saved in the browser's `localStorage`.
*   **State Restoration:** The application uses URL hashes (`#direction/mode/word`) to restore your session's direction, mode, and current word when the page is reloaded or the link is shared.
*   **Responsive Design:** Uses Bootstrap for a clean interface that works on different screen sizes.

## Setup

1.  **Clone the repository (or download the files):**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```
2.  **Prepare the vocabulary file:**
    *   Ensure you have a `words.csv` file in the root directory.
    *   The format should be `Latvian Word(s),English Word(s)` per line (see [Vocabulary Format](#vocabulary-format)).
3.  **Open the application:**
    *   Simply open the `index.html` file in your web browser. No web server is strictly required for basic functionality, but running one locally might be necessary if you encounter issues with fetching the CSV file due to browser security policies (CORS). You can use simple tools like Python's `http.server`:
      ```bash
      python -m http.server
      ```
      Then navigate to `http://localhost:8000` (or the port specified) in your browser.

## Usage

1.  **Open `index.html` in your browser.**
2.  **Select Direction:** Choose whether you want to translate Latvian → English or English → Latvian using the buttons at the top.
3.  **Select Mode:** Choose between "Cards Mode" or "Typing Mode".
4.  **Start Learning:**
    *   **Typing Mode:** A word will be displayed. Type its translation in the input box and click "Check" or press Enter. You get feedback and multiple attempts.
    *   **Cards Mode:** A word will be displayed along with several potential translations on cards. Click the card you believe is correct.
5.  **Controls:**
    *   **Check:** (Typing Mode) Submits your typed answer.
    *   **Show the answer:** Reveals the correct translation(s).
    *   **Next word:** Skips the current word and loads a new random, unmastered word.
    *   **Mastered Words:** Opens a modal displaying words you've mastered in the current direction.
    *   **Export/Import (in Mastered Words modal):** Save or load your mastered word list.
    *   **Clear All (in Mastered Words modal):** Removes all mastered words for the current direction.

## Vocabulary Format (`words.csv`)

The `words.csv` file should contain comma-separated values (CSV). Each line represents one vocabulary entry:

```csv
"Latvian Term1; Latvian Term2","English Term1; English Term2"
"vārds","word"
"grāmata; grāmatas (pl.)","book; books (pl.)"
"iet (uz)","to go (to)"
```

*   The first column contains Latvian terms, separated by semicolons (`;`) if there are multiple synonyms or forms.
*   The second column contains the corresponding English terms, also separated by semicolons if needed.
*   Quotes (`"`) are recommended around entries, especially if they contain commas.
*   Text within parentheses `()` is ignored during answer checking (e.g., `(pl.)`, `(uz)`).
*   Leading "to " in English translations is ignored during checking in typing mode.

## Mastered Words Data Format (`mastered_words.json`)

When exporting mastered words, a JSON file (`mastered_words.json`) is created with the following structure:

```json
{
  "lv-en": [
    "vārds",
    "grāmata"
  ],
  "en-lv": [
    "book",
    "house"
  ]
}
```

*   `lv-en`: An array of strings, where each string is the *source* Latvian word that has been mastered in the Latvian → English direction.
*   `en-lv`: An array of strings, where each string is the *source* English word that has been mastered in the English → Latvian direction.

## Technologies Used

*   HTML5
*   CSS3
*   JavaScript (ES6+)
*   Bootstrap 5.3
*   `localStorage` API

## Potential Improvements

*   Add audio pronunciation.
*   Implement spaced repetition system (SRS).
*   Allow users to add/edit vocabulary directly in the app.
*   Categorize words (e.g., nouns, verbs, topics).
*   Improve handling of multi-word answers or phrases.
*   Add more sophisticated feedback mechanisms. 