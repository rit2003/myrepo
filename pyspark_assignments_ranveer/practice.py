import pyspark
from pyspark.sql import SparkSession
from pyspark.sql import Row
import sys
import os 
os.environ['PYSPARK_PYTHON'] = "C:\\python\\python.exe"

def createSparkSession(app_name):
    spark = SparkSession.builder\
        .appName(app_name)\
        .master("local[*]")\
        .config("spark.ui.enabled","True")\
        .getOrCreate()
    print("Spark UI:", spark.sparkContext.uiWebUrl)
    return spark

def joinTwoDatasets(spark):
    emp = [(1,"a"),(2,"b"),(3,"c")]
    dept = [(1,"HR"),(2,"IT"),(3,"Finance")]
    emp_rdd = spark.sparkContext.parallelize(emp)
    dept_rdd = spark.sparkContext.parallelize(dept)
    emp_df = spark.createDataFrame(emp_rdd,["id", "name"])    
    dept_df = spark.createDataFrame(dept_rdd,["id", "department"])
    joined_df = emp_df.join(dept_df, on="id", how="inner")
    # joined_df.show()
    joined_df.explain() # explain physical plan 


def main():
    try:
        spark = createSparkSession(app_name="rdd_demo_app")
        joinTwoDatasets(spark)
    except Exception as exc:
        print("Log:{exc}")
        sys.exit()
    finally:
        spark.stop()

    

if __name__ == "__main__":
    main()

