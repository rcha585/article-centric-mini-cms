package util;

import java.io.IOException;

public class Test {
    public static void main(String[] args) {
        try {
            String response = HttpHelper.sendPostThenGet("http://localhost:3000/api/auth/login","http://localhost:3000/api/users?username=paige_phan");
            System.out.println(response);
            
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
