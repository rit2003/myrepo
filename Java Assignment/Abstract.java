//Abstract class
abstract class Animal {
    abstract void makeSound(); //Abstract method
    void sleep() {
        System.out.println("Sleeping...");
    }
}
//concrete class extending abstract class
class Dog extends Animal {
    void makeSound() {
        System.out.println("Barks");
    }
}
public class Abstract {
    public static void main(String[] args) {
        Animal myDog = new Dog();
        myDog.makeSound(); // Output Dog barks
        myDog.sleep();     // Output Sleeping...
    }
}
