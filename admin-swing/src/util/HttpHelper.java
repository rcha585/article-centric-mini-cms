package util;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpHelper {

    private static final java.net.http.HttpClient client = java.net.http.HttpClient.newBuilder().build();

    public static String sendPostThenGet(String signinURL, String getUsersURL) throws IOException, InterruptedException {
        String json = "{\"username\": \"paige_phan\",\"password\": \"MyP@ssw0rd!\"}";

        // Send POST (Sign In)
        HttpRequest postRequest = HttpRequest.newBuilder()
                .uri(URI.create(signinURL))
                .header("Content-Type", "application/json") 
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> postResponse = client.send(postRequest, HttpResponse.BodyHandlers.ofString());
        

        // Optional: print or log the response
        // System.out.println("POST Response: " + postResponse.body());

        // String token = extractTokenFromResponse(postResponse.body()); 
        String cookie = postResponse.headers().firstValue("Set-Cookie").orElse("");

        // Send GET with Authorization header or Cookie
        HttpRequest getRequest = HttpRequest.newBuilder()
        .uri(URI.create(getUsersURL))
        .header("Cookie", cookie)  // if using session cookie
        .GET()
        .build();

        HttpResponse<String> getResponse = client.send(getRequest, HttpResponse.BodyHandlers.ofString());

        return getResponse.body();
    }
    
    // public static String sendGet(String urlStr) throws IOException, InterruptedException {
    //     HttpRequest request = HttpRequest.newBuilder()
    //             .uri(URI.create(urlStr))
    //             .GET() // version 11+ default GET() if no method is set
    //             .build();

    //     HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    //     return response.body(); // return the response instead of printing
    // }
}
