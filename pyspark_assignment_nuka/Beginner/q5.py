#Implement a Python Spark application to compute average, min, max of numeric column in CSV
from pyspark.sql import SparkSession
from pyspark.sql.functions import avg, min, max

def calculate_csv_aggregates():

    spark = SparkSession.builder \
        .appName("CsvAggregateApp") \
        .master("local[*]") \
        .getOrCreate()

    csv_file_path = "users.csv"
    numeric_column = "age"

    try:
        df = spark.read.csv(csv_file_path, header=True, inferSchema=True)
        # We import avg, min, and max functions from pyspark.sql.functions
        print(f"Calculating avg, min, and max for column '{numeric_column}':")
        
        agg_results = df.agg(
            avg(numeric_column).alias(f"average_{numeric_column}"),
            min(numeric_column).alias(f"min_{numeric_column}"),
            max(numeric_column).alias(f"max_{numeric_column}")
        )

        agg_results.show()

    except Exception as e:
        print(f"An error occurred during Spark processing: {e}")
        print(f"Please ensure the file exists at '{csv_file_path}' and that '{numeric_column}' is a valid numeric column.")

    finally:
        spark.stop()


if __name__ == "__main__":
    calculate_csv_aggregates()
