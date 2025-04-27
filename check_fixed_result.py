#!/usr/bin/env python
# -*- coding: utf-8 -*-

def check_fixed_output(filename='words_short_fixed_clean.csv'):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    problematic_lines = []
    for i, line in enumerate(lines):
        # Remove quotes and split by commas
        parts = line.strip().split('","')
        if len(parts) >= 3:
            latvian = parts[0].strip('"')
            russian = parts[2].strip('"')
            
            # Check for multiple Latvian words (separated by ;)
            latvian_parts = [part.strip() for part in latvian.split(';')]
            
            if len(latvian_parts) > 1:
                # Check how many Russian words we have
                russian_words = len([part.strip() for part in russian.split(';')])
                if russian_words <= 1:
                    problematic_lines.append({
                        'line_num': i + 1,
                        'text': line.strip(),
                        'latvian_words': len(latvian_parts),
                        'russian_words': russian_words
                    })
    
    if problematic_lines:
        print(f"Found {len(problematic_lines)} lines that still have multiple Latvian words but only one Russian translation:")
        for i, problem in enumerate(problematic_lines):
            print(f"\n{i+1}. Line {problem['line_num']}: {problem['text']}")
            print(f"  Latvian words: {problem['latvian_words']}, Russian words: {problem['russian_words']}")
    else:
        print("All lines have been successfully fixed!")

if __name__ == '__main__':
    check_fixed_output() 