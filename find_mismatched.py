#!/usr/bin/env python
# -*- coding: utf-8 -*-

def find_mismatched_lines():
    with open('words_short_src.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into lines and filter out empty lines and category headers
    lines = [line.strip() for line in content.split('\n') if line.strip() and not line.strip().startswith(('1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.', '12.', '13.', '14.'))]
    
    mismatched_lines = []
    for i, line in enumerate(lines):
        # Handle multiple possible dash characters
        if '–' in line:  # en dash
            parts = line.split('–')
        elif '—' in line:  # em dash
            parts = line.split('—')
        elif '-' in line:  # hyphen
            parts = line.split('-')
        else:
            continue
            
        if len(parts) == 2:
            latvian = parts[0].strip()
            russian = parts[1].strip()
            
            # Split by / to check Latvian side
            latvian_parts = [part.strip() for part in latvian.split('/')]
            
            # Try splitting Russian by comma first, then by slash
            russian_parts_comma = [part.strip() for part in russian.split(',')]
            russian_parts_slash = [part.strip() for part in russian.split('/')]
            
            # Check if counts match with either splitting method
            if (len(latvian_parts) != len(russian_parts_comma) or len(latvian_parts) <= 1) and \
               (len(latvian_parts) != len(russian_parts_slash) or len(latvian_parts) <= 1):
                if len(latvian_parts) > 1:  # Only interested in multiple words on Latvian side
                    mismatched_lines.append({
                        'line_num': i + 1,
                        'text': line,
                        'latvian_parts': latvian_parts,
                        'russian_parts_comma': russian_parts_comma,
                        'russian_parts_slash': russian_parts_slash
                    })
    
    # Print results
    print(f"Found {len(mismatched_lines)} lines with mismatched word counts:")
    for i, mismatch in enumerate(mismatched_lines):
        print(f"\n{i+1}. Line {mismatch['line_num']}: {mismatch['text']}")
        print(f"  Latvian words ({len(mismatch['latvian_parts'])}): {', '.join(mismatch['latvian_parts'])}")
        
        if len(mismatch['russian_parts_comma']) > len(mismatch['russian_parts_slash']):
            print(f"  Russian words (comma-separated, {len(mismatch['russian_parts_comma'])}): {', '.join(mismatch['russian_parts_comma'])}")
        else:
            print(f"  Russian words (slash-separated, {len(mismatch['russian_parts_slash'])}): {', '.join(mismatch['russian_parts_slash'])}")

if __name__ == '__main__':
    find_mismatched_lines() 