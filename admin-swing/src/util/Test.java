package util;

import java.io.IOException;

public class Test {
    public static void main(String[] args) {
        try {
            String response = HttpHelper.getAllUserData("paige_phan_","MyP@ssw0rd!");
            // String response = HttpHelper.getAllUserData("alice","123");
            System.out.println(response);
            
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
