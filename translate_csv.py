import asyncio
import csv
import os
import time
from openai import AsyncOpenAI, RateLimitError, APIError

# Configuration
API_KEY = os.getenv("NEBIUS_AISTUDIO_TOKEN")
BASE_URL = "https://api.studio.nebius.com/v1/"
SOURCE_CSV = "words.csv"
TARGET_CSV = "words_translated.csv"
CONCURRENCY_LIMIT = 32
MODEL_NAME = "meta-llama/Meta-Llama-3.1-405B-Instruct"  # Or whichever model is available/suitable at the endpoint

if not API_KEY:
    raise ValueError("NEBIUS_AISTUDIO_TOKEN environment variable not set.")

# Initialize OpenAI client
client = AsyncOpenAI(api_key=API_KEY, base_url=BASE_URL)
semaphore = asyncio.Semaphore(CONCURRENCY_LIMIT)
translated = 0
total_rows = 0

async def get_translation(latvian_word: str, english_translation: str, delay=5) -> str:
    """Gets Russian translation for a Latvian word using OpenAI API."""
    prompt = (
        f"Translate the Latvian word '{latvian_word}' to Russian. "
        f"The English meaning is '{english_translation}'. "
        f"If there are multiple meanings separated by a semicolon in English, provide at most 3 corresponding comma-separated Russian translations. "
        f"Try to use as less words as possible: e.g. instead of кожа, кожа (материал) use just кожа. Instead of отдать обратно use просто отдать. Do not repeat words or include more than 3. "
        f"Output only the Russian translation(s), without quotes or any other extra text."
    )
    attempt = 0
    while True:
        async with semaphore:
            try:
                response = await client.chat.completions.create(
                    model=MODEL_NAME,
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that translates words."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.1,  # Lower temperature for more deterministic translation
                    max_tokens=100
                )
                translation = response.choices[0].message.content.strip().lower()
                # Basic cleanup - remove potential surrounding quotes
                if translation.startswith('"') and translation.endswith('"'):
                    translation = translation[1:-1]
                # Check for empty or malformed response
                if len(translation) == 0:
                    print(f"Got empty translation for '{latvian_word}'. Retrying...")
                else:
                    translation = translation.split(',')
                    meanings = [t.strip() for t in translation]
                    # remove duplicates
                    meanings = list(dict.fromkeys(meanings))
                    translation = ', '.join(meanings)
                    global translated, total_rows
                    translated += 1
                    print(f"Translated {translated}/{total_rows} '{latvian_word}' -> '{translation}'")
                    return translation
            except RateLimitError as e:
                # print(f"Rate limit hit for '{latvian_word}', attempt {attempt + 1}/{retries}. Waiting {delay}s... Error: {e}")
                pass
            except APIError as e:
                print(
                    f"API error for '{latvian_word}'. Will retry... Error: {e}")
            except Exception as e:
                print(f"Unexpected error translating '{latvian_word}': {e}")
        await asyncio.sleep(delay * (attempt + 1))  # Exponential backoff might be better


async def main():
    """Main function to read CSV, translate words, and write results."""
    rows_to_translate = []
    try:
        with open(SOURCE_CSV, mode='r', encoding='utf-8') as infile:
            reader = csv.reader(infile)
            rows_to_translate = list(reader)
            if not rows_to_translate:
                print(f"Source file '{SOURCE_CSV}' is empty.")
                return
            # Assuming header doesn't need translation if present, adjust if needed
            # header = rows_to_translate[0]
            # data_rows = rows_to_translate[1:]
            data_rows = rows_to_translate  # Process all rows for now
    except FileNotFoundError:
        print(f"Error: Source file '{SOURCE_CSV}' not found.")
        return
    except Exception as e:
        print(f"Error reading '{SOURCE_CSV}': {e}")
        return

    tasks = []
    global total_rows
    total_rows = len(data_rows)
    print(f"Preparing {total_rows} rows for translation...")
    for row in data_rows:
        if len(row) >= 2:
            latvian_word = row[0]
            english_translation = row[1]
            tasks.append(get_translation(latvian_word, english_translation))
        else:
            # Handle malformed rows - append placeholder or original row
            tasks.append(asyncio.sleep(0, result="MALFORMED_ROW"))  # Placeholder task

    print(f"Starting translation with concurrency limit {CONCURRENCY_LIMIT}...")
    start_time = time.time()
    translations = await asyncio.gather(*tasks)
    end_time = time.time()
    print(f"Translation finished in {end_time - start_time:.2f} seconds.")

    # Combine original data with translations
    output_rows = []
    malformed_count = 0
    error_count = 0
    for i, original_row in enumerate(data_rows):
        if translations[i] == "MALFORMED_ROW":
            output_rows.append(original_row + ["MALFORMED_INPUT_ROW"])
            malformed_count += 1
        elif "TRANSLATION_ERROR" in translations[i] or "TRANSLATION_FAILED" in translations[i]:
            output_rows.append(original_row + [translations[i]])  # Keep original + error message
            error_count += 1
        else:
            output_rows.append(original_row + [translations[i]])

    if malformed_count > 0:
        print(f"Warning: Skipped {malformed_count} malformed rows.")
    if error_count > 0:
        print(f"Warning: Encountered {error_count} errors during translation.")

    # Write to target CSV
    try:
        with open(TARGET_CSV, mode='w', encoding='utf-8', newline='') as outfile:
            writer = csv.writer(outfile, quoting=csv.QUOTE_ALL)  # Quote all fields to handle commas in translations
            writer.writerows(output_rows)
        print(f"Successfully wrote results to '{TARGET_CSV}'.")
    except Exception as e:
        print(f"Error writing to '{TARGET_CSV}': {e}")


if __name__ == "__main__":
    asyncio.run(main())
