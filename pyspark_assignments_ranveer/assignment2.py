# While Performing below exercises, one should be using spark dataframes, keep track of Spark UI logs and DAG, also Identify the operation which performs shuffling.
# Ways to create schema in pyspark and generate dataset with few records
# Problem: Calculate percentage revenue increased per year (dataset - cols [id,org_id, year, revenue])
# Problem: find the process that took the maximum time to execute in hours. (dataset - cols [process_id,process_name, strt_dt_time, end_dt_time])
# Problem: Download any free available dataset in CSV format. Read it from your local and system and write it in multiple formats discussed
# Problem: you have a dataframe with columns empid, empname, salary, department. You need to write this dataframe on HDFS but before writing you need to decrease the salary of all employees of the HR department by 10%.

import pyspark
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.window import Window
from pyspark.sql.functions import when, col, round
import os

os.environ['PYSPARK_PYTHON'] = "C:\\python\\python.exe"
spark = SparkSession.builder \
    .appName("App_Rdd_Demo") \
    .master("local[*]") \
    .config("spark.ui.enabled", "true") \
    .getOrCreate()
print("Spark UI:", spark.sparkContext.uiWebUrl)

# Problem 1
data = [
    (1, "ORG_A", 2019, 1000.0),
    (2, "ORG_A", 2020, 1500.0),
    (3, "ORG_A", 2021, 1800.0),
    (4, "ORG_B", 2019, 2000.0),
    (5, "ORG_B", 2020, 1000.0),
    (6, "ORG_B", 2021, 1200.0),
]
schema = ["id","org_id","year","revenue"]
df = spark.createDataFrame(data, schema=schema)

w = Window.partitionBy("org_id").orderBy("year")
df2 = df.withColumn("prev_revenue", F.lag("revenue").over(w)) \
        .withColumn("pct_change", 
                    F.when(F.col("prev_revenue").isNull(), None) \
                     .when(F.col("prev_revenue")==0, None) \
                     .otherwise(((F.col("revenue") - F.col("prev_revenue")) / F.col("prev_revenue")) * 100)
                   )
df2.select("org_id","year","revenue","prev_revenue","pct_change").orderBy("org_id","year").show(truncate=False)


#problem 2
data = [
    (101, "proc_A", "2025-08-01 10:00:00", "2025-08-01 15:30:00"),
    (102, "proc_B", "2025-08-01 09:00:00", "2025-08-01 12:00:00"),
    (103, "proc_C", "2025-08-01 20:00:00", "2025-08-02 02:00:00"),
]
schema = ["process_id","process_name","strt_dt_time","end_dt_time"]
proc_df = spark.createDataFrame(data, schema=schema)

proc_df2 = proc_df \
    .withColumn("start_ts", F.to_timestamp("strt_dt_time", "yyyy-MM-dd HH:mm:ss")) \
    .withColumn("end_ts", F.to_timestamp("end_dt_time", "yyyy-MM-dd HH:mm:ss")) \
    .withColumn("duration_hours", (F.col("end_ts").cast("long") - F.col("start_ts").cast("long"))/3600)

proc_df2.select("process_id","process_name","duration_hours").orderBy(F.col("duration_hours").desc()).show(1, truncate=False)
# Or get the row:
max_proc = proc_df2.orderBy(F.col("duration_hours").desc()).limit(1)
max_proc.show(truncate=False)

#problem 3
csv_path = "student.csv"

df = (spark.read 
    .option("header", "true")  
    .option("inferSchema", "true") 
    .csv(csv_path)
)
df.show()

# Write as Parquet
df.write.mode("overwrite").parquet("student_parquet")

# Write as JSON
df.write.mode("overwrite").json("student_json")

# Write as ORC
df.write.mode("overwrite").orc("student_orc")

# Write as CSV
df.write.mode("overwrite").option("header", "true").csv("student_csv_out")

# problem 4 
emp_data = [
    (1, "Alice", 50000.0, "HR"),
    (2, "Bob", 60000.0, "Finance"),
    (3, "Carol", 55000.0, "HR")
]

df_emp = spark.createDataFrame(emp_data, ["empid", "empname", "salary", "department"])
df_emp.show()

df_updated = df_emp.withColumn(
    "salary", 
    when(col("department") == "HR", round(col("salary") * 0.90, 2))
    .otherwise(col("salary"))
)

df_updated.show()
# running hdfs node
df_updated.write.mode("overwrite").parquet("hdfs://namenode:9000/user/yourname/emp_salaries") 
df_updated.write.mode("overwrite").parquet("emp_salaries")#local 
# partioning by department 
# df_updated.write.mode("overwrite").partitionBy("department").parquet("file:///C:/data/emp_salaries_partitioned")


