package util;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpHelper {

    private static final java.net.http.HttpClient client = java.net.http.HttpClient.newBuilder().build();
    // String token = extractTokenFromResponse(postResponse.body()); 
    private static String cookie;

    // public static int sendPostThenGet(String userName, String passWord) throws IOException, InterruptedException {
    //     String json = "{\"username\": \""+userName+"\",\"password\": \""+passWord+"\"}";

    //     // ("http://localhost:3000/api/auth/login", "http://localhost:3000/api/users?username=paige_phan")
    //     String signinURL = "http://localhost:3000/api/auth/login";
    //     String userAuthURL = "http://localhost:3000/api/auth/me";
    //     String getUsersURL = "http://localhost:3000/api/users?username="+userName;

    //     // Send POST (Sign In)
    //     HttpRequest postRequest = HttpRequest.newBuilder()
    //             .uri(URI.create(signinURL))
    //             .header("Content-Type", "application/json") 
    //             .POST(HttpRequest.BodyPublishers.ofString(json))
    //             .build();

    //     HttpResponse<String> postResponse = client.send(postRequest, HttpResponse.BodyHandlers.ofString());
        

    //     // Optional: print or log the response
    //     // System.out.println("POST Response: " + postResponse.body());

    //     // // String token = extractTokenFromResponse(postResponse.body()); 
    //     String cookie = postResponse.headers().firstValue("Set-Cookie").orElse("");

    //     // Send GET with Authorization header or Cookie
    //     HttpRequest getRequest = HttpRequest.newBuilder()
    //     .uri(URI.create(userAuthURL))
    //     .header("Cookie", cookie)  // if using session cookie
    //     .GET()
    //     .build();

    //     HttpResponse<String> getResponse = client.send(getRequest, HttpResponse.BodyHandlers.ofString());
        
    //     String response = getResponse.body();

    //     int isAdmin = 0;
    //         String key = "\"is_admin\":";
    //         int index = response.indexOf(key);
    //         if (index != -1) {
    //             int start = index + key.length();
    //             int end = response.indexOf(",", start); // assumes comma follows
    //             if (end == -1) {
    //                 end = response.indexOf("}", start); // fallback
    //             }
    //             String value = response.substring(start, end).trim();
    //             isAdmin = Integer.parseInt(value);
    //         }

    //     // if (isAdmin ==1) {

    //     // }


    //     // Send GET with Authorization header or Cookie
    //     HttpRequest getAllUserDataRequest = HttpRequest.newBuilder()
    //     .uri(URI.create(getUsersURL))
    //     .header("Cookie", cookie)  // if using session cookie
    //     .GET()
    //     .build();

    //     HttpResponse<String> getAllUserDataResponse = client.send(getAllUserDataRequest, HttpResponse.BodyHandlers.ofString());
        
    //     String allUserDataResponse = getAllUserDataResponse.body();
    //     System.out.println(allUserDataResponse);

    //     return isAdmin;
    // }
    
    // public static String sendGet(String urlStr) throws IOException, InterruptedException {
    //     HttpRequest request = HttpRequest.newBuilder()
    //             .uri(URI.create(urlStr))
    //             .GET() // version 11+ default GET() if no method is set
    //             .build();

    //     HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    //     return response.body(); // return the response instead of printing
    // }


    public static HttpResponse<String> sendLoginRequest(String userName, String passWord) throws IOException, InterruptedException {
        String json = "{\"username\": \""+userName+"\",\"password\": \""+passWord+"\"}";

        // ("http://localhost:3000/api/auth/login", "http://localhost:3000/api/users?username=paige_phan")
        String signinURL = "http://localhost:3000/api/auth/login";

        // Send POST (Sign In)
        HttpRequest postRequest = HttpRequest.newBuilder()
                .uri(URI.create(signinURL))
                .header("Content-Type", "application/json") 
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> postResponse = client.send(postRequest, HttpResponse.BodyHandlers.ofString());
        return postResponse;    
    }

    public static int checkUserIsAdmin(String userName, String passWord) throws IOException, InterruptedException{

        String userAuthURL = "http://localhost:3000/api/auth/me";
        // String getUsersURL = "http://localhost:3000/api/users?username="+userName;
        cookie = sendLoginRequest(userName, passWord).headers().firstValue("Set-Cookie").orElse("");

        // Send GET with Authorization header or Cookie
        HttpRequest getRequest = HttpRequest.newBuilder()
        .uri(URI.create(userAuthURL))
        .header("Cookie", cookie)  // if using session cookie
        .GET()
        .build();

        HttpResponse<String> getResponse = client.send(getRequest, HttpResponse.BodyHandlers.ofString());
        
        String response = getResponse.body();

        int isAdmin = 0;
            String key = "\"is_admin\":";
            int index = response.indexOf(key);
            if (index != -1) {
                int start = index + key.length();
                int end = response.indexOf(",", start); // assumes comma follows
                if (end == -1) {
                    end = response.indexOf("}", start); // fallback
                }
                String value = response.substring(start, end).trim();
                isAdmin = Integer.parseInt(value);
            }

        return isAdmin;
    }

    public static void sendLogoutRequest() throws IOException, InterruptedException {
        // Send POST (Sign Out) if user is valid but not admin
        String signOutURL = "http://localhost:3000/api/auth/logout";
        HttpRequest postRequest = HttpRequest.newBuilder()
                .uri(URI.create(signOutURL))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> postResponse = client.send(postRequest, HttpResponse.BodyHandlers.ofString());
        // System.out.println("Signout success: "+postResponse.statusCode());
        if (postResponse.statusCode() !=204) {
            System.out.println("Logout was uncessfull");
        }
        else {
            System.out.println("Logout was sucessfull");
        }
    }

    public static String getAllUserData(String userName, String passWord) throws IOException, InterruptedException {
        String response;
        if (checkUserIsAdmin(userName, passWord) ==0){

            sendLogoutRequest();
            // // Send POST (Sign Out) if user is valid but not admin
            // String signOutURL = "http://localhost:3000/api/auth/logout";
            // HttpRequest postRequest = HttpRequest.newBuilder()
            //         .uri(URI.create(signOutURL))
            //         .POST(HttpRequest.BodyPublishers.noBody())
            //         .build();

            // HttpResponse<String> postResponse = client.send(postRequest, HttpResponse.BodyHandlers.ofString());
            // // System.out.println("Signout success: "+postResponse.statusCode());
            // if (postResponse.statusCode() !=204) {
            //     System.out.println("Logout was uncessfull");
            // }

            response = "Unauthorized login, please try again";
        }
        else {
        String getUsersURL = "http://localhost:3000/api/users?username="+userName;
        // Send GET with Authorization header or Cookie
        HttpRequest getRequest = HttpRequest.newBuilder()
        .uri(URI.create(getUsersURL))
        .header("Cookie", cookie)  // if using session cookie
        .GET()
        .build();

        HttpResponse<String> getResponse = client.send(getRequest, HttpResponse.BodyHandlers.ofString());
        response = getResponse.body();
        }
        return response;
    }


}
