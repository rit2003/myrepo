# Write a Python Spark job to count occurrences of each character in a text file.
from pyspark import SparkContext
import re

def character_count():
    sc = SparkContext("local[*]", "CharacterCountApp")
    lines_rdd = sc.textFile("sample_text.txt")

    chars_rdd = lines_rdd.flatMap(lambda line: list(line))
    char_counts_rdd = chars_rdd.map(lambda char: (char, 1))
    total_counts_rdd = char_counts_rdd.reduceByKey(lambda x, y: x + y) # type: ignore

    results = total_counts_rdd.collect()
    results.sort(key=lambda x: x[0])

    print("Character counts:")
    for char, count in results:
        if char == ' ':
            print(f"' ' (space): {count}")
        elif char == '\n':
            print(f"'\\n' (newline): {count}")
        else:
            print(f"'{char}': {count}")
    sc.stop()


if __name__ == "__main__":
    character_count()
