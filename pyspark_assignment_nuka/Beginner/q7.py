# Implement a Python Spark job to group data by a column and count rows per group
from pyspark.sql import SparkSession

def group_and_count():

    spark = SparkSession.builder \
        .appName("GroupAndCountApp") \
        .master("local[*]") \
        .getOrCreate()

    #sample dataset(Employees)
    employee_data = [
        ("Ritika", "Sales"),
        ("Rohan", "Engineering"),
        ("Palak", "Sales"),
        ("Diya", "Engineering"),
        ("Evan", "HR"),
        ("Jasmine", "Engineering")
    ]
    columns = ["name", "department"]
    df = spark.createDataFrame(employee_data, columns)

    print("Employee Dataset:")
    df.show()

    department_counts_df = df.groupBy("department").count()
    department_counts_df = department_counts_df.alias("employee_count")

    print("Row Count Per Department:")
    department_counts_df.show()

    spark.stop()


if __name__ == "__main__":
    group_and_count()
