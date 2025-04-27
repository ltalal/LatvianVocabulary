# Latvian Vocabulary Trainer Testing Guide

This document explains how to run tests for the Latvian Vocabulary Trainer application to verify the correct handling of words with parentheses in translations.

## Running Tests

There are two ways to run the tests:

### 1. Using the Test HTML Page

1. Open `tests.html` in your web browser
2. Click the "Run Tests" button
3. View the test results in the output area

### 2. From the Browser Console

1. Open the main application (`index.html`) in your browser
2. Load the test script by executing this in the console:
   ```javascript
   const script = document.createElement('script');
   script.src = 'tests.js';
   document.head.appendChild(script);
   ```
3. After the script loads, run the tests by executing:
   ```javascript
   runVocabularyTests();
   ```

## What the Tests Verify

The tests verify the following functionality:

1. **CSV Parsing**: Ensures that the `parseCSVLine` function correctly parses CSV lines that include parentheses, storing both:
   - The cleaned version without parentheses (for answer checking)
   - The full version with parentheses (for display)

2. **Answer Checking**: Verifies that the answer checking logic correctly accepts valid answers:
   - Both "а не" and "вместо" are accepted as correct answers for "nevis"
   - Text within parentheses like "противопоставление" is not required for a correct answer

3. **Word Display**: Confirms that words with parentheses are displayed correctly:
   - For example, "а не, вместо (противопоставление)" is shown fully when displayed
   - The word identifier in the URL uses the short version without parentheses

4. **Feedback Messages**: Checks that feedback messages show the full translation with parentheses:
   - When showing the correct answer
   - When marking an answer as incorrect
   - When using the "Show Answer" button

## Test Data

The tests use these example words:
- "nevis" → "а не, вместо (противопоставление)"
- "būt" → "быть (существовать)"
- "ābele" → "яблоня"

## Troubleshooting

If tests fail, check the following:

1. Make sure all recent changes to the main application code are saved
2. Verify that the browser has loaded the latest version of your scripts (try hard refresh)
3. Check the browser console for any additional error messages
4. Review the test failures to understand which specific aspect of functionality is failing 