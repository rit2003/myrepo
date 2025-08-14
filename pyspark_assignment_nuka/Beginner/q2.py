#Implement a Python Spark program to filter lines containing a specific keyword.
from pyspark import SparkContext

def filter_lines_with_keyword():
    sc = SparkContext("local[*]", "KeywordFilterApp")

    data = [
        "Apache Spark is a unified analytics engine",
        "for large-scale data processing.",
        "Spark provides an interface for programming",
        "entire clusters with implicit data parallelism",
        "and fault tolerance. This is a great tool."
    ]
    lines_rdd = sc.parallelize(data)
    keyword = "Spark"
    
    filtered_lines_rdd = lines_rdd.filter(lambda line: keyword in line)
    results = filtered_lines_rdd.collect()

    print(f"\n Lines containing the keyword '{keyword}':")
    for line in results:
        print(line)

    sc.stop()

if __name__ == "__main__":
    filter_lines_with_keyword()