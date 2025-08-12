import pyspark
from pyspark.sql import SparkSession
from pyspark.sql import Row
import os

os.environ['PYSPARK_PYTHON'] = "C:\\python\\python.exe"

spark = SparkSession.builder \
    .appName("App_Rdd_Demo") \
    .master("local[*]") \
    .config("spark.ui.enabled", "true") \
    .getOrCreate()

print("Spark UI:", spark.sparkContext.uiWebUrl)

data = ["apple", "banana", "carrot"]
rdd = spark.sparkContext.parallelize(data)
print(data) 
print(rdd.collect())

mapped_rdd = rdd.map(lambda x: Row(value=x))
df = spark.createDataFrame(mapped_rdd)
df.show()

# Word Count with Sorting

data = [
    "apple banana apple",
    "banana carrot apple",
    "banana banana carrot"
]

rdd = spark.sparkContext.parallelize(data) #Create RDD
words_rdd = rdd.flatMap(lambda line: line.split(" ")) #flatMap to split words
pair_rdd = words_rdd.map(lambda word: (word, 1))#map to (word, 1)
#reduceByKey to count words
count_rdd = pair_rdd.reduceByKey(lambda a, b: a + b) # type: ignore
#sortBy to sort by count (descending)
sorted_rdd = count_rdd.sortBy(lambda pair: pair[1], ascending=False) # type: ignore

for word, count in sorted_rdd.take(10):
    print(f"{word}: {count}")

# Find Top N Most Frequent Elements
N = 2

# Word Count Logic
top_n = (
    rdd.flatMap(lambda line: line.split(" "))#split into words
       .map(lambda word: (word, 1))#map to (word, 1)
       .reduceByKey(lambda a, b: a + b) #count occurrences # type: ignore
       .sortBy(lambda pair: pair[1], ascending=False) #sort by count desc # type: ignore
       .take(N)#take top N
)

#result
print(f"Top {N} most frequent elements:")
for word, count in top_n:
    print(f"{word}: {count}")

input("press enter to stop: ")
spark.stop()



