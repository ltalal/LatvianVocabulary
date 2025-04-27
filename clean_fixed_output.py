#!/usr/bin/env python
# -*- coding: utf-8 -*-

def clean_fixed_output():
    # Read the CSV file
    with open('words_short_fixed.csv', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Problematic lines to remove (line numbers from check_fixed_result.py)
    problem_lines = [39, 77, 98, 114, 155, 167, 170, 178, 268, 276, 294, 303]
    
    # Create a new list excluding the problem lines
    cleaned_lines = [line for i, line in enumerate(lines, 1) if i not in problem_lines]
    
    # Write the cleaned content back to the file
    with open('words_short_fixed_clean.csv', 'w', encoding='utf-8') as f:
        f.writelines(cleaned_lines)
    
    print(f"Removed {len(problem_lines)} problematic lines. Clean output saved to words_short_fixed_clean.csv")

if __name__ == '__main__':
    clean_fixed_output() 