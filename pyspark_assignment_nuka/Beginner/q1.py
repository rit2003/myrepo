#Create a Spark application in python to count words in a text file
from pyspark.sql import SparkSession

def word_count(file_path):
    spark = SparkSession.builder \
        .appName("WordCountSpark") \
        .getOrCreate()

    print(f"SparkSession created successfully for application: {spark.sparkContext.appName}")
    try:
        lines = spark.sparkContext.textFile(file_path)
        print(f"Successfully read file: {file_path}. Total lines: {lines.count()}")
        words = lines.flatMap(lambda line: line.split()) \
                     .map(lambda word: word.lower())
        word_pairs = words.map(lambda word: (word, 1))
        word_counts = word_pairs.reduceByKey(lambda a, b: a + b) # type: ignore

        print("\nWord Counts:")
        for word, count in word_counts.collect():
            print(f"{word}: {count}")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        spark.stop()


if __name__ == "__main__":
    word_count("sample_text.txt")
