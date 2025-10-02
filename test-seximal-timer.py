#!/usr/bin/env python3
"""
Test script to verify seximal timer conversion logic
Test cases from the user requirements
"""

import math

test_cases = [
    (600, "01:00:00.0"),   # 600 standard seconds -> 216 seximal seconds = 1 seximal hour
    (600, "01:00:00.0"),   # 10 standard minutes (600 seconds) -> 216 seximal seconds = 1 seximal hour
    (1200, "02:00:00.0"),  # 20 standard minutes (1200 seconds) -> 432 seximal seconds = 2 seximal hours
    (1800, "03:00:00.0"),  # 30 standard minutes (1800 seconds) -> 648 seximal seconds = 3 seximal hours
    (2400, "04:00:00.0"),  # 40 standard minutes (2400 seconds) -> 864 seximal seconds = 4 seximal hours
    (3000, "05:00:00.0"),  # 50 standard minutes (3000 seconds) -> 1080 seximal seconds = 5 seximal hours
    (3600, "10:00:00.0"),  # 60 standard minutes (3600 seconds) -> 1296 seximal seconds = 10 seximal hours
    (3600, "10:00:00.0"),  # 1 standard hour (3600 seconds) -> 1296 seximal seconds = 10 seximal hours
    (7200, "20:00:00.0"),  # 2 standard hours (7200 seconds) -> 2592 seximal seconds = 20 seximal hours
    (21600, "100:00:00.0"), # 6 standard hours (21600 seconds) -> 7776 seximal seconds = 100 seximal hours
    (129600, "1000:00:00.0"), # 36 standard hours (129600 seconds) -> 46656 seximal seconds = 1000 seximal hours
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
    Convert decimal seconds to seximal time units properly
    1 seximal second = 25/9 real seconds
    So real seconds to seximal seconds conversion factor is 9/25
    """

    # First convert to total seximal seconds (with fractional part)
    total_seximal_seconds_with_fraction = total_seconds * (9/25)

    # Split into whole and fractional parts
    whole_seximal_seconds = math.floor(total_seximal_seconds_with_fraction)
    fractional_seximal_seconds = total_seximal_seconds_with_fraction - whole_seximal_seconds

    # Convert to seximal time units (base 6)
    seximal_hours = math.floor(whole_seximal_seconds / 216)  # 6^3 seximal seconds per seximal hour
    remaining_after_hours = whole_seximal_seconds % 216

    seximal_minutes = math.floor(remaining_after_hours / 36)  # 6^2 seximal seconds per seximal minute
    seximal_seconds = remaining_after_hours % 36  # 6^1 seximal seconds

    # Calculate sixths of a seximal second (0-5 in base 6)
    # Since we're showing fractional seximal seconds, we need to convert the fractional part
    sixths = math.floor(fractional_seximal_seconds * 6) % 6

    return {
        'hours': decimal_to_seximal(seximal_hours),
        'minutes': decimal_to_seximal(seximal_minutes),
        'seconds': decimal_to_seximal(seximal_seconds),
        'sixths': str(sixths)
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
