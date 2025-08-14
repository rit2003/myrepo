#Write a Python Spark program to join two datasets based on a common key
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, IntegerType

def join_two_datasets():

    spark = SparkSession.builder \
        .appName("JoinExampleApp") \
        .master("local[*]") \
        .getOrCreate()

    users_data = [
        (1, "Ritika"),
        (2, "Rohan"),
        (3, "Palak"),
        (4, "Ruhani")
    ]
    users_schema = StructType([
        StructField("user_id", IntegerType(), True),
        StructField("name", StringType(), True)
    ])
    users_df = spark.createDataFrame(data=users_data, schema=users_schema)

    print("Users Dataset:")
    users_df.show()

    orders_data = [
        (101, "Laptop", 2),
        (102, "Mouse", 2),
        (103, "Keyboard", 1),
        (104, "Monitor", 3)
    ]
    orders_schema = StructType([
        StructField("order_id", IntegerType(), True),
        StructField("product", StringType(), True),
        StructField("user_id", IntegerType(), True)
    ])
    orders_df = spark.createDataFrame(data=orders_data, schema=orders_schema)

    print("Orders Dataset:")
    orders_df.show()

    print("Joined Dataset:")
    joined_df = users_df.join(orders_df, on="user_id", how="inner")
    joined_df.show()
    
    spark.stop()


if __name__ == "__main__":
    join_two_datasets()
