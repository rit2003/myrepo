//defining an interface
interface Vehicle {
    void start(); //Abstract method
}
//Implementing interface
class Car implements Vehicle {
    public void start() {
        System.out.println("Car is starting...");
    }
}
public class Interface {
    public static void main(String[] args) {
        Vehicle myCar = new Car();
        myCar.start(); //Output
    }
}
