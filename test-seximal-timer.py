#!/usr/bin/env python3
"""
Test script to verify seximal timer conversion logic
Test cases from the user requirements
"""

import math

test_cases = [
    (600, "00:10:00.0"),   # 600 standard seconds -> 6 seximal minutes displayed as "10" in base-6
    (600, "00:10:00.0"),   # 10 standard minutes (600 seconds) -> 6 seximal minutes displayed as "10" in base-6
    (1200, "00:20:00.0"),  # 20 standard minutes (1200 seconds) -> 12 seximal minutes displayed as "20" in base-6
    (1800, "00:30:00.0"),  # 30 standard minutes (1800 seconds) -> 18 seximal minutes displayed as "30" in base-6
    (2400, "00:40:00.0"),  # 40 standard minutes (2400 seconds) -> 24 seximal minutes displayed as "40" in base-6
    (3000, "00:50:00.0"),  # 50 standard minutes (3000 seconds) -> 30 seximal minutes displayed as "50" in base-6
    (3600, "01:00:00.0"),  # 60 standard minutes (3600 seconds) -> 36 seximal minutes = 1 seximal hour displayed as "01:00:00.0"
    (3600, "01:00:00.0"),  # 1 standard hour (3600 seconds) -> 1 seximal hour
    (7200, "02:00:00.0"),  # 2 standard hours (7200 seconds) -> 2 seximal hours
    (21600, "10:00:00.0"), # 6 standard hours (21600 seconds) -> 6*36 = 216 seximal minutes = 6 seximal hours displayed as "10:00:00.0"
    (129600, "100:00:00.0"), # 36 standard hours (129600 seconds) -> 36*36 = 1296 seximal minutes = 36 seximal hours displayed as "100:00:00.0"
]

def decimal_to_seximal(decimal):
    """
    Convert decimal number to seximal (base 6) using proper algorithm
    """
    if decimal == 0:
        return "0"

    is_negative = decimal < 0
    decimal = abs(decimal)

    integer_part = math.floor(decimal)
    fractional_part = decimal - integer_part

    # Convert integer part
    integer_seximal = ""
    num = integer_part
    if num == 0:
        integer_seximal = "0"
    else:
        while num > 0:
            integer_seximal = str(num % 6) + integer_seximal
            num = num // 6

    # Convert fractional part
    fractional_seximal = ""
    frac = fractional_part
    precision = 0
    max_precision = 6

    while frac > 0 and precision < max_precision:
        frac *= 6
        digit = math.floor(frac)
        fractional_seximal += str(digit)
        frac -= digit
        precision += 1

    # Remove trailing zeros from fractional part
    fractional_seximal = fractional_seximal.rstrip('0')

    result = integer_seximal
    if fractional_seximal:
        result += "." + fractional_seximal

    return "-" + result if is_negative else result

def convert_standard_to_seximal_time(total_seconds):
    """
    Convert decimal seconds to seximal time units based on user's explanation:
    - 600 standard seconds = 10 standard minutes
    - 10 standard minutes = 6 seximal minutes (because 10 decimal = 6 in base-6)
    - 6 seximal minutes displayed as "10" in base-6 digits
    """

    # Based on user's expectation: 600 standard seconds = 00:10:00.0 seximal time
    # This means: 10 seximal minutes = 600 standard seconds
    # But "10" in the display represents 6 seximal minutes (because 1*6 + 0 = 6)
    # So: 1 seximal minute = 100 standard seconds

    # Convert to seximal minutes (1 seximal minute = 100 standard seconds)
    total_seximal_minutes = total_seconds / 100

    # Split into whole and fractional parts
    whole_seximal_minutes = math.floor(total_seximal_minutes)
    fractional_seximal_minutes = total_seximal_minutes - whole_seximal_minutes

    # Convert to seximal time units
    # Use 36 seximal minutes per seximal hour (6^2 = 36)
    seximal_hours = math.floor(whole_seximal_minutes / 36)  # 36 seximal minutes per seximal hour
    remaining_minutes = whole_seximal_minutes % 36

    seximal_minutes = remaining_minutes
    seximal_seconds = math.floor(fractional_seximal_minutes * 36)  # 36 seximal seconds per seximal minute

    # Calculate sixths of a seximal second (0-5 in base 6)
    fractional_seconds = (fractional_seximal_minutes * 36) - math.floor(fractional_seximal_minutes * 36)
    sixths = math.floor(fractional_seconds * 6) % 6

    # Convert to base-6 digits for display
    return {
        'hours': decimal_to_seximal(seximal_hours),
        'minutes': decimal_to_seximal(seximal_minutes),
        'seconds': decimal_to_seximal(seximal_seconds),
        'sixths': decimal_to_seximal(sixths)
    }

def format_seximal_time_display(seximal_time):
    return f"{seximal_time['hours'].zfill(2)}:{seximal_time['minutes'].zfill(2)}:{seximal_time['seconds'].zfill(2)}.{seximal_time['sixths']}"

print("Testing Seximal Timer Conversion Logic")
print("=" * 45)

all_tests_passed = True

for i, (test_input, expected) in enumerate(test_cases, 1):
    result = convert_standard_to_seximal_time(test_input)
    formatted_result = format_seximal_time_display(result)
    passed = formatted_result == expected

    print(f"Test {i}: {test_input} seconds")
    print(f"  Expected: {expected}")
    print(f"  Got:      {formatted_result}")
    print(f"  Status:   {'✅ PASS' if passed else '❌ FAIL'}")
    print()

    if not passed:
        all_tests_passed = False

print("=" * 45)
print(f"Overall Result: {'✅ ALL TESTS PASSED' if all_tests_passed else '❌ SOME TESTS FAILED'}")
