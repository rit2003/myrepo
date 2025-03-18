class Student {
    //Private data members (Data Hiding)
    private String name;
    private int age;
    private String studentId;
    public Student(String name, int age, String studentId) {
        this.name = name;
        this.age = age;
        this.studentId = studentId;
    }
    //getter and setter method for name 
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    //getter and setter method for age
    public int getAge() {
        return age;
    }
    // Validating age before setting it
    public void setAge(int age) {
        if (age > 0) {
            this.age = age;
        } else {
            System.out.println("Age cannot be negative or zero.");
        }
    }
    //getter and setter method for studentId
    public String getStudentId() {
        return studentId;
    }
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
    //Method to display student details
    public void displayStudentInfo() {
        System.out.println("Student Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Student ID: " + studentId);
    }
}
public class Encapsulation{
    public static void main(String[] args) {
        Student student = new Student("Ritika", 21, "S12345");
        //Accessing private data using getters and setters
        System.out.println("Initial Student Details:");
        student.displayStudentInfo();
        //Updating student name and age using setters
        student.setName("Aarav");
        student.setAge(22);

        System.out.println("\nUpdated Student Details:");
        student.displayStudentInfo();
    }
}
