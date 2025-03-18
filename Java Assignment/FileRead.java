import java.io.*;
public class FileRead {
    public static void main(String[] args) {
        try {
            FileReader file = new FileReader("example.txt"); //file to read
            BufferedReader reader = new BufferedReader(file);
            String line;
            
            while ((line = reader.readLine()) != null) { //read line by line
                System.out.println(line);
            }
            
            reader.close();
        } catch (IOException e) {
            System.out.println("File not found");
        }
    }
}
