#Load a CSV file using Python Spark and print the schema.
from pyspark.sql import SparkSession

def load_csv_and_print_schema():

    spark = SparkSession.builder \
        .appName("CsvSchemaApp") \
        .master("local[*]") \
        .getOrCreate()

    csv_file_path = "users.csv"

    try:
       
        # spark.read.csv() is the standard way to read CSV files.
        # header=True: Uses the first row of the CSV as the column names.
        # inferSchema=True: Automatically infers the data types (e.g., integer, string) for each column.

        df = spark.read.csv(csv_file_path, header=True, inferSchema=True)
        print(f"Schema for {csv_file_path}:")
        df.printSchema()
        print("\nSample data:")
        df.show()

    except Exception as e:
        print(f"An error occurred during Spark processing: {e}")
        print(f"Please ensure the file exists at '{csv_file_path}' and is a valid CSV file.")

    finally:
        spark.stop()


if __name__ == "__main__":
    load_csv_and_print_schema()
