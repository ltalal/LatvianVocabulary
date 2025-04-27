#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re
import sys

def convert_file(input_file='words_short_src.txt', output_file='words_short.csv'):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into lines and filter out empty lines and category headers
    lines = [line.strip() for line in content.split('\n') if line.strip() and not line.strip().startswith(('1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.', '12.', '13.', '14.'))]
    
    # Process each line
    converted_lines = []
    for line in lines:
        # Handle multiple possible dash characters
        if '–' in line:  # en dash
            parts = line.split('–')
        elif '—' in line:  # em dash
            parts = line.split('—')
        elif '-' in line:  # hyphen
            parts = line.split('-')
        else:
            # If no dash, just continue
            converted_lines.append(f'"{line}","",""')
            continue
            
        if len(parts) == 2:
            latvian = parts[0].strip()
            russian = parts[1].strip()
            
            # Split by / to check if we have matching pairs on Latvian side
            latvian_parts = [part.strip() for part in latvian.split('/')]
            
            # Try splitting Russian by comma first, then by slash
            russian_parts_comma = [part.strip() for part in russian.split(',')]
            russian_parts_slash = [part.strip() for part in russian.split('/')]
            
            # Check which splitting method gives us a matching number of parts
            if len(latvian_parts) == len(russian_parts_comma) and len(latvian_parts) > 1:
                # Use comma-separated parts
                for lat_word, rus_word in zip(latvian_parts, russian_parts_comma):
                    converted_lines.append(f'"{lat_word}","","{rus_word}"')
            elif len(latvian_parts) == len(russian_parts_slash) and len(latvian_parts) > 1:
                # Use slash-separated parts
                for lat_word, rus_word in zip(latvian_parts, russian_parts_slash):
                    converted_lines.append(f'"{lat_word}","","{rus_word}"')
            else:
                # Original behavior - replace / with ;
                latvian = latvian.replace('/', ';')
                russian = russian.replace('/', ';')
                
                # Format as CSV line
                converted_lines.append(f'"{latvian}","","{russian}"')
    
    # Write to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(converted_lines))
    
    print(f"Conversion complete. Output saved to {output_file}")

if __name__ == '__main__':
    if len(sys.argv) >= 3:
        convert_file(sys.argv[1], sys.argv[2])
    elif len(sys.argv) == 2:
        convert_file(sys.argv[1])
    else:
        convert_file() 